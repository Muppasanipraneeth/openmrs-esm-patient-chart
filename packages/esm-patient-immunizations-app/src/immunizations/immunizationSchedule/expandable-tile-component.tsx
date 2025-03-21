// ExpandableTileComponent.tsx
import React from 'react';
import { ExpandableTile, TileAboveTheFoldContent, TileBelowTheFoldContent } from '@carbon/react';
import styles from './immunization-schedule.scss'; // Reuse the same SCSS file
import { formatDate, parseDate, SyringeIcon } from '@openmrs/esm-framework';

interface Dose {
  doseNumber: number;
  occurrenceDateTime: string;
  vaccineName: string;
  lotNumber: string;
  expirationDate: string;
  validUntil?: string;
  reaction?: string;
  notes?: string;
}

interface ExpandableTileComponentProps {
  index: number;
  doseIndex: number;
  dose: Dose;
}

const ExpandableTileComponent: React.FC<ExpandableTileComponentProps> = ({ index, doseIndex, dose }) => {
  const formatDateString = (date: string) => {
    return formatDate(parseDate(date), { mode: 'standard', time: 'for today' });
  };

  return (
    <ExpandableTile
      id={`expandable-tile-${index}-${doseIndex}`}
      tileCollapsedIconText="Expand"
      tileExpandedIconText="Collapse"
      className={styles.compactExpandableTile}
    >
      <TileAboveTheFoldContent>
        <div className={styles.aboveFold}>
          <div className={styles.doseDate}>{formatDateString(dose.occurrenceDateTime)}</div>
          <div className={styles.doseNumber}>
            <SyringeIcon /> Dose : {dose.doseNumber}
          </div>
        </div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div className={styles.belowFold}>
          <div className={styles.vaccineDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Lot:</span>
              <span className={styles.value}>{dose.lotNumber}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Exp:</span>
              <span className={styles.value}>{formatDateString(dose.expirationDate)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Valid:</span>
              <span className={styles.value}>{formatDateString(dose.validUntil)}</span>
            </div>
            {dose.reaction && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Reaction:</span>
                <span className={styles.value}>{dose.reaction}</span>
              </div>
            )}
            <div className={styles.notesSection}>
              <span className={styles.label}>Notes:</span>
              <span className={styles.notes}>{dose.notes || 'N/A'}</span>
            </div>
          </div>
        </div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
};

export default ExpandableTileComponent;
