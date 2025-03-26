export const configSchema = {
  concepts: {
    weightUuid: {
      _type: 'string',
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    lengthUuid: {
      _type: 'string',
      _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    bmiUuid: {
      _type: 'string',
      _default: '1342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    dateUuid: {
      _type: 'date',
      _default: '160753AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
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
    lengthUnit: {
      _type: 'string',
      _default: 'Cm',
    },
  },
};

export interface BiometricsConfigObject {
  bmiUnit: string;
  weightUnit: string;
  lengthUnit: string;
}

export interface ConfigObject {
  concepts: {
    weightUuid: string;
    lengthUuid: string;
    bmiUuid: string;
    vitalSignsConceptSetUuid: string;
    dateUuid: Date;
  };
  biometrics: BiometricsConfigObject;
}
