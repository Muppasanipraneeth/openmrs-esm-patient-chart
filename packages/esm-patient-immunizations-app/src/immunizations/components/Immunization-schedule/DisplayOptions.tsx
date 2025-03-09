import React from 'react';
import styles from '../../immunization-schedule.component.scss';
interface DisplayOptionsProps {
  showDoseLabels: boolean;
  setShowDoseLabels: (value: boolean) => void;
  showLegend: boolean;
  setShowLegend: (value: boolean) => void;
}

export const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showDoseLabels,
  setShowDoseLabels,
  showLegend,
  setShowLegend,
}) => {
  return (
    <div className={styles.displayOptionsContainer}>
      <div className={styles.displayOptions}>
        <label>
          <input type="checkbox" checked={showDoseLabels} onChange={() => setShowDoseLabels(!showDoseLabels)} />
          Show Dose Labels
        </label>
        <label>
          <input type="checkbox" checked={showLegend} onChange={() => setShowLegend(!showLegend)} />
          Show Legend
        </label>
      </div>
    </div>
  );
};
