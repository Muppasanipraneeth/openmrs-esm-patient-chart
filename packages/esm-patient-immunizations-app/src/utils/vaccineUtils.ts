export const normalizeVaccineName = (name: string): string => {
  const vaccineMap: { [key: string]: string } = {
    'Bacillus Calmette–Guérin vaccine': 'BCG',
    'Polio vaccination, oral': 'Polio (OPV)',
    'Polio vaccination, inactivated': 'Polio (IPV)',
    'Diphtheria tetanus and pertussis vaccination': 'DTP',
    'Diphtheria tetanus booster': 'DT',
    'Tetanus booster': 'Tdap',
    'Tetanus toxoid': 'TT',
    'Hepatitis B vaccination': 'Hep B',
    'Hemophilus influenza B vaccine': 'Hib',
    'Pentavalent pneumovax': 'Pneumococcal',
    'Pneumococcal vaccine': 'Pneumococcal',
    'Measles vaccination': 'Measles',
    'Measles Virus Vaccine Live, Enders’ attenuated Edmonston strain / Mumps Virus Vaccine Live, Jeryl Lynn Strain / Rubella Virus Vaccine Live':
      'MMR',
    'Measles-rubella vaccine': 'MR',
    'Diphtheria/Tetanus/Hib/Hep B/Whole-cell Pertussis': 'Pentavalent',
    'Rotavirus vaccine, live': 'Rotavirus',
    'Yellow fever vaccination': 'Typhoid',
    'RTS,S/AS01 vaccine': 'Malaria',
  };
  return vaccineMap[name] || name;
};

export const calculateAgeInDays = (birthDate: Date, date: Date): number => {
  const diffMs = date.getTime() - birthDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const mapAgeToMilestone = (ageInDays: number, ageMilestoneDays: { [key: string]: number }): string => {
  const sortedMilestones = Object.entries(ageMilestoneDays).sort(([, a], [, b]) => a - b);
  for (let i = 0; i < sortedMilestones.length; i++) {
    const [milestone, days] = sortedMilestones[i];
    const nextDays = i + 1 < sortedMilestones.length ? sortedMilestones[i + 1][1] : Infinity;
    if (ageInDays <= days || (ageInDays > days && ageInDays <= nextDays)) {
      return milestone;
    }
  }
  return '13-18 yr';
};
