import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonSet, Column, Form, InlineNotification, Row, Stack } from '@carbon/react';
import {
  showSnackbar,
  useLayoutType,
  useConfig,
  useSession,
  useVisit,
  OpenmrsDatePicker,
} from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import { SaveBiometric } from './resource-data';
import BiometricsInput from './biometric-input.component';
import styles from './growth-form.scss';
export interface GrowthChartFormData {
  date: string;
  length: number;
  weight: number;
  muac?: number;
  computedBodyMassIndex?: number;
}

const GrowthChartFormSchema = z
  .object({
    date: z.date({ required_error: 'Date is required' }),
    length: z.number().min(0, { message: 'Length must be positive' }),
    weight: z.number().min(0, { message: 'Weight must be positive' }),
    muac: z.number().min(0, { message: 'MUAC must be positive' }).optional(),
    computedBodyMassIndex: z.number().optional(),
  })
  .refine((fields) => fields.length && fields.weight, {
    message: 'Length and weight are required',
    path: ['oneFieldRequired'],
  });

interface GrowthChartFormProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
  closeWorkspace: () => void;
  closeWorkspaceWithSavedChanges: () => void;
  promptBeforeClosing: () => Promise<boolean>;
}

const LENGTH_THRESHOLDS = {
  critically_low: 45,
  low: 49,
  high: 90,
  critically_high: 100,
};

const WEIGHT_THRESHOLDS = {
  critically_low: 2,
  low: 2.5,
  high: 15,
  critically_high: 20,
};

const MUAC_THRESHOLDS = {
  critically_low: 11,
  low: 12.5,
  high: 16,
  critically_high: 18,
};

const calculateBMI = (length: number, weight: number): number => {
  const lengthInMeters = length / 100;
  return Number((weight / (lengthInMeters * lengthInMeters)).toFixed(1));
};

const getInterpretation = (value: number, thresholds: Record<string, number>): string => {
  if (value <= thresholds.critically_low) return 'critically_low';
  if (value <= thresholds.low) return 'low';
  if (value >= thresholds.critically_high) return 'critically_high';
  if (value >= thresholds.high) return 'high';
  return 'normal';
};

