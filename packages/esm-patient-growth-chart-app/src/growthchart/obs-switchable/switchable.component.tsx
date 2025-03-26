import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DataTableSkeleton, InlineLoading } from '@carbon/react';
import { ChartLineSmooth, Table } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import GrowthChartOverview from '../obs-graph/graph.component';
import ObsTable from '../obs-table/table.component';
import styles from './obs-switchable.scss';
import { AddIcon } from '@openmrs/esm-framework';

interface ObsSwitchableProps {
  patientUuid: string;
  patient: fhir.Patient;
  basePath: string;
}

const obss = [
  {
    conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    dataType: 'Number',
    effectiveDateTime: '2023-01-15T00:00:00Z',
    valueQuantity: { value: 3.5, unit: 'kg' },
  },
  {
    conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    dataType: 'Number',
    effectiveDateTime: '2023-03-15T00:00:00Z',
    valueQuantity: { value: 4.2, unit: 'kg' },
  },
  {
    conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    dataType: 'Number',
    effectiveDateTime: '2023-06-15T00:00:00Z',
    valueQuantity: { value: 5.1, unit: 'kg' },
  },
];
const isLoading = false;
const error = null;
const isValidating = false;

const ObsSwitchable: React.FC<ObsSwitchableProps> = ({ patientUuid, patient, basePath }) => {
  const { t } = useTranslation();
  const [chartView, setChartView] = React.useState<boolean>(false);

  const hasNumberType = obss?.find((obs) => obs.dataType === 'Number');
  const launchDetailsForm = useCallback(() => {
    launchPatientWorkspace('growthchart-form-workspace');
  }, []);

  return (
    <>
      {(() => {
        if (isLoading) return <DataTableSkeleton role="progressbar" />;
        if (error) return <ErrorState error={error} headerTitle={t('growthChart', 'Growth Chart')} />;
        if (obss?.length) {
          return (
            <div className={styles.widgetContainer}>
              <CardHeader title={t('growthChart', 'Growth Chart')}>
                <div className={styles.backgroundDataFetchingIndicator}>
                  <span>{isValidating ? <InlineLoading /> : null}</span>
                </div>
                {hasNumberType ? (
                  <div className={styles.headerActionItems}>
                    <div className={styles.toggleButtons}>
                      <Button
                        className={styles.toggle}
                        size="md"
                        kind={chartView ? 'ghost' : 'tertiary'}
                        hasIconOnly
                        renderIcon={(props) => <Table size={16} {...props} />}
                        iconDescription={t('tableView', 'Table View')}
                        onClick={() => setChartView(false)}
                      />
                      <Button
                        className={styles.toggle}
                        size="md"
                        kind={chartView ? 'tertiary' : 'ghost'}
                        hasIconOnly
                        renderIcon={(props) => <ChartLineSmooth size={16} {...props} />}
                        iconDescription={t('chartView', 'Chart View')}
                        onClick={() => setChartView(true)}
                      />
                      <span className={styles.line}></span>
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
                    </div>
                  </div>
                ) : null}
              </CardHeader>
              {chartView ? (
                <GrowthChartOverview patientUuid={patientUuid} patient={patient} basePath={basePath} />
              ) : (
                <ObsTable patientUuid={patientUuid} />
              )}
            </div>
          );
        }
        return (
          <EmptyState displayText={t('noResults', 'No results found')} headerTitle={t('growthChart', 'Growth Chart')} />
        );
      })()}
    </>
  );
};

export default ObsSwitchable;
