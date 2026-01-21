interface IProps {
  item: {
    label: string;
    value: string;
  };
  value?: boolean;
  formik?: any;
  checked?: string[];
  name?: string;
  useCustomLogic?: boolean;
  customChange?: (item: any) => void;
  customClass?: string;
}

const Checkbox = ({ item, customClass, value, formik, checked, name, useCustomLogic = false, customChange }: IProps) => {
  const customHandleChange = () => {
    const current = Array.isArray(checked) ? checked : [];

    const updated = current.includes(item.value) ? current.filter((v) => v !== item.value) : [...current, item.value];

    formik?.setFieldValue(name, updated);
  };

  const defaultHandleChange = () => {
    // Individual checkbox logic
    if (checked && checked?.some((i) => i === item?.value)) {
      formik?.setFieldValue(
        name,
        checked?.filter((i) => i !== item?.value)
      );
    } else {
      formik?.setFieldValue(name, [...(checked || []), item.value]);
    }
  };

  const handleChange = customChange ? () => customChange(item) : useCustomLogic ? customHandleChange : defaultHandleChange;

  return (
    <label className={customClass}>
      <input id={`${name}`} type="checkbox" checked={value} onChange={handleChange} />
      {item.label}
    </label>
  );
};

export default Checkbox;