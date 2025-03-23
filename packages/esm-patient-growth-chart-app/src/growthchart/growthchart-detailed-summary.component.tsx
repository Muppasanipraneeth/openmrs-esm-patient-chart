import React, { useCallback } from 'react';
import { CardHeader, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import GrowthChartOverview from './growthchart-overview.component';
import { Button } from '@carbon/react';
import { AddIcon, ResponsiveWrapper } from '@openmrs/esm-framework';

interface GrowthChartDetailedSummaryProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}
const GrowthChartDetailedSummary: React.FC<GrowthChartDetailedSummaryProps> = ({ basePath, patient, patientUuid }) => {
  const launchDetailsForm = useCallback(() => {
    launchPatientWorkspace('growthchart-form-workspace');
  }, []);
  return (
    <div>
      <ResponsiveWrapper>
        <CardHeader title="Growth Chart">
          <Button
            kind="ghost"
            renderIcon={(props) => <AddIcon size={16} {...props} />}
            iconDescription="Add allergies"
            onClick={() => {
              launchDetailsForm();
            }}
          >
            Add
          </Button>
        </CardHeader>
        <div>
          <GrowthChartOverview patient={patient} patientUuid={patientUuid} basePath={basePath} />
        </div>
      </ResponsiveWrapper>
    </div>
  );
};
export default GrowthChartDetailedSummary;
