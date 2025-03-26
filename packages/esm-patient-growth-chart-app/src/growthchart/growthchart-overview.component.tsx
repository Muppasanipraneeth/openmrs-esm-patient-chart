import React, { useEffect, useState } from 'react';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';

import percentileData from './utils/json/wtage.json';
export interface GrowthChartOverview {
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

const patientData = [{ age: 2, weight: 3.963 }];

const GrowthChartOverview: React.FC<GrowthChartOverview> = ({ patient, patientUuid }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  // console.log(chartData);

  useEffect(() => {
    // Determine patient gender (assuming FHIR patient.gender is 'male' or 'female')
    const gender = patient.gender === 'male' ? 'boys' : 'girls';
    const dataSource = percentileData[gender];

    // Map JSON data to chart format
    const mappedData = [
      ...dataSource.P3.map((d: { age: number; weight: number }) => ({
        group: 'P3',
        key: d.age.toString(),
        value: d.weight,
      })),

      ...dataSource.P15.map((d: { age: number; weight: number }) => ({
        group: 'P10',
        key: d.age.toString(),
        value: d.weight,
      })),

      ...dataSource.P50.map((d: { age: number; weight: number }) => ({
        group: 'P50',
        key: d.age.toString(),
        value: d.weight,
      })),
      ...dataSource.P85.map((d: { age: number; weight: number }) => ({
        group: 'P85',
        key: d.age.toString(),
        value: d.weight,
      })),

      ...dataSource.P97.map((d: { age: number; weight: number }) => ({
        group: 'P97',
        key: d.age.toString(),
        value: d.weight,
      })),
      ...patientData.map((d) => ({
        group: 'Patient',
        key: d.age.toString(),
        value: d.weight,
      })),
    ];

    setChartData(mappedData);
  }, [patient, patientUuid]);

  const chartColors = {
    P3: '#00a68f', // Green

    P15: '#473793', // Darker purple

    P50: '#0066cc', // Darker blue

    P85: '#ff69b4', // Pink
    P97: '#d9c2ff', // Light purple
    Patient: '#ff0000', // Red for patient data
  };

  // Chart options
  const chartOptions = {
    title: `Weight for Age (0 - 24 months) - ${patient.gender === 'male' ? 'Boys' : 'Girls'}`,
    axes: {
      bottom: {
        title: 'Age (Months)',
        mapsTo: 'key',
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        title: 'Weight (kg)',
        mapsTo: 'value',
        scaleType: ScaleTypes.LINEAR,
        includeZero: false,
      },
    },
    legend: {
      enabled: true,
      position: LegendPositions.TOP,
    },
    tooltip: {
      enabled: true,
      customHTML: (data: any) => {
        if (data.group === 'Patient') {
          return `<div>Patient: ${data.value} kg</div>`;
        }
        return `<div>${data.group}: ${data.value} kg</div>`;
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
    <div style={{ padding: '20px' }}>
      <div style={{ marginTop: '20px' }}>
        {chartData.length > 0 ? <LineChart data={chartData} options={chartOptions} /> : <p>Loading chart data...</p>}
      </div>
    </div>
  );
};

export default GrowthChartOverview;
