"use client";
import { useState, useEffect } from "react";
import styles from "./bubble-footer.module.css";

export function BubbleFooter() {
    // State to hold bubbles generated only on client side
    const [bubbles, setBubbles] = useState<Array<{ id: number; size: string; distance: string; position: string; time: string; delay: string }>>([]);

    // Generate random properties for 128 bubbles after component mounts (client only)
    useEffect(() => {
        const generated = Array.from({ length: 128 }, (_, i) => ({
            id: i,
            size: `${2 + Math.random() * 4}rem`,
            distance: `${6 + Math.random() * 4}rem`,
            position: `${-5 + Math.random() * 110}%`,
            time: `${2 + Math.random() * 2}s`,
            delay: `${-1 * (2 + Math.random() * 2)}s`,
        }));
        setBubbles(generated);
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.bubbles}>
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className={styles.bubble}
                        style={{
                            '--size': bubble.size,
                            '--distance': bubble.distance,
                            '--position': bubble.position,
                            '--time': bubble.time,
                            '--delay': bubble.delay,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <div className={styles.content}>
                <div className={styles.branding}>
                    <div className={styles.logo}>
                        <h2 className={styles.hugoText}>HUGO</h2>
                    </div>
                </div>
            </div>

            {/* SVG Filter for blob effect */}
            <svg style={{ position: 'fixed', top: '100vh' }}>
                <defs>
                    <filter id="blob">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="blob"
                        />
                    </filter>
                </defs>
            </svg>
        </footer>
    );
}
