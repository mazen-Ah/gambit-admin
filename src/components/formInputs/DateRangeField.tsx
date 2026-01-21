import React, { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import moment from 'moment';
import { ErrorMessage, Field } from 'formik';
import { useTranslation } from 'react-i18next';

const DateRangeField = ({ formik, disabled, selectionRange, setSelectionRange, startValue, endValue }: any) => {

  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation()
  const [openCalender, setOpenCalender] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenCalender(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateRangeChange = (ranges: any) => {
    setSelectionRange(ranges.selection);
    formik.setFieldValue('start_date', moment(ranges.selection.startDate).format('YYYY-MM-DD'));
    formik.setFieldValue('end_date', moment(ranges.selection.endDate).format('YYYY-MM-DD'));
  };

  return (
    <div>
      <div
        className={`date_range_input ${formik.touched.start_date && formik.errors.start_date && 'error-date'
          } 
        ${formik.touched.end_date && formik.errors.end_date && 'error-date'
          }  
        `}
        onClick={() => {
          setOpenCalender(!openCalender);
        }}
      >
        <Field name="start_date" disabled={disabled} />
        <div>
          <span className="last val">
            {startValue && endValue ? (
              <div className="dates">
                <span>{t("start_date")}: {moment(startValue).format('DD-MM-YYYY')}</span>
                <span>{t("end_date")}: {moment(endValue).format('DD-MM-YYYY')}</span>
              </div>
            ) : (
              <span className='placeholder'>{t("selectOfferDates")}</span>
            )}
          </span>
        </div>
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z" />
          </svg>
        </div>
        <p className="error">
          <ErrorMessage name="end_date" />
        </p>
      </div>
      {openCalender && (
        <div ref={ref}>
          <DateRange
            ranges={[selectionRange]}
            onChange={(ranges) => handleDateRangeChange(ranges)}
            showMonthAndYearPickers={false}
            showPreview={false}
            minDate={addDays(new Date(), 0)}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeField;
