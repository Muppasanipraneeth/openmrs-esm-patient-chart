import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { SaveBiometric } from './resource-data';
import { Button } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

interface GrowthChartFormProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}

const HEIGHT_THRESHOLDS = {
  critically_low: 20,
  low: 25,
  high: 200,
  critically_high: 250,
};

const WEIGHT_THRESHOLDS = {
  critically_low: 1,
  low: 1.2,
  high: 150,
  critically_high: 200,
};

const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getInterpretation = (value: number, thresholds: Record<string, number>): string => {
  if (value <= thresholds.critically_low) return 'critically_low';
  if (value <= thresholds.low) return 'low';
  if (value >= thresholds.critically_high) return 'critically_high';
  if (value >= thresholds.high) return 'high';
  return 'normal';
};

const GrowthChartForm: React.FC<GrowthChartFormProps> = ({ basePath, patient, patientUuid }) => {
  const { t } = useTranslation();
  const methods = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
      MUAC: '',
    },
  });

  const onSubmit = (data: any) => {
    const height = Number(data.height);
    const weight = Number(data.weight);
    const bmi = calculateBMI(height, weight);
    const MUAC = Number(data.MUAC);

    const formattedData = {
      patientUuid,
      measurements: [
        {
          date: new Date(data.date),
          height,
          heightRenderInterpretation: getInterpretation(height, HEIGHT_THRESHOLDS),
          weight,
          weightRenderInterpretation: getInterpretation(weight, WEIGHT_THRESHOLDS),
          bmi,
          MUAC,
        },
      ],
    };

    SaveBiometric(patientUuid, formattedData)
      .then((response) => {
        if (response.status === 201) {
          // closeWorkspaceWithSavedChanges();
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('vitalsAndBiometricsRecorded', 'Vitals and Biometrics saved'),
            subtitle: t('vitalsAndBiometricsNowAvailable', 'They are now visible on the Vitals and Biometrics page'),
          });
        }
      })
      .catch(() => {
        showSnackbar({
          title: t('vitalsAndBiometricsSaveError', 'Error saving vitals and biometrics'),
          kind: 'error',
          isLowContrast: false,
          subtitle: t('checkForValidity', 'Some of the values entered are invalid'),
        });
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <Controller
            name="date"
            control={methods.control}
            render={({ field }) => <input {...field} className="w-full p-2 border rounded" type="date" required />}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Height (cm)</label>
          <Controller
            name="height"
            control={methods.control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 border rounded"
                type="number"
                step="0.1"
                placeholder="Enter height"
                required
              />
            )}
          />
        </div>

        <div className="">
          <label className="">Weight (kg)</label>
          <Controller
            name="weight"
            control={methods.control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <input {...field} className="" type="number" step="0.1" placeholder="Enter weight" required />
            )}
          />
        </div>
        <div>
          <Controller
            name="MUAC"
            control={methods.control}
            render={({ field }) => <input {...field} className="" type="number" step="0.1" placeholder="Enter MUAC" />}
          />
        </div>

        <div>
          <Button kind="secondary" type="button">
            Cancel
          </Button>
          <Button kind="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default GrowthChartForm;
