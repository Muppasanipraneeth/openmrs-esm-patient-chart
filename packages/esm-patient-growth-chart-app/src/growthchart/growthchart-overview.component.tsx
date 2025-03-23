import React from 'react';

export interface GrowthChartOverview {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}

const GrowthChartOverview: React.FC<GrowthChartOverview> = ({ basePath, patient, patientUuid }) => {
  return <div>Hello</div>;
};
export default GrowthChartOverview;
