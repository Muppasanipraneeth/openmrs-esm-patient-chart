import React from 'react';
import {
  DataTable,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { usePagination, formatDatetime, useConfig } from '@openmrs/esm-framework';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import { useTranslation } from 'react-i18next';
import styles from './obs-table.scss';
import type { ConfigObject } from '../../config-schema';
import { useBiometrics } from '../../growthchart/resource-data';

interface ObsTableProps {
  patientUuid: string;
}

const ObsTable: React.FC<ObsTableProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { data, isLoading, isValidating, error } = useBiometrics(patientUuid);

  const tableRows = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((entry, index) => {
      const rowData = {
        id: `${index}`,
        date: formatDatetime(new Date(entry.date), { mode: 'wide' }),
        [config.concepts.weightUuid]: entry.weight % 1 !== 0 ? entry.weight.toFixed(1) : entry.weight,
        [config.concepts.heightUuid]: entry.height,
        [config.concepts.bmiUuid]: entry.bmi % 1 !== 0 ? entry.bmi.toFixed(1) : entry.bmi,
      };
      return rowData;
    });
  }, [data, config.concepts]);

  const tableHeaders = [
    { key: 'date', header: t('dateAndTime', 'Date and time'), isSortable: true },
    { key: config.concepts.weightUuid, header: `Weight (${config.biometrics.weightUnit})` },
    { key: config.concepts.heightUuid, header: `Height (${config.biometrics.heightUnit})` },
    { key: config.concepts.bmiUuid, header: `BMI (${config.biometrics.bmiUnit})` },
  ];

  const { results, goTo, currentPage } = usePagination(tableRows, 5);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isValidating && <div>Updating...</div>}
      <DataTable rows={results} headers={tableHeaders} isSortable size="sm" useZebraStyles>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()} className={styles.customRow}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      className={styles.tableHeader}
                      {...getHeaderProps({
                        header,
                        isSortable: header.isSortable,
                      })}
                    >
                      {header.header?.content ?? header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value ?? '--'}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <PatientChartPagination
        pageNumber={currentPage}
        totalItems={tableRows.length}
        currentItems={results.length}
        pageSize={5}
        onPageNumberChange={({ page }) => goTo(page)}
      />
    </div>
  );
};

export default ObsTable;
