import { useEffect, useRef } from 'react';

export function useScroll() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        setTimeout(
            () =>
                scrollRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                }),
            500,
        );
    }, []);
    return scrollRef;
}
