import DatePicker, { DateObject } from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { ErrorMessage, getIn, useFormikContext } from 'formik';
import moment from 'moment';
import { closeIcon } from '../../config/variables';

const DatePickerField = ({
  title,
  name,
  customPadding,
  noPadding,
  border,
  customClass,
  placeHolder,
  isTimePicker = false,
  disabled,
  clearable,
  gridSize = 12
}: {
  title: string;
  name: string;
  customPadding?: boolean;
  noPadding?: boolean;
  border?: boolean;
  customClass?: string;
  placeHolder?: string;
  isTimePicker?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  gridSize?: number;
}) => {
  const formik = useFormikContext();

  const handleDateChange = (value: any) => {
    if (!value) return;
    const format = isTimePicker ? 'HH:mm' : 'YYYY-MM-DD';
    formik.setFieldValue(name, value?.format?.(format) ?? '');
  };

  const fieldValue = getIn(formik.values, name);

  return (
    <div
      className={`field_wrapper_container relative date ${customPadding && 'custom-padding'} ${disabled ? 'disabled' : ''} ${noPadding && 'no-padding'} ${border && 'add-border'} ${customClass} grid-${gridSize}`}
    >
      {title && (
        <div className="header">
          <h5 className="title">{title}</h5>
        </div>
      )}
      <div className='input_wrapper'>
        <DatePicker
          editable={false}
          onChange={handleDateChange}
          placeholder={placeHolder}
          format={isTimePicker ? 'HH:mm' : 'YYYY-MM-DD'}
          plugins={isTimePicker ? [<TimePicker position="bottom" hideSeconds />] : []}
          disableDayPicker={isTimePicker}
          disabled={disabled}
          value={fieldValue ? (isTimePicker ? new Date(`${moment().format('YYYY-MM-DD')} ${fieldValue}`) : new Date(fieldValue)) : undefined}
          onOpenPickNewDate={isTimePicker}
        />
        <p className="error">
          <ErrorMessage name={name || "defaultName"} />
        </p>
      </div>
      {clearable && fieldValue && (
        <div
          className="date_clear_icon clickable"
          onClick={() => {
            formik?.setFieldValue(name, '');
          }}
        >
          {closeIcon}
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
