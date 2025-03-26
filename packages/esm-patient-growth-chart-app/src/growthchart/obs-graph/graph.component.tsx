import React, { useEffect, useState } from 'react';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tab, Tabs, TabList, RadioButtonGroup, RadioButton } from '@carbon/react';
import { useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import percentileData from '../utils/json/wtage.json';
// import whoData from '../utils/json/wtage.json'; // WHO data (you need to provide this)
import styles from './obs-graph.scss';
import { useBiometrics } from '../resource-data';
import classNames from 'classnames';

export interface GrowthChartOverviewProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}
export interface ConceptDescriptor {
  label: string;
  uuid: string;
}
enum ScaleTypes {
  TIME = 'time',
  LINEAR = 'linear',
  LOG = 'log',
  LABELS = 'labels',
  LABELS_RATIO = 'labels-ratio',
}
enum LegendPositions {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

const GrowthChartOverview: React.FC<GrowthChartOverviewProps> = ({ patient, patientUuid }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const { data } = useBiometrics(patientUuid);
  const config = useConfig();
  const { t } = useTranslation();
  const [selectedStandard, setSelectedStandard] = useState<'CDC' | 'WHO'>('WHO');
  const [selectedConcept, setSelectedConcept] = useState<ConceptDescriptor>({
    label: 'Weight',
    uuid: config.concepts?.weightUuid || '',
  });

  const selectedGender = patient.gender === 'male' ? 'boys' : 'girls';
  const conceptData = [
    { concept: config.concepts?.weightUuid, label: 'Weight' },
    { concept: config.concepts?.lengthUuid, label: 'Length' },
    { concept: config.concepts?.bmiUuid, label: 'BMI' },
  ].filter((item) => item.concept);

  useEffect(() => {
    if (!patient.birthDate || !data || !data.length) return;

    const dataSource = percentileData[selectedGender];

    const inToMonths = (measurementDate: string): number => {
      const birthDate = new Date(patient.birthDate);
      const currentDate = new Date(measurementDate);
      if (isNaN(birthDate.getTime()) || isNaN(currentDate.getTime())) {
        console.error('Invalid date:', { birthDate, measurementDate });
        return 0;
      }
      const diffTime = currentDate.getTime() - birthDate.getTime();
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
      return Number(diffMonths.toFixed(2));
    };

    const valueKey = selectedConcept.label.toLowerCase();
    const mappedPercentileData = [
      ...dataSource.P3.map((d: { age: number; weight: number; length?: number; bmi?: number }) => ({
        group: 'P3',
        key: d.age,
        value: d[valueKey] || d.weight,
      })),
      ...dataSource.P15.map((d: { age: number; weight: number; length?: number; bmi?: number }) => ({
        group: 'P15',
        key: d.age,
        value: d[valueKey] || d.weight,
      })),
      ...dataSource.P50.map((d: { age: number; weight: number; length?: number; bmi?: number }) => ({
        group: 'P50',
        key: d.age,
        value: d[valueKey] || d.weight,
      })),
      ...dataSource.P85.map((d: { age: number; weight: number; length?: number; bmi?: number }) => ({
        group: 'P85',
        key: d.age,
        value: d[valueKey] || d.weight,
      })),
      ...dataSource.P97.map((d: { age: number; weight: number; length?: number; bmi?: number }) => ({
        group: 'P97',
        key: d.age,
        value: d[valueKey] || d.weight,
      })),
    ];

    const mappedPatientData = data.map((d) => {
      const ageInMonths = inToMonths(d.date);
      return {
        group: 'Patient',
        key: ageInMonths,
        value: d[valueKey],
      };
    });

    const combinedData = [...mappedPercentileData, ...mappedPatientData];
    setChartData(combinedData);
  }, [patientUuid, data, selectedGender, patient.birthDate, selectedConcept, selectedStandard]);

  const chartColors = {
    P3: '#00a68f',
    P15: '#473793',
    P50: '#0066cc',
    P85: '#a50062',
    P97: '#d9c2ff',
    Patient: '#ff0000',
  };

  const chartOptions = {
    title: `${selectedConcept.label} for Age 0 - 24 months - ${selectedGender === 'boys' ? 'Boys' : 'Girls'}`,
    axes: {
      bottom: {
        title: 'Age (Months)',
        mapsTo: 'key',
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 24],
      },
      left: {
        title: `${selectedConcept.label} (${config.biometrics?.[`${selectedConcept.label.toLowerCase()}Unit`] || 'kg'})`,
        mapsTo: 'value',
        scaleType: ScaleTypes.LINEAR,
        includeZero: true,
      },
    },
    legend: {
      enabled: true,
      position: LegendPositions.TOP,
    },
    tooltip: {
      enabled: true,
      customHTML: (data: any[]) => {
        const point = data[0];
        if (!point) return '<div>No data</div>';
        const group = point.group || 'Unknown';
        const value = point.value !== undefined ? point.value : 'N/A';
        const key = point.key !== undefined ? point.key : 'N/A';
        const unit = config.biometrics?.[`${selectedConcept.label.toLowerCase()}Unit`] || 'kg';
        return `<div>${group}: ${value} ${unit} at ${key} months</div>`;
      },
    },
    curve: 'curveMonotoneX',
    points: {
      enabled: true,
      radius: 4,
    },
    color: {
      scale: chartColors,
    },
    height: '500px',
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.conceptPickerTabs}>
        <label className={styles.conceptLabel} htmlFor="concept-tab-group">
          {t('displaying', 'Displaying')}
        </label>
        <RadioButtonGroup
          name="standard-group"
          valueSelected={selectedStandard}
          onChange={(value) => setSelectedStandard(value as 'CDC' | 'WHO')}
          legendText={t('growthStandard', 'Growth Standard')}
          orientation="horizontal"
          className={styles.standardRadioGroup}
        >
          <RadioButton labelText={t('cdc', 'CDC')} value="CDC" />
          <RadioButton labelText={t('who', 'WHO')} value="WHO" />
        </RadioButtonGroup>
        <Tabs id="concept-tab-group" className={styles.verticalTabs} type="default">
          <TabList className={styles.tablist} aria-label="Obs tabs">
            {conceptData.length > 0 &&
              conceptData.map(({ concept, label }, index) => {
                const tabClasses = classNames(styles.tab, styles.bodyLong01, {
                  [styles.selectedTab]: selectedConcept.label === label,
                });
                return (
                  <Tab
                    key={concept}
                    className={tabClasses}
                    onClick={() =>
                      setSelectedConcept({
                        label,
                        uuid: concept,
                      })
                    }
                  >
                    {label}
                  </Tab>
                );
              })}
          </TabList>
        </Tabs>
      </div>
      <div className={styles.lineChartContainer}>
        {chartData.length > 0 ? (
          <LineChart data={chartData} options={chartOptions} />
        ) : (
          <p>No data has been recorded for this patient</p>
        )}
      </div>
    </div>
  );
};

export default GrowthChartOverview;
