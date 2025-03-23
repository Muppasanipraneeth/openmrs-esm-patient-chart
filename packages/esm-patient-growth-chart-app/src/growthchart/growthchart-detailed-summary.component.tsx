import React from 'react';
import { CardHeader } from '@openmrs/esm-patient-common-lib';

interface GrowthChartDetailedSummaryProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}
const GrowthChartDetailedSummary: React.FC<GrowthChartDetailedSummaryProps> = ({ basePath, patient, patientUuid }) => {
  return (
    <div>
      <CardHeader title="Growth Chart">
        <div> hello</div>
      </CardHeader>
    </div>
  );
};
export default GrowthChartDetailedSummary;
