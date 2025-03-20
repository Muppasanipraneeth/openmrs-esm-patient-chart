import React from 'react';
import { useImmunizations } from '../../hooks/useImmunizations';
import { Grid, Column, Tag, Tooltip } from '@carbon/react';
import styles from './immunization-schedule.scss';
import { AddIcon, formatDate, parseDate, useLayoutType } from '@openmrs/esm-framework';

interface ImmunizationScheduleProps {
  patientUuid: string;
}

const ImmunizationSchedule: React.FC<ImmunizationScheduleProps> = ({ patientUuid }) => {
  const { data, error, isLoading, isValidating } = useImmunizations(patientUuid);
  const currentDate = new Date();

  const vaccineNameAbbreviations = {
    'Bacillus Calmette–Guérin vaccine': 'BCG Vaccine',
    'Polio vaccination, oral': 'OPV',
    'Diphtheria tetanus and pertussis vaccination': 'DTP Vaccine',
    'Vitamin A': 'Vitamin A',
  };

  const formatDateString = (dateString: string) => {
    return formatDate(parseDate(dateString), { mode: 'wide', time: 'for today' });
  };
  const getDoseStatus = (dateString: string) => {
    const doseDate = new Date(dateString);
    if (doseDate < currentDate) return 'Complete';
    if (doseDate > currentDate) return 'Scheduled';
    return 'Due Today';
  };

  const isOverdue = (dateString: string) => {
    const doseDate = new Date(dateString);
    return doseDate < currentDate && getDoseStatus(dateString) === 'Scheduled';
  };

  if (isLoading || isValidating) return <div>Loading...</div>;
  if (error) return <div>Error loading immunization data: {error.message}</div>;
  if (!data || data.length === 0) return <div>No immunization data available.</div>;

  return (
    <div className={styles.immunizationSchedule}>
      <h1 className={styles.title}>Immunization History</h1>
      <Grid fullWidth narrow className={styles.immunizationGrid}>
        <Column sm={4} md={8} lg={16} className={styles.container}>
          {data.map((vaccine, index) => {
            const sortedDoses = [...vaccine.existingDoses].sort(
              (a, b) => new Date(a.occurrenceDateTime).getTime() - new Date(b.occurrenceDateTime).getTime(),
            );
            const completedDoses = sortedDoses.filter((dose) => getDoseStatus(dose.occurrenceDateTime) === 'Complete');
            const scheduledDoses = sortedDoses.filter((dose) => getDoseStatus(dose.occurrenceDateTime) !== 'Complete');

            const displayName = vaccineNameAbbreviations[vaccine.vaccineName] || vaccine.vaccineName;

            return (
              <div key={index} className={styles.vaccineRow}>
                <Tooltip label={vaccine.vaccineName} align="top">
                  <div className={styles.vaccineItem}>{displayName}</div>
                </Tooltip>
                <div className={styles.doseRow}>
                  {completedDoses.length > 0 && (
                    <div className={styles.doseSection}>
                      <div className={styles.completedDoses}>
                        {completedDoses.map((dose, dIndex) => (
                          <div key={`${index}-${dIndex}`} className={styles.doseCard}>
                            <div className={styles.doseDate}>{formatDateString(dose.occurrenceDateTime)}</div>
                            <div className={styles.doseInfo}>
                              {dose.doseNumber !== null ? `Dose #${dose.doseNumber}` : 'Dose'}
                            </div>
                            <div className={styles.doseStatus}>
                              <Tag type="blue">Complete</Tag>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {scheduledDoses.length > 0 && (
                    <div className={styles.doseSection}>
                      <div className={styles.scheduledDoses}>
                        {scheduledDoses.map((dose, dIndex) => (
                          <div key={`${index}-${dIndex}`} className={styles.doseCard}>
                            <div className={styles.doseDate}>{formatDateString(dose.occurrenceDateTime)}</div>
                            <div className={styles.doseInfo}>
                              {dose.doseNumber !== null ? `Dose #${dose.doseNumber}` : 'Dose'}
                            </div>
                            <div className={styles.doseStatus}>
                              {isOverdue(dose.occurrenceDateTime) ? (
                                <Tag type="red">Overdue</Tag>
                              ) : (
                                <Tag
                                  type={
                                    dose.occurrenceDateTime === currentDate.toISOString().split('T')[0]
                                      ? 'green'
                                      : 'gray'
                                  }
                                >
                                  {getDoseStatus(dose.occurrenceDateTime)}
                                </Tag>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Column>
      </Grid>
    </div>
  );
};

export default ImmunizationSchedule;
