import React, { useState } from 'react';
import { useImmunizations } from '../../hooks/useImmunizations';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import styles from './immunization-schedule.scss';
import { t } from 'i18next';

const vaccineNames = {
  'Bacillus Calmette–Guérin vaccine': 'BCG',
  'Hemophilus influenza B vaccine': 'Hib',
  'Pentavalent pneumovax': 'Penta',
  'Polio vaccine, inactivated': 'IPV',
  'Vitamin A': 'Vit A',
  'Polio vaccination, oral': 'OPV',
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

  const totalItems = sortedImmunizations.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedImmunizations = sortedImmunizations.slice(startIndex, endIndex);

  const formatDates = (date) => {
    return formatDate(parseDate(date), { mode: 'standard', time: 'for today' });
  };

  const expirationDate = (date) => {
    if (!date) return null;
    return formatDate(parseDate(date), { mode: 'standard' });
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const headers = [
    { key: 'vaccine', header: 'Vaccine' },
    { key: 'doses', header: 'Doses' },
  ];

  const rows = paginatedImmunizations.map((immunization) => {
    const vaccineName = vaccineNames[immunization.vaccineName] || immunization.vaccineName;
    const size = immunization.existingDoses.length;
    const lastDoseExpirationDate = immunization.existingDoses[size - 1]?.expirationDate;
    const formattedExpiration = expirationDate(lastDoseExpirationDate);

    const row = {
      id: immunization.vaccineUuid,
      vaccine: vaccineName,
      expiration: formattedExpiration,
      isExpired: isExpired(lastDoseExpirationDate),
      doses: immunization.existingDoses.map((dose, index) => (
        <div key={index} className={styles.doseCell}>
          {'Dose ' + dose.doseNumber}
          <br />
          {formatDates(dose.occurrenceDateTime)}
        </div>
      )),
    };
    return row;
  });

  const goTo = ({ page }) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.widgetCard}>
      <div className={styles.headerRow}>
        {headers.map((header, index) => (
          <div key={index} className={styles.headerCell}>
            {header.header}
          </div>
        ))}
      </div>

      <div>
        <Table size="xl" useZebraStyles={false} aria-label="Immunization Schedule">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  className={styles.vaccineName}
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ width: '200px' }}>
                    <strong>{row.vaccine}</strong>
                    <br />
                    {row.expiration && (
                      <span className={row.isExpired ? styles.expired : styles.notexpired}>
                        Next Dose: {row.expiration}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#ffffff',
                    padding: 0,
                    width: '100%',
                  }}
                >
                  <div className={styles.vaccineDose}>{row.doses}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
