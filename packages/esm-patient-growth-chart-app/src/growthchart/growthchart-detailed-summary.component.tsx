import React from 'react';
import { ResponsiveWrapper } from '@openmrs/esm-framework';
import ObsSwitchable from './obs-switchable/switchable.component';
import styles from './growthchart-detailed-summary.scss';
interface GrowthChartDetailedSummaryProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}
const GrowthChartDetailedSummary: React.FC<GrowthChartDetailedSummaryProps> = ({ basePath, patient, patientUuid }) => {
  return (
    <div>
      <ResponsiveWrapper>
        <div className={styles.widgetCard}>
          <ObsSwitchable patientUuid={patientUuid} patient={patient} basePath={basePath} />
        </div>
      </ResponsiveWrapper>
    </div>
  );
};
export default GrowthChartDetailedSummary;
