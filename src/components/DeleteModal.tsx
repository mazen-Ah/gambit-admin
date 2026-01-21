import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './buttons/Button';
import { generalCreate, generalDelete } from '../API/api';
import { toast } from 'react-toastify';
import { authContext } from '../store/context/authContext';
import { useQueryClient } from '@tanstack/react-query';

export default function DeleteModal({ id, setModal, setRefetchData, queryKey, route, successMsg, warningMsg, post, user, values }: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { catchError } = useContext(authContext);
  const queryClient = useQueryClient()

  function handleSuccess() {
    setLoading(false);
    setRefetchData && setRefetchData(`deleted_${Date.now()}`);
    queryKey && queryClient.invalidateQueries({ queryKey: [queryKey] });
    setModal(false);
    toast.success(successMsg);
  }

  function handleDelete() {
    setLoading(true);

    (post
      ? generalCreate({
          route: `${route}`,
          values: values || {}
        })
      : generalDelete(user ? `${route}` : `${route}/${id}`)
    )
      .then(() => handleSuccess())
      .catch((error) => catchError(error, setLoading));
  }

  return (
    <div className="common-modal delete">
      <h4>{warningMsg}</h4>
      <div className="buttons">
        <Button type="button" loading={loading} onClick={(e) => {
          e.stopPropagation();
          handleDelete()
        }}>
          <span className="bold">{t('confirm')}</span>
        </Button>
        <Button type="button" onClick={(e) => {
          e.stopPropagation();
          setModal(false)
        }}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
}
