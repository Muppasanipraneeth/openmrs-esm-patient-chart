import React, { useState } from 'react';
import { ScheduleTable } from './components/Immunization-schedule/ScheduleTable';
import { Legend } from './components/Immunization-schedule/Legend';
import { DisplayOptions } from './components/Immunization-schedule/DisplayOptions';
import styles from './immunization-schedule.component.scss';
interface ImmunizationScheduleProps {
  patientUuid: string;
  immunizationData: Array<any>;
  patientBirthDate: string;
}

const ImmunizationSchedule: React.FC<ImmunizationScheduleProps> = ({
  patientUuid,
  immunizationData,
  patientBirthDate,
}) => {
  const currentDate = new Date('2025-03-09');
  const [showLegend, setShowLegend] = useState(true);
  const [showDoseLabels, setShowDoseLabels] = useState(true);

  return (
    <div className={styles.widgetCard}>
      <h1 className={styles.title}>
        Immunization Schedule
        <br />
        for Children Aged 0-18 years (with range)
      </h1>
      <DisplayOptions
        showDoseLabels={showDoseLabels}
        setShowDoseLabels={setShowDoseLabels}
        showLegend={showLegend}
        setShowLegend={setShowLegend}
      />
      <ScheduleTable
        immunizationData={immunizationData}
        patientBirthDate={patientBirthDate}
        showDoseLabels={showDoseLabels}
        currentDate={currentDate}
      />
      <Legend showLegend={showLegend} />
    </div>
  );
};

export default ImmunizationSchedule;
