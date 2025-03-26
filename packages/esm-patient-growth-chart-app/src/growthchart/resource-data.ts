import useSWR, { mutate } from 'swr';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

export const SaveBiometric = async (patientUuid, biometricData) => {
  const response = await fetch('http://localhost:3000/api/biometrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientUuid,
      ...biometricData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post biometric data: ${response.status}`);
  }

  return response;
};

export const useBiometrics = (patientUuid) => {
  const url = patientUuid ? `http://localhost:3000/api/biometrics?patientUuid=${patientUuid}` : null;

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: swrMutate,
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
  });

  const addBiometric = async (biometricData) => {
    try {
      const response = await SaveBiometric(patientUuid, biometricData);
      const newData = await response.json();

      swrMutate(newData.measurements, false);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to add biometric');
    }
  };

  return {
    data: data || [],
    isLoading,
    isValidating,
    error: error ? error.message || 'Failed to fetch biometrics' : null,
    addBiometric,
  };
};
