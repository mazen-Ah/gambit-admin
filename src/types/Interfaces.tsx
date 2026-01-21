import { ReactNode, FocusEvent, FormEvent } from 'react';
import { TOptions } from './types';
import Select from 'react-select/dist/declarations/src/Select';
import { FormikProps } from 'formik';
import { ActionMeta } from 'react-select';

export interface IFormHeader {
  children?: ReactNode;
  rightComp?: ReactNode;
  title: string | ReactNode;
  customStyle?: string;
}

export interface IFormUpload {
  errors?: string;
  formik?: any;
  name: string;
  touched?: boolean;
  fileName?: string;
  label?: string;
  video?: boolean;
  customTypes?: string;
  file?: boolean;
  disabled?: boolean;
  value?: string;
}
export interface IChildren {
  children: ReactNode;
}

export interface ITableSkeleton {
  columns: number;
  withSelectFilter?: boolean;
  withoutButton?: boolean;
  withoutHeader?: boolean;
  small?: string;
}
//Buttons
export interface IButtonProps {
  text?: string | JSX.Element;
  customClass?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  scrollUp?: boolean;
  commentBtn?: boolean;
  link?: string;
}

//Input Fields
export interface IFieldWrapperProps {
  dirty?: boolean;
  dir?: string;
  children?: ReactNode;
  title?: string;
  desc?: string;
  inputError?: string;
  inputTouched?: boolean;
  inputName?: string;
  inputPlaceholder?: string;
  defaultValue?: TOptions;
  customPadding?: boolean;
  options?: Array<TOptions>;
  input?: boolean;
  FWcustomStyles?: object;
  // onChange?: (newValue: OnChangeValue<TOptions, boolean>) => void;
  onChangeForcontrolled?: (e: FormEvent<HTMLInputElement>) => void;
  // onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: ((newValue: { label: string; value: string } | undefined, actionMeta: ActionMeta<unknown>) => void) | undefined;
  onFocus?: (e: FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  select?: boolean;
  customClass?: string;
  selectStyle?: object;
  type?: string;
  border?: boolean;
  tooltipTitle?: boolean;
  tooltip?: boolean;
  tooltipHeader?: string;
  tooltipText?: string | JSX.Element;
  noPadding?: boolean;
  radio?: boolean;
  tick?: boolean;
  search?: boolean;
  disabled?: boolean;
  textArea?: boolean;
  maxLength?: number;
  multiple?: boolean;
  multipleDates?: boolean;
  date?: boolean;
  textEditor?: boolean;
  selectRef?: React.RefObject<Select> | null;
  noMinDate?: boolean;
  minDate?: string;
  maxDate?: string;
  timePicker?: boolean;
  value?: any;
  controlledInput?: boolean;
  formik?: FormikProps<any>;
  showMaxLengthHint?: boolean;
  showUnit?: boolean;
  unit?: string;
  dateFormat?: string;
  hideErrorIcon?: boolean;
  clear?: boolean;
  filterKeys?: Array<string>;
  multi?: boolean;
  showPassword?: boolean;
  switchInp?: boolean;
  loading?: boolean;
  withoutKeyDownBlur?: boolean;
  stopAutoComplete?: boolean;
  rows?: number;
  externalVariables?: TOptions[];
  portal?: boolean;
  disableDefaultOnChange?: boolean;
  externalVariablesLoading?: boolean;
  gridSize?: number;
  fast?: boolean;
}

export interface IMultiDatePickerFieldProps {
  name: string;
  label?: string;
  onChange?: (e: FormEvent) => void;
  value?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  dateFormat?: string;
}

export interface ITextEditorFieldProps {
  name: string;
  className?: string;
  variables?: TOptions[];
  variablesLoading?: boolean;
}

export interface ITimePickerFieldProps {
  name: string;
  disabled?: boolean;
}

export interface IAdminDataDropDown {
  dropDownToggler: boolean;
  setDropDownToggler?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IMenuLinks {
  header: string;
  headerIcon: JSX.Element[];
  baseRoute: string;
  keyName: string;
  nestedLinks: {
    label: string;
    link: string;
    icon: JSX.Element[];
  }[];
}
export interface ISingleMenuLinks {
  header: string;
  headerIcon: JSX.Element[];
  baseRoute: string;
  keyName: string;
  nestedLinks: {
    label: string;
    link: string;
  };
}

export interface ITogglerNavLinkGroup {
  name: string;
  links: (IMenuLinks | ISingleMenuLinks)[];
  setMenu?: (e: boolean) => void;
  keyName: string;
  icon: JSX.Element[];
}

export interface ITogglerNavLink {
  links: IMenuLinks;
  reAnimate?: boolean;
  customClass?: string;
  expanded: string;
  setExpanded: React.Dispatch<React.SetStateAction<string>>;
  isMouseOver: boolean
}

export interface IErrorCard {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface IMediaItem {
  url?: string;
  original_url?: string;
  collection_name: string;
  order?: number;
  id: number;
}

export interface ITableContainerProps<DataType> {
  tableHeaders: (
    | {
        label: string;
        customClass?: string;
      }
    | false
  )[];
  loading?: boolean;
  lessColumns?: boolean;
  noDataMessage?: string;
  data: DataType;
}

export interface IMeta {
  current_page: string;
  last_page: string;
  next_page_url: string;
  per_page: string;
  prev_page_url: string;
  total: string;
}