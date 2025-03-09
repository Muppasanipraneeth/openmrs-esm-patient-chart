import React from 'react';
import styles from '../../immunization-schedule.component.scss';

interface LegendProps {
  showLegend: boolean;
}

export const Legend: React.FC<LegendProps> = ({ showLegend }) => {
  if (!showLegend) return null;

  return (
    <div className={styles.legend}>
      <div className={styles.legendItems}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.recommended}`}></div>
          <span>Range of recommended ages for all children</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.catchUp}`}></div>
          <span>Range of recommended ages for catch-up immunization</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.highRisk}`}></div>
          <span>Range of recommended ages for certain high-risk groups</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.completed}`}></div>
          <span>Completed</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.notRecommended}`}></div>
          <span>Not routinely recommended</span>
        </div>
      </div>
      <ul className={styles.disclaimers}>
        <li>This schedule includes recommendations in effect as of November 2013.</li>
        <li>
          These recommendations must be read with the footnotes that follow. For those who fall behind or start late,
          provide catch-up vaccination at the earliest opportunity as indicated by the green bars in Figure 1.
        </li>
      </ul>
    </div>
  );
};
