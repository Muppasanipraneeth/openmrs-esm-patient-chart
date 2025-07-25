import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalHeader, ModalBody, ModalFooter, InlineLoading } from '@carbon/react';
import { type Visit } from '@openmrs/esm-framework';
import { useDeleteVisit } from '../hooks/useDeleteVisit';
import styles from './start-visit-dialog.scss';

interface DeleteVisitDialogProps {
  closeModal: () => void;
  patientUuid: string;
  visit: Visit;
}

const DeleteVisitDialog: React.FC<DeleteVisitDialogProps> = ({ closeModal, patientUuid, visit }) => {
  const { t } = useTranslation();
  const { isDeletingVisit, initiateDeletingVisit } = useDeleteVisit(visit, closeModal);

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        title={t('deleteVisitDialogHeader', 'Are you sure you want to delete this visit?')}
      />
      <ModalBody>
        <p className={styles.body}>
          {t('confirmDeleteVisitText', 'Deleting this {{visit}} will delete its associated encounters.', {
            visit: visit?.visitType?.display ?? t('visit', 'Visit'),
          })}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={initiateDeletingVisit} disabled={isDeletingVisit}>
          {!isDeletingVisit ? (
            t('deleteVisit', 'Delete visit')
          ) : (
            <InlineLoading description={t('deletingVisit', 'Deleting visit')} />
          )}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DeleteVisitDialog;
