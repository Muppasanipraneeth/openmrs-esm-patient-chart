import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

interface GrowthChartFormProps {
  basePath: string;
  patient: fhir.Patient;
  patientUuid: string;
}

const GrowthChartForm: React.FC<GrowthChartFormProps> = ({ basePath, patient, patientUuid }) => {
  const methods = useForm({
    defaultValues: {
      height: '',
      weight: '',
      age: '',
    },
  });

  const onSubmit = (data: any) => {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Height (cm)</label>
          <Controller
            name="height"
            control={methods.control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" type="number" placeholder="Enter height" />
            )}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Weight (kg)</label>
          <Controller
            name="weight"
            control={methods.control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" type="number" placeholder="Enter weight" />
            )}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Age (years)</label>
          <Controller
            name="age"
            control={methods.control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" type="number" placeholder="Enter age" />
            )}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default GrowthChartForm;
