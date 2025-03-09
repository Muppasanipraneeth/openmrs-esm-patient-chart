import React from 'react';
import styles from '../../immunization-schedule.component.scss';
import { ageMilestoneDays, ageMilestones } from '../../../data/ageMilestones';
import { iapSchedule } from '../../../data/iapSchedule';
import { recommendationMap } from '../../../data/recommendationMap';
import { normalizeVaccineName, calculateAgeInDays, mapAgeToMilestone } from '../../../utils/vaccineUtils';

interface ScheduleTableProps {
  immunizationData: Array<any>;
  patientBirthDate: string;
  showDoseLabels: boolean;
  currentDate: Date;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  immunizationData,
  patientBirthDate,
  showDoseLabels,
  currentDate,
}) => {
  const birthDate = new Date(patientBirthDate);
  const existingImmunizations = immunizationData || [];

  const getCellContent = (vaccine: string, age: string) => {
    const schedule = iapSchedule[vaccine] || { doses: {} };
    const recommendations = recommendationMap[vaccine] || { recommended: [], catchUp: [], highRisk: [] };

    const doseLabel = schedule.doses && schedule.doses[age];
    if (!doseLabel) return { className: styles.notRecommended, label: '' };

    const isRecommended = recommendations.recommended.includes(age);
    const isCatchUp = recommendations.catchUp.includes(age);
    const isHighRisk = recommendations.highRisk.includes(age);

    const expectedDoseNum = parseInt(doseLabel.match(/\d+$/)?.[0] || '1', 10);

    const administered = existingImmunizations.some((imm) => {
      const normalizedVaccineName = normalizeVaccineName(imm.vaccineName);
      if (normalizedVaccineName !== vaccine) return false;
      return imm.existingDoses.some((dose) => {
        const doseNum = dose.doseNumber || 1;
        // console.log(`${vaccine} at ${age}:`, { doseLabel, doseNum, expectedDoseNum });
        const doseDate = new Date(dose.occurrenceDateTime);
        const ageInDays = calculateAgeInDays(birthDate, doseDate);
        const doseAgeMilestone = mapAgeToMilestone(ageInDays, ageMilestoneDays);
        // Mark as administered if dose number matches and the age is recommended or catch-up
        return doseNum === expectedDoseNum && (isRecommended || isCatchUp) && doseDate <= currentDate;
      });
    });

    let cellClass = styles.notRecommended;
    if (administered) cellClass = styles.completed;
    else if (isHighRisk) cellClass = styles.highRisk;
    else if (isCatchUp) cellClass = styles.catchUp;
    else if (isRecommended) cellClass = styles.recommended;

    return {
      className: cellClass,
      label: showDoseLabels ? doseLabel : '',
    };
  };

  return (
    <div className={styles.scheduleContainer}>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th className={`${styles.cornerCell} ${styles.vaccineHeader}`}>
              <div className={styles.ageVaccineLabels}>
                <div className={styles.ageLabel}>Age</div>
                <div className={styles.vaccineLabel}>Vaccine</div>
              </div>
            </th>
            {ageMilestones.map((age) => (
              <th key={age} className={styles.ageCell}>
                {age}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(iapSchedule).map((vaccine) => (
            <tr key={vaccine}>
              <td className={styles.vaccineCell}>{vaccine}</td>
              {ageMilestones.map((age) => {
                const cell = getCellContent(vaccine, age);
                return (
                  <td key={`${vaccine}-${age}`} className={cell.className}>
                    {cell.label}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
