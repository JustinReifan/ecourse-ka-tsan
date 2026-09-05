import { useEffect, useRef, useState, type ReactNode } from 'react';

interface PlaceholderHeight {
    mobile: number;
    lg: number;
}

interface LazySectionProps {
    children: ReactNode;
    className?: string;
    /**
     * Height (px) reserved while the section is unmounted. Should match the section's
     * real rendered height at each breakpoint, so mounting it swaps placeholder ->
     * content without moving anything (no layout shift / CLS).
     */
    placeholderHeight?: number | PlaceholderHeight;
}

function usePlaceholderHeight(value?: number | PlaceholderHeight) {
    const [height, setHeight] = useState(() => (typeof value === 'number' ? value : value?.mobile ?? 0));

    useEffect(() => {
        if (typeof value === 'number' || !value) return;

        const mq = window.matchMedia('(min-width: 1024px)');
        const update = () => setHeight(mq.matches ? value.lg : value.mobile);
        update();

        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, [value]);

    return height;
}

/**
 * Defers rendering of below-the-fold content until it is close to the viewport.
 * Keeps the initial DOM small, which cuts main-thread work (TBT/TTI) and
 * style/layout cost on first load.
 *
 * The placeholder height is applied as an INLINE style on purpose: the app
 * stylesheet is loaded non-blockingly (media=print swap), so a CSS class would
 * not be in effect when the IntersectionObserver first runs and every
 * placeholder would appear 0px tall, causing all sections to mount at once.
 */
export function LazySection({ children, className, placeholderHeight }: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const height = usePlaceholderHeight(placeholderHeight);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '1500px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        // The min-height is kept permanently (not removed when the section mounts):
        // if it were dropped at the moment visible flips true, the lazy chunk may
        // still be loading and the div would collapse to 0px, moving the footer
        // and causing layout shift. Keeping the reserved height means mounting
        // swaps placeholder -> content with zero layout movement.
        <div ref={ref} className={className} style={{ minHeight: `${height}px` }}>
            {visible ? children : null}
        </div>
    );
}