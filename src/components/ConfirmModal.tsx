import { useState } from 'react';
import Button from './buttons/Button';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

export default function ConfirmModal({
  closeModal,
  queryKey,
  message,
  successMsg,
  confirmFunc
}: {
  closeModal: () => void;
  queryKey?: string;
  message: string;
  successMsg: string;
  confirmFunc: (handleSuccess: () => void) => void;
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  function handleSuccess() {
    setLoading(false);
    queryKey && queryClient.invalidateQueries({ queryKey: [queryKey] });
    closeModal();
    toast.success(successMsg);
  }

  function handleConfirm() {
    setLoading(true);

    confirmFunc(handleSuccess);
  }

  return (
    <div className="common-modal delete">
      <h4>{message}</h4>
      <div className="buttons">
        <Button type={'submit'} onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleConfirm}>
          <span className="bold">Confirm</span>
        </Button>
      </div>
    </div>
  );
}
