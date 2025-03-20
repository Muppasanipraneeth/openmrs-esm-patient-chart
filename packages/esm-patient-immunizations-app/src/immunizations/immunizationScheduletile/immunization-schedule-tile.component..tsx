import React from 'react';
import { useImmunizations } from '../../hooks/useImmunizations';
import styles from './immunization-schedule-title.scss';
import {
  Grid,
  Column,
  Tile,
  SkeletonText,
  Button,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from '@carbon/react';
import { ErrorState, formatDate, parseDate } from '@openmrs/esm-framework';

interface ImmunizationScheduleTileProps {
  patientUuid: string;
}

const ImmunizationScheduleTile: React.FC<ImmunizationScheduleTileProps> = ({ patientUuid }) => {
  const { data: existingImmunizations, error, isLoading } = useImmunizations(patientUuid);

  const formatDateString = (date: string) => {
    return formatDate(parseDate(date), { mode: 'standard', time: 'for today' });
  };

  if (isLoading) {
    return <SkeletonText heading width="200px" className={styles.skeleton} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle="Immunization Schedule" />;
  }

  return (
    <div className={styles.immunizationSchedule}>
      <h1 className={styles.title}>Immunization Schedule</h1>
      <Grid fullWidth narrow className={styles.immunizationGrid}>
        <Column sm={4} md={8} lg={16} className={styles.container}>
          <div className={styles.vaccineRows}>
            {existingImmunizations?.length !== 0 ? (
              existingImmunizations.map((immunization, index) => (
                <div key={index} className={styles.vaccineRow}>
                  <div className={styles.vaccineName}>
                    <Tile>{immunization.vaccineName}</Tile>
                  </div>
                  <div className={styles.vaccineItem}>
                    {immunization.existingDoses.map((dose, doseIndex) => (
                      <div key={doseIndex} className={styles.doseItem}>
                        <ExpandableTile
                          id={`expandable-tile-${index}-${doseIndex}`}
                          tileCollapsedIconText="Expand"
                          tileExpandedIconText="Collapse"
                          className={styles.expandableTile}
                        >
                          <TileAboveTheFoldContent>
                            <div className={styles.aboveFold}>
                              <div className={styles.doseNumber}>{dose.doseNumber}</div>
                              <div className={styles.doseDate}>{formatDateString(dose.occurrenceDateTime)}</div>
                            </div>
                          </TileAboveTheFoldContent>
                          <TileBelowTheFoldContent>
                            <div className={styles.belowFold}>
                              <div>Administered by: Dr</div>
                              <div>Location: Clinic A</div>
                              <div>Notes: Routine vaccination</div>
                            </div>
                          </TileBelowTheFoldContent>
                        </ExpandableTile>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Tile className={styles.emptyState}>
                <p>No immunization data available yet.</p>
                <span>Check back later or consult your healthcare provider.</span>
              </Tile>
            )}
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default ImmunizationScheduleTile;
