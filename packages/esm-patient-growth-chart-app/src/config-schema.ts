export const configSchema = {
  concepts: {
    weightUuid: {
      _type: 'string',
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    heightUuid: {
      _type: 'string',
      _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    bmiUuid: {
      _type: 'string',
      _default: '1342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    vitalSignsConceptSetUuid: {
      _type: 'string',
      _default: '160575AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
  },
  biometrics: {
    bmiUnit: {
      _type: 'string',
      _default: 'kg/m²',
    },
    weightUnit: {
      _type: 'string',
      _default: 'kg',
    },
    heightUnit: {
      _type: 'string',
      _default: 'Cm',
    },
  },
};

export interface BiometricsConfigObject {
  bmiUnit: string;
}

export interface ConfigObject {
  concepts: {
    weightUuid: string;
    heightUuid: string;
    bmiUuid: string;
    vitalSignsConceptSetUuid: string;
  };
  biometrics: BiometricsConfigObject;
}
