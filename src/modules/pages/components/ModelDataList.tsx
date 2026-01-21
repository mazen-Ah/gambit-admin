import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { DragContainer } from '../../../components/DragDrop';
import { plusIcon } from '../../../config/variables';
import ModelDataSkeleton from '../../../components/loaders/ModelDataSkeleton';
import ModelItem from './ModelItem';
import { DEFAULT_MODEL_DATA } from '../constants/sectionOptions';

interface ModelDataListProps {
  sectionData: any;
  sectionName: string;
  formik: any;
  arrayHelpers: any;
  apiDataLoading: boolean;
  onMoveModelItem: (fromIndex: number, toIndex: number) => void;
  sectionModel?: string;
}

const ModelDataList: React.FC<ModelDataListProps> = ({
  sectionData,
  sectionName,
  formik,
  arrayHelpers,
  apiDataLoading,
  onMoveModelItem,
  sectionModel = 'vehicle_models'
}) => {
  const { t } = useTranslation();

  if (apiDataLoading) {
    return <ModelDataSkeleton count={sectionModel === "vehicle_models" ? 2 : sectionModel === "variants" ? 3 : 1} />;
  }

  return (
    <Fragment>
      <DragContainer
        previewTypes={['MODEL_DATA_ITEM']}
        renderPreview={(item, itemType) => {
          const actualIndex = sectionData?.model_data?.findIndex((modelItem: any) => `model-${modelItem.stableId}` === item.id);
          const actualModelItem = sectionData?.model_data?.[actualIndex];

          return (
            <ModelItem
              modelItem={actualModelItem || item}
              index={actualIndex}
              sectionName={sectionName}
              sectionModel={sectionModel}
              formik={formik}
              onMove={() => {}}
              onRemove={() => {}}
              isPreview={true}
            />
          );
        }} 
        className="model-data-container"
      >
        <div className="model-data-list">
          <div className="model-data-header">
            <h6>{t('data_items')}</h6>
            <div
              onClick={() => {
                const newOrder = (sectionData?.model_data?.length || 0) + 1;
                arrayHelpers.push({
                  ...DEFAULT_MODEL_DATA,
                  order: newOrder,
                  stableId: newOrder
                });
              }}
              className="add-model-item-btn"
            >
              <span>{plusIcon}</span> <span>{t('add_item')}</span>
            </div>
          </div>
          {!sectionData?.model_data?.length && (
            <div className="no_data">
              <h6>{t('no_items_added')}</h6>
            </div>
          )}
          {sectionData?.model_data?.map((modelItem: any, index: number) => {
            // Create a stable key that doesn't change during drag operations
            const stableKey = `${sectionName}-model-${modelItem.stableId}`;

            return (
              <ModelItem
                key={stableKey}
                modelItem={modelItem}
                index={index}
                sectionName={sectionName}
                sectionModel={sectionModel}
                formik={formik}
                onMove={onMoveModelItem}
                onRemove={arrayHelpers.remove}
              />
            );
          })}
        </div>
      </DragContainer>
    </Fragment>
  );
};

export default ModelDataList;
