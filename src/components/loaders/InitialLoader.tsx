'use client'
import gsap from "gsap";
import { useEffect, useRef } from "react";

const InitialLoader = ({pageLoader}: {pageLoader?: boolean}) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    useEffect(() => {
        let loader: HTMLElement | null = document.getElementById('loader');
        if (!loader) return;

        tl.current = gsap.timeline({ paused: true });
        tl.current
            .set('.layout_inner', { autoAlpha: 1 })
            .to(loader, { autoAlpha: 0, duration: 0.5, ease: 'power3.out' })
            .set(loader, { display: "none" });

        const timeout = setTimeout(() => {
            if (tl.current) {
                tl.current.play();
            }
        }, 1500);

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    return (
        <div className={`initial-loader ${pageLoader ? 'page-loader' : ''}`} id="loader">
            <div className="loader-container">
                <div className="spinner-loader"></div>
            </div>
        </div>
    );
}

export default InitialLoader;