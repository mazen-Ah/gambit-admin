import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TestNotificationModal from '../TestNotificationModal';
import { notificationTestIcon } from '../../config/variables';
import Button from './Button';

interface TestNotificationButtonProps {
  notificationEvent: {
    id: number;
    name: string;
    channel: string;
    triggers: any[];
  };
  fullButton?: boolean;
}

const TestNotificationButton: React.FC<TestNotificationButtonProps> = ({ notificationEvent, fullButton }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<false | number>(false);

  return (
    <Fragment>
      {fullButton ? (
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setModalOpen(notificationEvent.id);
          }}
        >
          <span>{t('send_test_notification')}</span>
        </Button>
      ) : (
        <div
          className="action_btn test centered-flex"
          title={t('send_test_notification')}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setModalOpen(notificationEvent.id);
          }}
        >
          {notificationTestIcon}
        </div>
      )}
      
      <TestNotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        notificationEvent={notificationEvent}
      />
    </Fragment>
  );
};

export default TestNotificationButton;
