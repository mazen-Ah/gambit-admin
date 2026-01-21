import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import ModalContainer from './ModalContainer';
import Button from './buttons/Button';
import FieldWrapper from './formInputs/FieldWrapper';
import { generalCreate, generalGet } from '../API/api';
import { toast } from 'react-toastify';
import { customStyles } from '../utils/SelectStyles';

interface TestNotificationModalProps {
  isOpen: false | number;
  onClose: () => void;
  notificationEvent: {
    id: number;
    name: string;
    channel: string;
    triggers: number[] | any[];
  };
}

interface TestNotificationFormData {
  trigger_id: number | '';
  recipient: string;
}

const TestNotificationModal: React.FC<TestNotificationModalProps> = ({
  isOpen,
  onClose,
  notificationEvent
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Fetch all triggers to get trigger names for the select options
  const { data: triggersRes } = useQuery({
    queryKey: ['notification-triggers-options'],
    queryFn: () => generalGet('/admin/notification/triggers?per_page=50'),
    refetchOnWindowFocus: false,
    enabled: !!isOpen // Only fetch when modal is open
  });

  const validationSchema = Yup.object({
    trigger_id: Yup.number().typeError(t('required')).required(t('required')),
    recipient: Yup.string().email(t('invalid_email')).required(t('required'))
  });

  const initialValues: TestNotificationFormData = {
    trigger_id: '',
    recipient: ''
  };

  const handleSubmit = async (values: TestNotificationFormData) => {
    if (!isOpen) return;
    setLoading(true);

    const testData = {
      notification_id: parseInt(isOpen.toString()),
      trigger_id: values.trigger_id,
      channel: notificationEvent.channel == "mail" ? "email" : notificationEvent.channel,
      recipient: values.recipient
    };

    try {
      await generalCreate({
        route: '/admin/notification/test',
        values: testData
      });
      
      toast.success(t('test_notification_sent_successfully') || 'Test notification sent successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      toast.error(error?.response?.data?.message || t('error_occurred') || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Get the available triggers for this notification event
  // Filter all triggers to only show those associated with this notification event
  const allTriggers = triggersRes?.data?.data || [];
  const eventTriggerIds = notificationEvent.triggers || [];
  
  const triggerOptions = allTriggers
    .filter((trigger: any) => {
      // If triggers is an array of objects, check the id property
      if (eventTriggerIds.length > 0 && typeof eventTriggerIds[0] === 'object') {
        return eventTriggerIds.some((eventTrigger: any) => eventTrigger.id === trigger.id);
      }
      // If triggers is an array of numbers, check directly
      return eventTriggerIds.includes(trigger.id);
    })
    .map((trigger: any) => ({
      label: trigger.name || trigger.id,
      value: trigger.id
    }));

  return (
    <ModalContainer small>
      <div className="modal_content text-start">
        <div className="form_section">
          <h4 style={{ marginBottom: '1.5rem' }}>
            {t('send_test_notification') || 'Send Test Notification'}
          </h4>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnMount
          >
            {(formik) => (
              <Form>
                <div className="inputs_grid">
                  <FieldWrapper
                    title={t('trigger') || 'Trigger'}
                    inputName="trigger_id"
                    select
                    options={triggerOptions}
                    inputPlaceholder={t('select_trigger') || 'Select trigger'}
                    selectStyle={customStyles}
                    gridSize={12}
                  />
                  <FieldWrapper
                    title={t('recipient_email') || 'Recipient Email'}
                    inputName="recipient"
                    inputPlaceholder={t('enter_recipient_email') || 'Enter recipient email'}
                    input
                    gridSize={12}
                  />
                </div>

                <div className="form_button" style={{ marginTop: '2rem', justifyContent: 'flex-end', gap: '1rem' }}>
                  <Button
                    type="button"
                    onClick={onClose}
                    customClass="cancel red"
                    text={t('cancel') || 'Cancel'}
                  />
                  <Button
                    type="button"
                    loading={loading}
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    disabled={!formik.isValid || loading}
                    text={t('send_test') || 'Send Test'}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </ModalContainer>
  );
};

export default TestNotificationModal;
