import React from 'react';
import { useImmunizations } from '../../hooks/useImmunizations';
import styles from './immunization-schedule.scss';
import { Grid, Column, Tile, SkeletonText } from '@carbon/react';
import { ErrorState } from '@openmrs/esm-framework';
import ExpandableTileComponent from './expandable-tile-component';

interface ImmunizationScheduleTileProps {
  patientUuid: string;
}

const vaccineNameAbbreviations = {
  'Bacillus Calmette–Guérin vaccine': 'BCG Vaccine',
  'Polio vaccination, oral': 'OPV Vaccine',
  'Diphtheria tetanus and pertussis vaccination': 'DTP Vaccine',
  'Vitamin A': 'Vitamin A',
};

const ImmunizationSchedule: React.FC<ImmunizationScheduleTileProps> = ({ patientUuid }) => {
  const { data: existingImmunizations, error, isLoading } = useImmunizations(patientUuid);

  if (isLoading) {
    return <SkeletonText heading width="200px" className={styles.skeleton} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle="Immunization Schedule" />;
  }

  return (
    <div className={styles.immunizationSchedule}>
      <Grid fullWidth narrow className={styles.immunizationGrid}>
        <Column sm={4} md={8} lg={16} className={styles.container}>
          <div className={styles.vaccineRows}>
            {existingImmunizations?.length > 0
              ? existingImmunizations.map((immunization, index) => {
                  const sortedDoses = [...immunization.existingDoses].sort(
                    (a, b) => new Date(a.occurrenceDateTime).getTime() - new Date(b.occurrenceDateTime).getTime(),
                  );
                  const displayVaccineName =
                    vaccineNameAbbreviations[immunization.vaccineName] || immunization.vaccineName;

                  return (
                    <div key={index} className={styles.vaccineRow}>
                      <div className={styles.vaccineName}>
                        <Tile className={styles.vaccineName}>{displayVaccineName}</Tile>
                      </div>
                      <div className={styles.vaccineItem}>
                        {sortedDoses.map((dose, doseIndex) => (
                          <div key={doseIndex} className={styles.doseItem}>
                            <ExpandableTileComponent
                              index={index}
                              doseIndex={doseIndex}
                              dose={{
                                ...dose,
                                vaccineName: immunization.vaccineName,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default ImmunizationSchedule;
