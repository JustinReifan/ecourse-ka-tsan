<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\UserAnalytic;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AbTestingService
{
    /**
     * Get Performance Matrix - The Leaderboard
     * Groups data by landing_source and calculates core metrics
     */
    public function getPerformanceMatrix(Carbon $startDate, Carbon $endDate): Collection
    {
        // Get all valid landing sources with their session data
        $landingSources = $this->getValidLandingSources($startDate, $endDate);

        if ($landingSources->isEmpty()) {
            return collect([]);
        }

        $matrix = collect([]);

        foreach ($landingSources as $source) {
            $landingSource = $source->landing_source;
            
            // Get unique sessions for this landing source
            $visitSessions = $this->getSessionsByEventAndSource('visit', $landingSource, $startDate, $endDate);
            $engagementSessions = $this->getSessionsByEventAndSource('engagement', $landingSource, $startDate, $endDate);
            $conversionSessions = $this->getSessionsByEventAndSource('conversion', $landingSource, $startDate, $endDate);
            $paymentSessions = $this->getSessionsByEventAndSource('payment', $landingSource, $startDate, $endDate);

            $visits = $visitSessions->count();
            $engagements = $engagementSessions->count();
            $conversions = $conversionSessions->count();
            $payments = $paymentSessions->count();

            // Calculate revenue from payment events
            $revenue = $this->getRevenueBySource($landingSource, $startDate, $endDate);

            // Bounce Rate: Sessions with visit but NO engagement
            $bounced = $visitSessions->diff($engagementSessions)->count();
            $bounceRate = $this->safeDivide($bounced, $visits) * 100;

            // Lead CR: Unique conversion sessions / Unique visit sessions
            $leadCR = $this->safeDivide($conversions, $visits) * 100;

            // Strict CR: Unique payment sessions / Unique visit sessions
            $strictCR = $this->safeDivide($payments, $visits) * 100;

            // RPV: Revenue / Unique Visits
            $rpv = $this->safeDivide($revenue, $visits);

            $matrix->push([
                'landing_source' => $landingSource,
                'visits' => $visits,
                'bounce_rate' => round($bounceRate, 2),
                'lead_cr' => round($leadCR, 2),
                'strict_cr' => round($strictCR, 2),
                'rpv' => round($rpv, 2),
                'revenue' => $revenue,
                'conversions' => $conversions,
                'payments' => $payments,
            ]);
        }

        // Sort by RPV descending
        return $matrix->sortByDesc('rpv')->values();
    }

    /**
     * Get Split Funnel - The Journey
     * Returns step-by-step counts for each landing page
     */
    public function getSplitFunnel(Carbon $startDate, Carbon $endDate): Collection
    {
        $landingSources = $this->getValidLandingSources($startDate, $endDate);

        if ($landingSources->isEmpty()) {
            return collect([]);
        }

        $funnel = collect([]);

        foreach ($landingSources as $source) {
            $landingSource = $source->landing_source;

            // 1. Visits: Total traffic
            $visitSessions = $this->getSessionsByEventAndSource('visit', $landingSource, $startDate, $endDate);
            $visits = $visitSessions->count();

            // 2. Engaged: Sessions with dwell time > 15s
            $engagedSessions = $this->getEngagedSessions($landingSource, $startDate, $endDate);
            $engaged = $engagedSessions->count();

            // 3. Intent: Sessions with cta_click
            $intentSessions = $this->getSessionsByEventAndSource('cta_click', $landingSource, $startDate, $endDate);
            $intent = $intentSessions->count();

            // 4. Leads: Sessions with conversion
            $leadSessions = $this->getSessionsByEventAndSource('conversion', $landingSource, $startDate, $endDate);
            $leads = $leadSessions->count();

            // 5. Sales: Sessions with payment
            $salesSessions = $this->getSessionsByEventAndSource('payment', $landingSource, $startDate, $endDate);
            $sales = $salesSessions->count();

            $funnel->push([
                'landing_source' => $landingSource,
                'steps' => [
                    ['stage' => 'Visits', 'count' => $visits, 'percentage' => 100],
                    ['stage' => 'Engaged', 'count' => $engaged, 'percentage' => round($this->safeDivide($engaged, $visits) * 100, 1)],
                    ['stage' => 'Intent', 'count' => $intent, 'percentage' => round($this->safeDivide($intent, $visits) * 100, 1)],
                    ['stage' => 'Leads', 'count' => $leads, 'percentage' => round($this->safeDivide($leads, $visits) * 100, 1)],
                    ['stage' => 'Sales', 'count' => $sales, 'percentage' => round($this->safeDivide($sales, $visits) * 100, 1)],
                ],
            ]);
        }

        return $funnel;
    }

    /**
     * Get Quality Analysis - Buyer vs Non-Buyer comparison
     */
    public function getQualityAnalysis(Carbon $startDate, Carbon $endDate): Collection
    {
        $landingSources = $this->getValidLandingSources($startDate, $endDate);

        if ($landingSources->isEmpty()) {
            return collect([]);
        }

        $analysis = collect([]);

        foreach ($landingSources as $source) {
            $landingSource = $source->landing_source;

            // Get all sessions for this landing source
            $allSessions = $this->getSessionsBySource($landingSource, $startDate, $endDate);
            
            // Segment A: Buyers (sessions with payment)
            $buyerSessions = $this->getSessionsByEventAndSource('payment', $landingSource, $startDate, $endDate);
            
            // Segment B: Non-Buyers (sessions without payment)
            $nonBuyerSessions = $allSessions->diff($buyerSessions);

            // Calculate metrics for Buyers
            $buyerMetrics = $this->calculateQualityMetrics($buyerSessions, $startDate, $endDate);
            
            // Calculate metrics for Non-Buyers
            $nonBuyerMetrics = $this->calculateQualityMetrics($nonBuyerSessions, $startDate, $endDate);

            $analysis->push([
                'landing_source' => $landingSource,
                'buyers' => [
                    'count' => $buyerSessions->count(),
                    'avg_scroll_depth' => $buyerMetrics['avg_scroll_depth'],
                    'avg_dwell_time' => $buyerMetrics['avg_dwell_time'],
                ],
                'non_buyers' => [
                    'count' => $nonBuyerSessions->count(),
                    'avg_scroll_depth' => $nonBuyerMetrics['avg_scroll_depth'],
                    'avg_dwell_time' => $nonBuyerMetrics['avg_dwell_time'],
                ],
            ]);
        }

        return $analysis;
    }

    /**
     * Get valid landing sources (exclude null, empty, 'unknown')
     */
    private function getValidLandingSources(Carbon $startDate, Carbon $endDate): Collection
    {
        return UserAnalytic::select(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) as landing_source"))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("JSON_EXTRACT(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) != ''")
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) != 'unknown'")
            ->groupBy('landing_source')
            ->get();
    }

    /**
     * Get unique session IDs by event type and landing source
     */
    private function getSessionsByEventAndSource(string $eventType, string $landingSource, Carbon $startDate, Carbon $endDate): Collection
    {
        return UserAnalytic::where('event_type', $eventType)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) = ?", [$landingSource])
            ->distinct()
            ->pluck('session_id');
    }

    /**
     * Get all unique session IDs for a landing source
     */
    private function getSessionsBySource(string $landingSource, Carbon $startDate, Carbon $endDate): Collection
    {
        return UserAnalytic::whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) = ?", [$landingSource])
            ->distinct()
            ->pluck('session_id');
    }

    /**
     * Get engaged sessions (dwell time > 15s)
     */
    private function getEngagedSessions(string $landingSource, Carbon $startDate, Carbon $endDate): Collection
    {
        return UserAnalytic::where('event_type', 'engagement')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) = ?", [$landingSource])
            ->whereRaw("CAST(JSON_EXTRACT(event_data, '$.duration') AS UNSIGNED) > 15")
            ->distinct()
            ->pluck('session_id');
    }

    /**
     * Get total revenue from payment events for a landing source
     */
    private function getRevenueBySource(string $landingSource, Carbon $startDate, Carbon $endDate): float
    {
        $payments = UserAnalytic::where('event_type', 'payment')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.landing_source')) = ?", [$landingSource])
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(event_data, '$.status')) = 'success'")
            ->get();

        return $payments->sum(function ($analytic) {
            return (float) ($analytic->event_data['amount'] ?? 0);
        });
    }

    /**
     * Calculate quality metrics (scroll depth, dwell time) for a set of sessions
     */
    private function calculateQualityMetrics(Collection $sessionIds, Carbon $startDate, Carbon $endDate): array
    {
        if ($sessionIds->isEmpty()) {
            return [
                'avg_scroll_depth' => 0,
                'avg_dwell_time' => 0,
            ];
        }

        // Get max scroll depth per session
        $scrollEvents = UserAnalytic::where('event_type', 'scroll')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('session_id', $sessionIds)
            ->get()
            ->groupBy('session_id')
            ->map(function ($events) {
                return $events->max(function ($event) {
                    return (float) ($event->event_data['depth'] ?? 0);
                });
            });

        $avgScrollDepth = $scrollEvents->isNotEmpty() 
            ? round($scrollEvents->average(), 1) 
            : 0;

        // Get total dwell time per session
        $dwellEvents = UserAnalytic::where('event_type', 'engagement')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('session_id', $sessionIds)
            ->get()
            ->groupBy('session_id')
            ->map(function ($events) {
                return $events->sum(function ($event) {
                    return (float) ($event->event_data['duration'] ?? 0);
                });
            });

        $avgDwellTime = $dwellEvents->isNotEmpty() 
            ? round($dwellEvents->average(), 1) 
            : 0;

        return [
            'avg_scroll_depth' => $avgScrollDepth,
            'avg_dwell_time' => $avgDwellTime,
        ];
    }

    /**
     * Safe division to prevent divide by zero errors
     */
    private function safeDivide(float $numerator, float $denominator): float
    {
        return $denominator > 0 ? $numerator / $denominator : 0;
    }
}
