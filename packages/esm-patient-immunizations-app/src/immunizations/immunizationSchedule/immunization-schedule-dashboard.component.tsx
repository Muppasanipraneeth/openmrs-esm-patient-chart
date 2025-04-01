import React from 'react';
import { Button } from '@carbon/react';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { AddIcon } from '@openmrs/esm-framework';
import styles from '../immunizationSchedule/immunization-schedule.dashboard.scss';
import { useTranslation } from 'react-i18next';
import ImmunizationSchedule from './immunization-schedule.component.';
import { useImmunizations } from '../../hooks/useImmunizations';

interface ImmunizationScheduleDashboardProps {
  patientUuid: string;
}

const ImmunizationScheduleDashboardTile: React.FC<ImmunizationScheduleDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { data } = useImmunizations(patientUuid);

  const headerTitle = t('immunizationHistory', 'Immunization History');
  const displayText = t('noImmunizations', 'No immunizations have been recorded for this patient.');

  if (data?.length > 0) {
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
          <ImmunizationSchedule patientUuid={patientUuid} />
        </div>
      </div>
    );
  }

  return <EmptyState headerTitle={headerTitle} displayText={displayText} />;
};

export default ImmunizationScheduleDashboardTile;
