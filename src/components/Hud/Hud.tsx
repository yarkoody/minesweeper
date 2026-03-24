import type { HudMetricType } from "../../types/HudMetricType";
import styles from "./Hud.module.css";

interface HudProps {
    metrics: HudMetricType[];
    title?: string;
}

export function Hud({ metrics }: HudProps) {
    return (
        <div className={[styles.hud].filter(Boolean).join(" ")}>
            {metrics.map((metric) => (
                <div
                    data-metric-id={metric.id}
                    key={metric.id}
                    className={styles.hudMetric}
                >
                    <span className={styles.hudMetricIcon}>{metric.icon}</span>
                    <span>{metric.value}</span>
                </div>
            ))}
        </div>
    );
}
