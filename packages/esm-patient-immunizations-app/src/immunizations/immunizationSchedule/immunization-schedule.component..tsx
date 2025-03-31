import React, { useState } from 'react';
import { useImmunizations } from '../../hooks/useImmunizations';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import { formatDate, parseDate } from '@openmrs/esm-framework';

const vaccineNames = {
  'Bacillus Calmette–Guérin vaccine': 'BCG',
  'Hemophilus influenza B vaccine': 'Hemophilus influenza B vaccine',
  'Pentavalent pneumovax': 'Pentavalent pneumovax',
  'Polio vaccine, inactivated': 'Polio vaccine, inactivated',
  'Vitamin A': 'Vitamin A',
  'Polio vaccination, oral': 'Polio vaccination, oral',
  'Diphtheria tetanus and pertussis vaccination': 'TdAP',
  'Influenza vaccine': 'Flu',
  'Hepatitis B vaccine': 'Hep B',
  'Human Papillomavirus vaccine': 'HPV',
};

const ImmunizationSchedule = ({ patientUuid }) => {
  const { data: immunizations, error, isLoading } = useImmunizations(patientUuid);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading immunizations</div>;
  if (!immunizations) return <div>No immunizations found</div>;

  const sortedImmunizations = immunizations.map((immunization) => ({
    ...immunization,
    existingDoses: [...immunization.existingDoses].sort(
      (a, b) => new Date(a.occurrenceDateTime).getTime() - new Date(b.occurrenceDateTime).getTime(),
    ),
  }));

  let maxDoses = 1;
  sortedImmunizations.forEach((immunization) => {
    if (immunization.existingDoses.length > maxDoses) {
      maxDoses = immunization.existingDoses.length;
    }
  });

  const totalItems = sortedImmunizations.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedImmunizations = sortedImmunizations.slice(startIndex, endIndex);

  const formatDates = (date) => {
    return formatDate(parseDate(date), { mode: 'standard', time: 'for today' });
  };

  const rows = paginatedImmunizations.map((immunization) => {
    const vaccineName = vaccineNames[immunization.vaccineName] || immunization.vaccineName;

    const row = {
      id: immunization.vaccineUuid,
      vaccine: { vaccineName },
      doses: Array.from({ length: maxDoses }).map((_, index) => {
        const dose = immunization.existingDoses[index];
        return (
          <span key={index}>
            {dose ? (
              <>
                {' # ' + dose.doseNumber}
                <br />
                {formatDates(dose.occurrenceDateTime)}
              </>
            ) : (
              <> </>
            )}
          </span>
        );
      }),
    };
    return row;
  });

  const headers = [
    { key: 'vaccine', header: 'Vaccine' },
    { key: 'doses', header: 'Doses' },
  ];

  const goTo = ({ page }) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table size="xl" useZebraStyles={false} aria-label="Immunization Schedule">
        <TableHead>
          <TableRow style={{ backgroundColor: '#f4f4f4' }}>
            {headers.map((header) => (
              <TableHeader
                key={header.key}
                style={{
                  minWidth: header.key === 'vaccine' ? '200px' : '80px',
                  backgroundColor: '#f4f4f4',
                }}
                colSpan={header.key === 'doses' ? maxDoses : 1}
              >
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell style={{ backgroundColor: '#ffffff' }}>{row.vaccine.vaccineName}</TableCell>
              {row.doses.map((dose, index) => (
                <TableCell key={index} style={{ backgroundColor: '#ffffff' }}>
                  {dose}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PatientChartPagination
        totalItems={totalItems}
        pageSize={pageSize}
        pageNumber={currentPage}
        currentItems={paginatedImmunizations.length}
        onPageNumberChange={goTo}
      />
    </div>
  );
};

export default ImmunizationSchedule;
