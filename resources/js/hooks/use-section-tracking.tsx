import { useEffect } from 'react';
import { useAnalytics } from './use-analytics';

export function useSectionTracking() {
    const { trackSectionView } = useAnalytics();

    useEffect(() => {
        const observed = new WeakSet<Element>();
        const seen = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const section = entry.target as HTMLElement;
                    if (!entry.isIntersecting || !section.id || seen.has(section.id)) return;

                    seen.add(section.id);
                    trackSectionView(section.id);
                    observer.unobserve(section);
                });
            },
            { threshold: 0.25 },
        );

        const observeSections = () => {
            document.querySelectorAll('section[id]').forEach((section) => {
                if (observed.has(section)) return;
                observed.add(section);
                observer.observe(section);
            });
        };

        observeSections();
        const mutationObserver = new MutationObserver(observeSections);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            mutationObserver.disconnect();
            observer.disconnect();
        };
    }, [trackSectionView]);
}
