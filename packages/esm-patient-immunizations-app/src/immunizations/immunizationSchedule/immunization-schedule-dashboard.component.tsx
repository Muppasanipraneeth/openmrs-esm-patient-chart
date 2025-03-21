import { Button } from '@carbon/react';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { AddIcon } from '@openmrs/esm-framework';
import styles from '../immunizationSchedule/immunization-schedule.dashboard.scss';
import { useTranslation } from 'react-i18next';
import ImmunizationScheduleTile from './immunization-schedule.component.';

interface ImmunizationScheduleDashboardProps {
  patientUuid: string;
}

const ImmunizationScheduleDashboardTile: React.FC<ImmunizationScheduleDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('immunizationHistory', 'Immunization History');

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <Button
          kind="ghost"
          renderIcon={(props) => <AddIcon size={16} {...props} />}
          iconDescription="Add immunization"
          onClick={() => {}}
        >
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <div className={styles.content}>
        <ImmunizationScheduleTile patientUuid={patientUuid} />
      </div>
    </div>
  );
};

export default ImmunizationScheduleDashboardTile;
