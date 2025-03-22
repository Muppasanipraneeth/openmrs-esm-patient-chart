import React, { type ComponentProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import {
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { EditIcon, formatDate, getCoreTranslation, parseDate, TrashCanIcon, showToast } from '@openmrs/esm-framework';
import { type ImmunizationGrouped } from '../../types';
import { immunizationFormSub } from '../utils';
import styles from './immunizations-sequence-table.scss';
import { deletePatientImmunization } from '../immunizations.resource';
interface SequenceTableProps {
  immunizationsByVaccine: ImmunizationGrouped;
  launchPatientImmunizationForm: () => void;
  onDoseDeleted?: () => void;
}

const SequenceTable: React.FC<SequenceTableProps> = ({
  immunizationsByVaccine,
  launchPatientImmunizationForm,
  onDoseDeleted,
}) => {
  const { t } = useTranslation();
  const { existingDoses, sequences, vaccineUuid } = immunizationsByVaccine;

  const tableHeader = useMemo(
    () => [
      { key: 'sequence', header: sequences.length ? t('sequence', 'Sequence') : t('doseNumber', 'Dose number') },
      { key: 'vaccinationDate', header: t('vaccinationDate', 'Vaccination date') },
      { key: 'expirationDate', header: t('expirationDate', 'Expiration date') },
      { key: 'edit', header: '' },
      { key: 'delete', header: '' },
    ],
    [t, sequences.length],
  );

  const handleDeleteDose = async (immunizationId: string) => {
    try {
      await deletePatientImmunization(immunizationId, new AbortController());

      showToast({
        title: t('immunizationDeleted', 'Immunization Deleted'),
        description: t('immunizationDeletedSuccess', 'The immunization dose has been successfully deleted'),
        kind: 'success',
      });

      onDoseDeleted?.();
    } catch (error) {
      showToast({
        title: t('error', 'Error'),
        description: t('immunizationDeleteError', 'Failed to delete immunization: ') + error.message,
        kind: 'error',
      });
    }
  };

  const tableRows = existingDoses?.map((dose) => {
    return {
      id: dose?.immunizationObsUuid,
      sequence: isEmpty(sequences)
        ? dose.doseNumber || 0
        : sequences?.find((s) => s.sequenceNumber === dose.doseNumber).sequenceLabel || dose.doseNumber,
      vaccinationDate: dose?.occurrenceDateTime && formatDate(new Date(dose.occurrenceDateTime)),
      expirationDate: dose?.expirationDate && formatDate(new Date(dose.expirationDate), { noToday: true }),
      edit: (
        <Button
          kind="ghost"
          iconDescription={t('edit', 'Edit')}
          renderIcon={(props: ComponentProps<typeof EditIcon>) => <EditIcon size={16} {...props} />}
          onClick={() => {
            immunizationFormSub.next({
              vaccineUuid: vaccineUuid,
              immunizationId: dose.immunizationObsUuid,
              vaccinationDate: dose.occurrenceDateTime && parseDate(dose.occurrenceDateTime),
              doseNumber: dose.doseNumber,
              expirationDate: dose.expirationDate && parseDate(dose.expirationDate),
              lotNumber: dose.lotNumber,
              manufacturer: dose.manufacturer,
              visitId: dose.visitUuid,
            });
            launchPatientImmunizationForm();
          }}
        >
          {t('edit', 'Edit')}
        </Button>
      ),
      delete: (
        <Button
          kind="ghost"
          iconDescription={t('delete', 'Delete')}
          renderIcon={(props: ComponentProps<typeof TrashCanIcon>) => <TrashCanIcon size={16} {...props} />}
          onClick={() => handleDeleteDose(dose.immunizationObsUuid)}
        >
          {t('delete', 'Delete')}
        </Button>
      ),
    };
  });

  return (
    tableRows.length > 0 && (
      <DataTable rows={tableRows} headers={tableHeader} useZebraStyles>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer className={styles.sequenceTable}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell?.id} className={styles.tableCell}>
                          {cell?.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    )
  );
};

export default SequenceTable;
