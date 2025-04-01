import React from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button } from '@carbon/react';
import { useImmunizationsConceptSet } from '../hooks/useImmunizationsConceptSet';
import { type ConfigObject } from '../config-schema';
import { useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import styles from './delete-vaccine.modal.scss';

interface DeleteConfirmModelProps {
  close: () => void;
  handleDeleteDose: () => void;
  doseNumber: number;
  vaccineUuid: string;
}

const DeleteConfirmModel: React.FC<DeleteConfirmModelProps> = ({
  close,
  handleDeleteDose,
  doseNumber,
  vaccineUuid,
}) => {
  const { t } = useTranslation();
  const { immunizationsConfig } = useConfig<ConfigObject>();
  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet(immunizationsConfig);

  const vaccineName =
    immunizationsConceptSet?.answers.find((answer) => answer.uuid === vaccineUuid)?.display ??
    t('unknownVaccine', 'Unknown vaccine');

  return (
    <>
      <ModalHeader
        closeModal={close}
        title={t('immunizationDelete', 'Delete Immunization')}
        className={styles.modalHeader}
      />
      <ModalBody>
        <p>
          {t(
            'immunizationDeleteConfirm',
            'Are you sure you want to delete this {{doseNumber}} dose of {{vaccineName}}?',
            { doseNumber, vaccineName },
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleDeleteDose}>
          {t('delete', 'Delete')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default DeleteConfirmModel;
