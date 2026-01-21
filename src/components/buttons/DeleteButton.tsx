import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalContainer from '../ModalContainer';
import DeleteModal from '../DeleteModal';
import { deleteIcon } from '../../config/variables';

export default function DeleteButton({
  queryKey,
  deleteRoute,
  id,
  successMsg,
  warningMsg,
  post,
  values,
}: {
  queryKey: string;
  deleteRoute: string;
  id: number;
  successMsg?: string;
  warningMsg?: string;
  post?: boolean
  values?: any
}) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean | number>(false);

  return (
    <Fragment>
      <div
        className="action_btn edit"
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(id);
        }}
      >
        {deleteIcon}
      </div>
      {modalOpen && (
        <ModalContainer small>
          <DeleteModal
            id={modalOpen}
            setModal={setModalOpen}
            queryKey={queryKey}
            route={deleteRoute}
            successMsg={successMsg || t('delete_success')}
            warningMsg={warningMsg || t('delete_warning')}
            post={post}
            values={values}
          />
        </ModalContainer>
      )}
    </Fragment>
  );
}
