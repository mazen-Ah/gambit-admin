import { ErrorMessage, Field, FastField, getIn, useFormikContext } from 'formik';
import Select, { ActionMeta } from 'react-select';
import { FormEvent, forwardRef, useState, useCallback } from 'react';
import { MultipleDatePickerField } from './MultipleDataPickerField';
import { TextEditorField } from './TextEditorField';
import { TimePickerField } from './TimePickerField';
import { IFieldWrapperProps } from '../../types/Interfaces';
import { useTranslation } from 'react-i18next';
import SwitchActivation from '../layout/SwitchActivation';
import { passwordDashedEyeIcon, passwordEyeIcon } from '../../config/variables';

const FieldWrapper = forwardRef<HTMLDivElement, IFieldWrapperProps>((props, ref) => {
  const {
    children,
    title,
    desc,
    inputName,
    inputPlaceholder,
    defaultValue,
    options,
    input,
    onChange,
    onFocus,
    onBlur,
    onChangeForcontrolled,
    select,
    customClass,
    selectStyle,
    type,
    border,
    customPadding,
    tooltip,
    tooltipTitle,
    tooltipHeader,
    tooltipText,
    radio,
    noPadding,
    tick,
    search,
    disabled,
    textArea,
    maxLength,
    multi,
    textEditor,
    selectRef,
    multipleDates,
    minDate,
    maxDate,
    timePicker,
    value,
    controlledInput,
    showMaxLengthHint,
    showUnit,
    unit,
    dateFormat,
    hideErrorIcon,
    clear,
    filterKeys,
    dir,
    showPassword,
    FWcustomStyles,
    switchInp,
    loading,
    withoutKeyDownBlur,
    stopAutoComplete,
    rows,
    portal,
    disableDefaultOnChange,
    gridSize = 12,
    externalVariables,
    externalVariablesLoading,
    fast
  } = props;

  const length = value?.length || 0;
  const { t } = useTranslation();
  const formik = useFormikContext<any>();

  const [remainingCharacters, setRemainingCharacters] = useState(maxLength ? maxLength - length || maxLength : 0);
  const [showPasswordState, setShowPasswordState] = useState(false);

  const handleKeyUp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!maxLength) return;
      setRemainingCharacters(maxLength - e.target.value?.length || 0);
    },
    [maxLength]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPasswordState((prev) => !prev);
  }, []);

  const handleSelectChange = useCallback(
    (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
      if (onChange) {
        (onChange as (newValue: unknown, actionMeta: ActionMeta<unknown>) => void)(newValue, actionMeta);
      }

      if (disableDefaultOnChange) return;

      const fieldValue = multi ? (newValue as any)?.map((item: any) => item?.value) : (newValue as any)?.value;

      formik?.setFieldValue(inputName || '', fieldValue);
    },
    [onChange, disableDefaultOnChange, multi, formik, inputName]
  );

  const handleControlledInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      onChangeForcontrolled?.(e);
      formik?.setFieldValue(inputName || 'defaultName', e?.currentTarget?.value);
    },
    [onChangeForcontrolled, formik, inputName]
  );

  const getInputClasses = () => {
    const hasError = inputName && getIn(formik.errors, inputName) && getIn(formik.touched, inputName);
    return `input-field ${hasError ? 'input-error' : ''}`;
  };

  const getSelectClasses = () => {
    const hasError = inputName && getIn(formik.errors, inputName) && getIn(formik.touched, inputName);
    return `select-drop-down ${hasError ? 'input-error' : ''} ${customClass || ''} ${search ? 'searchable_select' : ''} ${disabled ? 'disabled' : ''}`;
  };

  const getContainerClasses = () => {
    return `field_wrapper_container ${customPadding ? 'custom-padding' : ''} ${noPadding ? 'no-padding' : ''} ${border ? 'add-border' : ''} ${customClass || ''}`;
  };

  const hasFieldError = inputName && getIn(formik.errors, inputName) && getIn(formik.touched, inputName);
  const shouldShowTick = inputName && !getIn(formik.errors, inputName) && tick;
  const shouldShowErrorIcon = !showUnit && hasFieldError && !hideErrorIcon && dir !== 'rtl';

  const renderTooltip = (isTitle = false) => (
    <>
      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.6"
          d="M8 0.5C12.4062 0.5 16 4.09375 16 8.5C16 12.9375 12.4062 16.5 8 16.5C3.5625 16.5 0 12.9375 0 8.5C0 4.09375 3.5625 0.5 8 0.5ZM8 4.5C7.4375 4.5 7 4.96875 7 5.5C7 6.0625 7.4375 6.5 8 6.5C8.53125 6.5 9 6.0625 9 5.5C9 4.96875 8.53125 4.5 8 4.5ZM9.25 12.5C9.65625 12.5 10 12.1875 10 11.75C10 11.3438 9.65625 11 9.25 11H8.75V8.25C8.75 7.84375 8.40625 7.5 8 7.5H7C6.5625 7.5 6.25 7.84375 6.25 8.25C6.25 8.6875 6.5625 9 7 9H7.25V11H6.75C6.3125 11 6 11.3438 6 11.75C6 12.1875 6.3125 12.5 6.75 12.5H9.25Z"
          fill="#000"
        />
      </svg>
      <div className="tooltip-box">
        {tooltipHeader && <h6>{tooltipHeader}</h6>}
        {tooltipText && <p className="desc">{tooltipText}</p>}
      </div>
    </>
  );

  const renderTickIcon = () => (
    <div className="tick">
      <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.6304 0.395476C17.1232 0.882215 17.1232 1.73401 16.6304 2.22075L6.92698 12.6045C6.47213 13.1318 5.67614 13.1318 5.22129 12.6045L0.369565 7.41264C-0.123188 6.9259 -0.123188 6.0741 0.369565 5.58736C0.824415 5.06006 1.6204 5.06006 2.07525 5.58736L6.05518 9.84633L14.9247 0.395476C15.3796 -0.131825 16.1756 -0.131825 16.6304 0.395476Z"
          fill="#000"
        />
      </svg>
    </div>
  );

  const renderPasswordToggle = () => (
    <div className="tick showPassword pointer" onClick={togglePasswordVisibility}>
      {!showPasswordState ? passwordEyeIcon : passwordDashedEyeIcon}
    </div>
  );

  const renderMaxLengthHint = () => (
    <p className="max_length_hint">
      {remainingCharacters} / {maxLength} {t('charactersLeft')}
    </p>
  );

  const renderErrorMessage = () => (
    <p className="error">
      <ErrorMessage name={inputName || 'defaultName'} />
    </p>
  );

  const renderHeader = () => {
    if (!title) return null;

    return (
      <div className={`header ${radio ? 'radio-header' : ''}`}>
        <h5 className="title">
          {title}
          {tooltipTitle && <span className="desc">{renderTooltip(true)}</span>}
        </h5>
        {desc && (
          <div className="desc">
            {desc}
            {tooltip && renderTooltip()}
          </div>
        )}
      </div>
    );
  };

  const LocalField = fast ? FastField : Field;

  const renderRegularInput = () => (
    <div className="input_wrapper">
      <div className="field" dir={dir}>
        <LocalField name={inputName}>
          {({ field }: { field: any }) => (
            <input
              type={type === 'password' && showPasswordState ? 'text' : type}
              placeholder={inputPlaceholder}
              name={inputName}
              className={getInputClasses()}
              maxLength={maxLength || 200}
              disabled={disabled}
              {...field}
              onKeyUp={handleKeyUp}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                field.onBlur(e);
                onBlur?.(e);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                !withoutKeyDownBlur && field.onBlur(e);
              }}
              onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()}
              autoComplete={stopAutoComplete ? 'new-password' : undefined}
            />
          )}
        </LocalField>

        {showUnit && <span className="fixed-place-holder">{unit}</span>}
        {showPassword && renderPasswordToggle()}
        {shouldShowTick && renderTickIcon()}
        {showMaxLengthHint && renderMaxLengthHint()}
      </div>
      {renderErrorMessage()}
      {shouldShowErrorIcon && <div className="error-icon">!</div>}
    </div>
  );

  const renderControlledInput = () => (
    <div className="input_wrapper">
      <div className="field">
        <LocalField
          type={type}
          placeholder={inputPlaceholder}
          name={inputName}
          value={value}
          className={getInputClasses()}
          maxLength="255"
          onChange={handleControlledInputChange}
          disabled={disabled}
        />
        {shouldShowTick && renderTickIcon()}
      </div>
    </div>
  );

  const renderTextArea = () => (
    <div className="input_wrapper">
      <div className="field">
        <LocalField
          as="textarea"
          rows={rows || 7}
          name={inputName}
          placeholder={inputPlaceholder}
          className={getInputClasses()}
          maxLength={maxLength}
          disabled={disabled}
          onKeyUp={handleKeyUp}
        />
        {showMaxLengthHint && renderMaxLengthHint()}
        {renderErrorMessage()}
      </div>
    </div>
  );

  const renderTextEditor = () => (
    <div className="input_wrapper">
      <div className="field">
        <TextEditorField name={inputName || 'defaultName'} className={`${hasFieldError && getIn(formik.touched, inputName) && 'ql-error'}`} variables={externalVariables} variablesLoading={externalVariablesLoading} />
        {renderErrorMessage()}
      </div>
    </div>
  );

  const renderSelect = () => (
    <div className="input_wrapper">
      <div className="field">
        <Select
          isSearchable={search || false}
          isClearable={clear || false}
          isMulti={multi || false}
          options={options}
          name={inputName}
          placeholder={inputPlaceholder}
          className={getSelectClasses()}
          noOptionsMessage={() => t('no_options')}
          classNamePrefix="react-select"
          styles={
            portal
              ? {
                  ...selectStyle,
                  menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
                }
              : selectStyle
          }
          defaultValue={defaultValue}
          onChange={handleSelectChange}
          menuPortalTarget={portal ? document.body : null}
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled={disabled}
          value={value || (inputName ? options?.find((option) => option.value === formik?.values[inputName]) : defaultValue)}
          ref={selectRef}
          filterOption={(option, inputValue) => {
            if (inputValue.trim().length === 0) return true;

            const searchSource = (option.data as { [key: string]: string }).searchText;
            if (searchSource) {
              return searchSource.toString().toLowerCase().includes(inputValue.toLowerCase().trim());
            }

            const dataToFilter = [option.label, option.value, ...(filterKeys?.map((key) => (option?.data as { [key: string]: string })?.[key]) || [])];

            return dataToFilter.some((data) => data?.toString()?.toLowerCase()?.includes(inputValue.toLowerCase().trim()));
          }}
        />
        {renderErrorMessage()}
      </div>
    </div>
  );

  const renderTimePicker = () => (
    <div className="input_wrapper">
      <TimePickerField name={inputName || 'defaultName'} disabled={disabled} />
      {renderErrorMessage()}
    </div>
  );

  const renderMultipleDates = () => (
    <div className="input_wrapper">
      <MultipleDatePickerField name={inputName || 'defaultName'} minDate={minDate} maxDate={maxDate} dateFormat={dateFormat} disabled={disabled} />
      {renderErrorMessage()}
    </div>
  );

  const renderSwitch = () => (
    <div className={`input_wrapper ${disabled ? 'switch-disabled' : ''}`}>
      <SwitchActivation loading={loading} onChange={onChange} active={value} />
      {renderErrorMessage()}
    </div>
  );

  return (
    <div className={`${getContainerClasses()} grid-${gridSize} grid-mobile-12`} ref={ref} style={FWcustomStyles}>
      {renderHeader()}
      {input && renderRegularInput()}
      {controlledInput && renderControlledInput()}
      {textArea && renderTextArea()}
      {textEditor && renderTextEditor()}
      {select && renderSelect()}
      {timePicker && renderTimePicker()}
      {multipleDates && renderMultipleDates()}
      {switchInp && renderSwitch()}
      {children}
    </div>
  );
});

export default FieldWrapper;
