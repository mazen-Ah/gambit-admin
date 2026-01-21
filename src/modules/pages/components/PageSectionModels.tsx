import { useTranslation } from 'react-i18next';
import SectionHeader from '../../../components/SectionHeader';
import SwitchActivation from '../../../components/layout/SwitchActivation';
import { FieldArray, getIn, useFormikContext } from 'formik';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { customStyles } from '../../../utils/SelectStyles';
import { useEffect, useMemo, useState } from 'react';
import ModelDataList from './ModelDataList';

export default function PageSectionModels({ subSection, sectionName, hasRelation }: { subSection?: boolean; sectionName: string; hasRelation: boolean }) {
  const { t } = useTranslation();
  const formik = useFormikContext();
  const [firstRender, setFirstRender] = useState(true);

  const sectionData = getIn(formik.values, `${sectionName}`);

  const dataTypesOptions = useMemo(
    () => [
      { label: t('exterior_colors'), value: 'exterior_colors' },
      { label: t('interior_colors'), value: 'interior_colors' },
      { label: t('models'), value: 'vehicle_models' },
      { label: t('variants'), value: 'variants' },
      { label: t('career_jobs'), value: 'career_jobs' },
      { label: t('articles'), value: 'articles' },
      { label: t('links.vehicle_offers'), value: 'vehicle_offers' }
    ],
    [t]
  );

  const modelValue = getIn(formik?.values, `${sectionName}.model`);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    formik?.setFieldValue(
      `${sectionName}.model_data`,
      modelValue
        ? [
            {
              model_id: '',
              make_id: '',
              variant_id: '',
              exterior_color_id: '',
              interior_color_id: '',
              order: '',
              stableId: 1
            }
          ]
        : []
    );
  }, [modelValue, firstRender, formik, sectionName]);

  return (
    <SectionHeader title={""} customStyle='padding_bottom'>
      <div className={`inputs_group ${hasRelation ? 'has-relation' : 'no-relation'}`}>
        <div className="switch_container">
          <SwitchActivation
            onChange={(value: any) => {
              formik.setFieldValue(`${sectionName}.has_relation`, value?.target?.checked ? 1 : 0);
              if (!sectionData?.model_data?.length) {
                formik.setFieldValue(`${sectionName}.model_data`, [{
                  make_id: "",
                  model_id: "",
                  variant_id: "",
                  exterior_color_id: "",
                  interior_color_id: "",
                  order: "",
                  stableId: 1
                }]);
              }
            }}
            active={sectionData?.has_relation === 1}
          />
          <p>{t('has_data')}</p>
        </div>
      </div>
      {!!hasRelation && (
        <div className="form-container">
          <div className="inputs_group">
            <FieldWrapper
              noPadding
              title={t('model_type')}
              inputPlaceholder={t(`model_type`)}
              inputName={`${sectionName}.model`}
              options={dataTypesOptions}
              selectStyle={customStyles}
              defaultValue={dataTypesOptions?.find((item: any) => item.value === sectionData?.model)}
              select
              formik={formik}
            />
          </div>
          {sectionData?.model && (
            <FieldArray
              name={`${sectionName}.model_data`}
              render={(arrayHelpers) => {
                const moveModelItem = (fromIndex: number, toIndex: number) => {
                  if (fromIndex === toIndex) return;

                  // Move the item in the array
                  arrayHelpers.move(fromIndex, toIndex);

                  // Update order values based on new positions
                  sectionData?.model_data.forEach((item: any, index: number) => {
                    formik.setFieldValue(`${sectionName}.model_data[${index}].order`, index + 1);
                  });
                };

                return (
                  <ModelDataList
                    sectionData={sectionData}
                    sectionName={sectionName}
                    formik={formik}
                    arrayHelpers={arrayHelpers}
                    apiDataLoading={false}
                    onMoveModelItem={moveModelItem}
                    sectionModel={sectionData?.model}
                  />
                );
              }}
            />
          )}
        </div>
      )}
    </SectionHeader>
  );
}
