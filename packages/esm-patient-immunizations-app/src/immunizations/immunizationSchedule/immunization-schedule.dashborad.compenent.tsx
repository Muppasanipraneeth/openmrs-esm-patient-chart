import { Button, InlineLoading } from '@carbon/react';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { AddIcon } from '@openmrs/esm-framework';
import styles from './immunization-schedule.dashboard.scss';
import { useTranslation } from 'react-i18next';
import ImmunizationSchedule from './immunization-schedule.component';
interface ImmunizationScheduleDashboardProps {
  patientUuid: string;
}

const ImmunizationScheduleDashboardComponent: React.FC<ImmunizationScheduleDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('immunizationSchedule', 'Immunization Schedule');
  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        {/* <span>{isValidating ? <InlineLoading /> : null}</span> */}
        <Button
          kind="ghost"
          renderIcon={(props) => <AddIcon size={16} {...props} />}
          iconDescription="Add allergies"
          onClick={() => {}}
        >
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <div className={styles.content}>
        <ImmunizationSchedule patientUuid={patientUuid} />
      </div>
    </div>
  );
};
export default ImmunizationScheduleDashboardComponent;
