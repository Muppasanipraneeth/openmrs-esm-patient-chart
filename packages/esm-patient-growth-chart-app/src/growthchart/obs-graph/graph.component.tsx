import React, { useEffect, useState } from 'react';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tab, Tabs, TabList } from '@carbon/react';

import percentileData from '../utils/json/wtage.json';
import styles from './obs-graph.scss';
import { useBiometrics } from '../resource-data';

export interface GrowthChartOverviewProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
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
  const selectedGender = patient.gender === 'male' ? 'boys' : 'girls';

  useEffect(() => {
    if (!patient.birthDate || !data.length) return;

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

    const mappedPercentileData = [
      ...dataSource.P3.map((d: { age: number; weight: number }) => ({
        group: 'P3',
        key: d.age,
        value: d.weight,
      })),
      ...dataSource.P15.map((d: { age: number; weight: number }) => ({
        group: 'P15',
        key: d.age,
        value: d.weight,
      })),
      ...dataSource.P50.map((d: { age: number; weight: number }) => ({
        group: 'P50',
        key: d.age,
        value: d.weight,
      })),
      ...dataSource.P85.map((d: { age: number; weight: number }) => ({
        group: 'P85',
        key: d.age,
        value: d.weight,
      })),
      ...dataSource.P97.map((d: { age: number; weight: number }) => ({
        group: 'P97',
        key: d.age,
        value: d.weight,
      })),
    ];

    const mappedPatientData = data.map((d) => {
      const ageInMonths = inToMonths(d.date);
      return {
        group: 'Patient',
        key: ageInMonths,
        value: d.weight,
      };
    });

    const combinedData = [...mappedPercentileData, ...mappedPatientData];
    setChartData(combinedData);
  }, [patientUuid, data, selectedGender, patient.birthDate]);

  const chartColors = {
    P3: '#00a68f',
    P15: '#473793',
    P50: '#0066cc',
    P85: '#a50062',
    P97: '#d9c2ff',
    Patient: '#ff0000',
  };

  const chartOptions = {
    title: `Weight for Age (0 - 24 months) - ${selectedGender === 'boys' ? 'Boys' : 'Girls'}`,
    axes: {
      bottom: {
        title: 'Age (Months)',
        mapsTo: 'key',
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 24],
      },
      left: {
        title: 'Weight (kg)',
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

        return `<div>${group}: ${value} kg at ${key} months</div>`;
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
        <Tabs className={styles.verticalTabs}>
          <TabList aria-label="Gender tabs"></TabList>
        </Tabs>
      </div>
      <div className={styles.lineChartContainer}>
        {chartData.length > 0 ? <LineChart data={chartData} options={chartOptions} /> : <p>Loading chart data...</p>}
      </div>
    </div>
  );
};

export default GrowthChartOverview;
