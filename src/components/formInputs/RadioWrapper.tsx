import { forwardRef } from "react";

export interface RadioWrapperProps {
  children?: React.ReactNode;
  title: string;
  options: string[];
  customClass?: string;
  border?: boolean;
  customPadding?: boolean;
  tooltipTitle?: boolean;
  tooltipHeader?: string;
  tooltipText?: string;
  noPadding?: boolean;
  setSelectedOption?: any;
  selectedOption?: string;
  roundIndex?: number;
  matchIndex?: number;
  formik?: any;
  inputName?: string
}

const RadioWrapper = (
  {
    children,
    title,
    customClass,
    border,
    customPadding,
    tooltipTitle,
    tooltipHeader,
    tooltipText,
    noPadding,
    setSelectedOption,
    selectedOption,
    options,
    roundIndex,
    matchIndex,
    formik,
    inputName
  }: RadioWrapperProps,
  ref: React.Ref<HTMLDivElement>
) => {

  return (
    <div
      className={`field_wrapper_container ${customPadding && "custom-padding"
        } ${noPadding && "no-padding"} ${border && "add-border"} ${customClass}`}
      ref={ref}
    >
      <div className={`header`}>
        <h5 className="title">
          {title}
          {tooltipTitle && (
            <span className="desc">
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
            </span>
          )}
        </h5>
        <div className="start_time_options">
          <div className="radio_options">
            {
              options.map((option, index) => (
                <div key={index} className={`option ${selectedOption == option && "active"}`} onClick={() => {
                  setSelectedOption(option);
                  formik.setFieldValue(`${inputName}`, option.toLowerCase());
                }}>
                  <div className="circle"></div>
                  <span>{option}</span>
                </div>
              ))
            }

          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default forwardRef(RadioWrapper);
