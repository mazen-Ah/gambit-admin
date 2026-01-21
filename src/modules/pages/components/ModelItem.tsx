import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableItem } from '../../../components/DragDrop';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { customStyles } from '../../../utils/SelectStyles';
import { deleteIcon, largeDragIcon } from '../../../config/variables';
import useModelSelectOptions from '../../../hooks/useModelSelectOptions';
import InputSkeleton from '../../../components/loaders/InputSkeleton';

interface ModelItemProps {
  modelItem: any;
  index: number;
  sectionName: string;
  sectionModel: string;
  formik: any;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  isPreview?: boolean;
}

const ModelItem: React.FC<ModelItemProps> = ({ modelItem, index, sectionName, sectionModel, formik, onMove, onRemove, isPreview = false }) => {
  const { t, i18n } = useTranslation();

  // Models select options - depends on individual model item's make selection (only for non-preview)
  const { modelOptions: modelsOptions, apiDataLoading: modelsApiDataLoading } = useModelSelectOptions({
    labelKey: [`name[${i18n.language}]`],
    valueKey: 'id',
    modelRoute: `admin/makes/${modelItem?.make_id}/models?per_page=1000`,
    queryKey: ['models', modelItem?.make_id],
    disabled: !modelItem?.make_id || isPreview
  });

  // Variants select options - depends on individual model item's model selection
  const { modelOptions: variantsOptions, apiDataLoading: variantsApiDataLoading } = useModelSelectOptions({
    labelKey: [`name[${i18n.language}]`],
    valueKey: 'id',
    modelRoute: `admin/models/${modelItem?.model_id}/variants?per_page=1000`,
    queryKey: ['variants', modelItem?.model_id],
    disabled: !modelItem?.model_id
  });

  // Makes select options (shared across all items)
  const { modelOptions: makesOptions, apiDataLoading: makesApiDataLoading } = useModelSelectOptions({
    labelKey: ['name'],
    valueKey: 'id',
    modelRoute: 'admin/makes?per_page=1000',
    queryKey: ['makes', i18n]
  });

  // Exterior colors select options - shown for exterior_colors model type
  const { modelOptions: exteriorColorsOptions, apiDataLoading: exteriorColorsApiDataLoading } = useModelSelectOptions({
    labelKey: ['code', `display_name[${i18n.language}]`],
    valueKey: 'id',
    modelRoute: 'admin/exterior-colors?per_page=1000',
    queryKey: ['exterior-colors'],
    disabled: sectionModel !== 'exterior_colors'
  });

  // Interior colors select options - shown for interior_colors model type
  const { modelOptions: interiorColorsOptions, apiDataLoading: interiorColorsApiDataLoading } = useModelSelectOptions({
    labelKey: ['code', `display_name[${i18n.language}]`],
    valueKey: 'id',
    modelRoute: 'admin/interior-colors?per_page=1000',
    queryKey: ['interior-colors'],
    disabled: sectionModel !== 'interior_colors'
  });

  // Career jobs select options - shown for career_jobs model type
  const { modelOptions: careerJobsOptions, apiDataLoading: careerJobsApiDataLoading } = useModelSelectOptions({
    labelKey: ['title.en'],
    valueKey: 'id',
    modelRoute: 'cms/admin/career-jobs?per_page=1000',
    queryKey: ['career-jobs'],
    disabled: sectionModel !== 'career_jobs'
  });

  // Vehicle offers select options - shown for vehicle_offers model type
  const { modelOptions: vehicleOffersOptions, apiDataLoading: vehicleOffersApiDataLoading } = useModelSelectOptions({
    labelKey: [`title.${i18n.language}`],
    valueKey: 'id',
    modelRoute: 'admin/vehicle_offers?per_page=1000',
    queryKey: ['vehicle-offers'],
    disabled: sectionModel !== 'vehicle_offers'
  });

  // Articles select options - shown for articles model type
  const { modelOptions: articlesOptions, apiDataLoading: articlesApiDataLoading } = useModelSelectOptions({
    labelKey: [`title.${i18n.language}`],
    valueKey: 'id',
    modelRoute: 'admin/article/articles?per_page=1000',
    queryKey: ['articles'],
    disabled: sectionModel !== 'articles'
  });

  useEffect(() => {
    if (makesOptions?.length === 1) {
      formik.setFieldValue(`${sectionName}.model_data[${index}].make_id`, makesOptions[0].value);
    }
  }, [makesOptions]);

  const stableId = `model-${modelItem.stableId}`;

  console.log(sectionModel, modelItem, "sectionModel")

  const renderContent = (dragRef?: any, isDragging?: boolean) => (
    <div className={`model-item pointer ${isDragging ? 'is-dragging' : ''} ${isPreview ? 'is-preview' : ''}`}>
      <div className="drag-handle" ref={dragRef}>
        <span>{largeDragIcon}</span>
      </div>
      <div className="model-fields">
        {/* Makes Select - shown for models and variants */}
        {(sectionModel === 'vehicle_models' || sectionModel === 'variants') &&
          (makesOptions.length <= 1 ? null : makesApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('vehicle_make')}
              inputName={`${sectionName}.model_data[${index}].make_id`}
              options={makesOptions}
              selectStyle={customStyles}
              value={makesOptions?.filter((item: any) => item.value === modelItem.make_id)}
              select
              formik={formik}
              disabled={isPreview}
              onChange={() => {
                formik.setFieldValue(`${sectionName}.model_data[${index}].model_id`, '');
                formik.setFieldValue(`${sectionName}.model_data[${index}].variant_id`, '');
              }}
            />
          ))}

        {/* Models Select - shown for models and variants */}
        {(sectionModel === 'vehicle_models' || sectionModel === 'variants') &&
          (modelsApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={!modelItem.make_id ? t('choose_vehicle_make_first') : t('vehicle_model')}
              disabled={!modelItem.make_id || isPreview}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={modelsOptions}
              selectStyle={customStyles}
              value={modelsOptions?.filter((item: any) => item.value === modelItem.model_id)}
              select
              formik={formik}
              onChange={() => {
                formik.setFieldValue(`${sectionName}.model_data[${index}].variant_id`, '');
              }}
            />
          ))}

        {/* Variants Select - shown only for variants */}
        {sectionModel === 'variants' &&
          (variantsApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={!modelItem.model_id ? t('choose_vehicle_model_first') : t('variant')}
              disabled={!modelItem.model_id || isPreview}
              inputName={`${sectionName}.model_data[${index}].variant_id`}
              options={variantsOptions}
              selectStyle={customStyles}
              value={variantsOptions?.filter((item: any) => item.value === modelItem.variant_id)}
              select
              formik={formik}
            />
          ))}

        {/* Exterior Colors Select - shown only for exterior_colors */}
        {sectionModel === 'exterior_colors' &&
          (exteriorColorsApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('exterior_color')}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={exteriorColorsOptions}
              selectStyle={customStyles}
              value={exteriorColorsOptions?.filter((item: any) => item.value === modelItem.model_id)}
              select
              formik={formik}
              disabled={isPreview}
            />
          ))}

        {/* Interior Colors Select - shown only for interior_colors */}
        {sectionModel === 'interior_colors' &&
          (interiorColorsApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('interior_color')}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={interiorColorsOptions}
              selectStyle={customStyles}
              value={interiorColorsOptions?.filter((item: any) => item.value === modelItem.model_id)}
              select
              formik={formik}
              disabled={isPreview}
            />
          ))}

        {/* Career Jobs Select - shown only for career_jobs */}
        {sectionModel === 'career_jobs' &&
          (careerJobsApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('career_job')}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={careerJobsOptions}
              selectStyle={customStyles}
              value={careerJobsOptions?.filter((item: any) => item.value === modelItem.model_id)}
              select
              formik={formik}
              disabled={isPreview}
            />
          ))
        }

        {/* Vehicle Offers Select - shown only for vehicle_offers */}
        {sectionModel === 'vehicle_offers' &&
          (vehicleOffersApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('vehicle_offer')}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={vehicleOffersOptions}
              selectStyle={customStyles}
              value={vehicleOffersOptions?.filter((item: any) => item.value === modelItem.model_id)}
              select
              formik={formik}
              disabled={isPreview}
            />
          ))
        }

        {/* Articles Select - shown only for articles */}
        {sectionModel === 'articles' &&
          (articlesApiDataLoading && !isPreview ? (
            <FieldWrapper noPadding>
              <InputSkeleton noPadding noHeader />
            </FieldWrapper>
          ) : (
            <FieldWrapper
              noPadding
              title={''}
              inputPlaceholder={t('article')}
              inputName={`${sectionName}.model_data[${index}].model_id`}
              options={articlesOptions}
              selectStyle={customStyles}
              value={articlesOptions?.filter((item: any) => item.value == modelItem.model_id)}
              select
              formik={formik}
              disabled={isPreview}
            />
          ))
        }
      </div>
      <span onClick={() => onRemove(index)} className="remove-button">
        {deleteIcon}
      </span>
    </div>
  );

  console.log(modelItem, "modelItem")
  
  if (isPreview) {
    return renderContent();
  }

  return (
    <DraggableItem
      id={stableId}
      index={index}
      type="MODEL_DATA_ITEM"
      data={{
        sectionModel,
        modelName: modelItem.model_id,
        modelId: modelItem.model_id,
        makeName: modelItem.make_id,
        variantName: modelItem.variant_id,
        exteriorColorName: modelItem.model_id,
        interiorColorName: modelItem.model_id
      }}
      onMove={onMove}
    >
      {(dragRef, isDragging) => renderContent(dragRef, isDragging)}
    </DraggableItem>
  );
};

export default ModelItem;
