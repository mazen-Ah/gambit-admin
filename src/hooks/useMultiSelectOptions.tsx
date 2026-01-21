import { SelectChangeEvent } from '@mui/material';
import { FormikProps, getIn } from 'formik';
import MultiSelectDropdown from '../components/formInputs/MultiSelectDropdown';
import { useEffect, useMemo, useState } from 'react';
import { TOptions } from '../types/types';

const CustomArrowIcon = ({ onClick }: { onClick: () => void }) => (
  <svg className="MuiSelect-iconCustom" height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" onClick={onClick}>
    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
  </svg>
);

export default function useMultiSelectOptions({
  inputName,
  label,
  formik,
  placeholder,
  selectOptions,
  customStyles,
  disabled,
  gridSize,
  noPadding
}: {
  inputName: string;
  label: string;
  placeholder: string;
  formik: FormikProps<any> | null;
  selectOptions?: TOptions[];
  customStyles?: any;
  disabled?: boolean;
  gridSize?: number;
  noPadding?: boolean;
}) {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectOpened, setSelectOpened] = useState(false);

  const adjustedSelectOptions: { value: string; text: string }[] = useMemo(() => {
    return (
      selectOptions?.map((option) => ({
        value: String(option.value || ''),
        text: String(option.label || '')
      })) || []
    );
  }, [selectOptions]);

  const value = getIn(formik?.values, inputName);

  useEffect(() => {
    const names = adjustedSelectOptions?.filter((option) => (value || []).some((ele: any) => String(ele) === String(option.value)))?.map((option) => option.text);
    setSelectedNames(names);
  }, [adjustedSelectOptions, formik?.values, value]);

  const handleSelectChange = (event: SelectChangeEvent<string[]>, formik: any) => {
    const value = event.target.value;

    const newSelected = typeof value === 'string' ? value.split(',') : value;

    formik.setFieldValue(inputName, newSelected);
  };

  console.log(getIn(formik?.values, inputName), "getIn(formik?.values, inputName)");

  return {
    element: (
      <MultiSelectDropdown
        label={label}
        name={inputName}
        value={getIn(formik?.values, inputName) || []}
        onChange={(event: SelectChangeEvent<string[]>) => handleSelectChange(event, formik)}
        options={adjustedSelectOptions}
        selectedLabels={selectedNames}
        error={getIn(formik?.errors, inputName)}
        touched={getIn(formik?.touched, inputName)}
        placeholder={placeholder}
        customIcon={<CustomArrowIcon onClick={() => !disabled && setSelectOpened(!selectOpened)} />}
        open={selectOpened}
        setOpen={setSelectOpened}
        customStyles={customStyles || {}}
        disabled={disabled}
        gridSize={gridSize}
        noPadding={noPadding}
      />
    )
  };
}