const GrowthChartForm: React.FC<GrowthChartFormProps> = ({
  basePath,
  patient,
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const session = useSession();
  const { currentVisit } = useVisit(patientUuid);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<GrowthChartFormData>({
    mode: 'all',
    resolver: zodResolver(GrowthChartFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      length: undefined,
      weight: undefined,
      muac: undefined,
      computedBodyMassIndex: undefined,
    },
  });

  useEffect(() => {
    if (isDirty) {
      promptBeforeClosing();
    }
  }, [isDirty, promptBeforeClosing]);

  const length = watch('length');
  const weight = watch('weight');
  const muac = watch('muac');

  useEffect(() => {
    if (length && weight) {
      const computedBodyMassIndex = calculateBMI(length, weight);
      setValue('computedBodyMassIndex', computedBodyMassIndex);
    }
  }, [length, weight, setValue]);

  const onError = (err: any) => {
    if (err?.oneFieldRequired || err.length || err.weight) {
      setShowErrorNotification(true);
    }
  };

  const saveGrowthData = (data: GrowthChartFormData) => {
    setShowErrorNotification(false);

    const formattedData = {
      patientUuid,
      measurements: [
        {
          date: new Date(data.date),
          length: data.length,
          lengthRenderInterpretation: getInterpretation(data.length, LENGTH_THRESHOLDS),
          weight: data.weight,
          weightRenderInterpretation: getInterpretation(data.weight, WEIGHT_THRESHOLDS),
          muac: data.muac || null,
          muacRenderInterpretation: data.muac ? getInterpretation(data.muac, MUAC_THRESHOLDS) : 'not_measured',
          bmi: data.computedBodyMassIndex,
        },
      ],
    };

    SaveBiometric(patientUuid, formattedData)
      .then((response) => {
        if (response.status === 201) {
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('BiometricsRecorded', 'Baby Growth Data Saved'),
            subtitle: t('BiometricsNowAvailable', 'Now visible on the Growth Chart'),
          });
          closeWorkspaceWithSavedChanges();
        }
      })
      .catch(() => {
        showSnackbar({
          title: t('BiometricsSaveError', 'Error saving growth data'),
          kind: 'error',
          isLowContrast: false,
          subtitle: t('checkForValidity', 'Some values may be invalid'),
        });
      });
  };

  return (
    <Form className={styles.form} data-openmrs-role="Growth Chart Form">
      <div className={styles.grid}>
        <Stack>
          <Column>
            <p className={styles.title}>{t('recordBiometrics', 'Record Biometrics')}</p>
          </Column>
          <Row className={styles.row}>
            <Column>
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState }) => (
                  <div className={styles.field}>
                    <label className={styles.label}>{t('date', 'Date')}</label>

                    <OpenmrsDatePicker
                      {...field}
                      className={`${styles.input} ${fieldState.error ? styles.danger : ''}`}
                      isRequired={true}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                    {fieldState.error && <span className={styles.danger}>{fieldState.error.message}</span>}
                  </div>
                )}
              />
            </Column>
          </Row>
          <Row className={styles.row}>
            <Column>
              <BiometricsInput
                control={control}
                fieldProperties={[
                  {
                    name: t('length', 'Length'),
                    type: 'number',
                    min: LENGTH_THRESHOLDS.critically_low,
                    max: LENGTH_THRESHOLDS.critically_high,
                    id: 'length',
                  },
                ]}
                interpretation={length && getInterpretation(length, LENGTH_THRESHOLDS)}
                isValueWithinReferenceRange={
                  length && length >= LENGTH_THRESHOLDS.critically_low && length <= LENGTH_THRESHOLDS.critically_high
                }
                showErrorMessage={showErrorNotification}
                label={t('length', 'Length')}
                unitSymbol="cm"
              />
            </Column>
            <Column>
              <BiometricsInput
                control={control}
                fieldProperties={[
                  {
                    name: t('weight', 'Weight'),
                    type: 'number',
                    min: WEIGHT_THRESHOLDS.critically_low,
                    max: WEIGHT_THRESHOLDS.critically_high,
                    id: 'weight',
                  },
                ]}
                interpretation={weight && getInterpretation(weight, WEIGHT_THRESHOLDS)}
                isValueWithinReferenceRange={
                  weight && weight >= WEIGHT_THRESHOLDS.critically_low && weight <= WEIGHT_THRESHOLDS.critically_high
                }
                showErrorMessage={showErrorNotification}
                label={t('weight', 'Weight')}
                unitSymbol="kg"
              />
            </Column>
            <Column>
              <BiometricsInput
                control={control}
                fieldProperties={[
                  {
                    name: t('bmi', 'BMI'),
                    type: 'number',
                    id: 'computedBodyMassIndex',
                  },
                ]}
                readOnly
                label={t('calculatedBmi', 'BMI (calc.)')}
                unitSymbol="kg/m²"
              />
            </Column>
            <Column>
              <BiometricsInput
                control={control}
                fieldProperties={[
                  {
                    name: t('muac', 'MUAC'),
                    type: 'number',
                    min: MUAC_THRESHOLDS.critically_low,
                    max: MUAC_THRESHOLDS.critically_high,
                    id: 'muac',
                  },
                ]}
                interpretation={muac && getInterpretation(muac, MUAC_THRESHOLDS)}
                isValueWithinReferenceRange={
                  muac && muac >= MUAC_THRESHOLDS.critically_low && muac <= MUAC_THRESHOLDS.critically_high
                }
                showErrorMessage={showErrorNotification}
                label={t('muac', 'MUAC')}
                unitSymbol="cm"
              />
            </Column>
          </Row>
        </Stack>
      </div>

      {showErrorNotification && (
        <Column className={styles.errorContainer}>
          <InlineNotification
            lowContrast
            title={t('error', 'Error')}
            subtitle={t('pleaseFillField', 'Please fill required fields') + '.'}
            onClose={() => setShowErrorNotification(false)}
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Discard')}
        </Button>
        <Button
          className={styles.button}
          kind="primary"
          onClick={handleSubmit(saveGrowthData, onError)}
          disabled={isSubmitting}
          type="submit"
        >
          {t('saveAndClose', 'Save and close')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default GrowthChartForm;
