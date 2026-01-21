import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { deleteIcon, largeDragIcon, plusIcon } from '../../config/variables';
import { useTranslation } from 'react-i18next';

export default function ModelDataSkeleton({ count = 1 }: { count?: number }) {
  const { t } = useTranslation();

  return (
    <div className="model-data-skeleton">
      <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
        <div className=" skeleton_w-100">
          <div className="model-data-list">
            <div className="model-data-header">
              <h6>{t('data_items')}</h6>
              <div className="add-model-item-btn disabled">
                <span>{plusIcon}</span> <span>{t('add_item')}</span>
              </div>
            </div>

            <ModelItemSkeleton count={count} />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
}

function ModelItemSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className={`model-item pointer`}>
      <div className="drag-handle">
        <span>{largeDragIcon}</span>
      </div>
      <div className="model-fields">
        <div className="skeleton_flex">
          {Array.from({ length: count }).map((_, index) => (
            <div className="skeleton_flex" key={index}>
              <div className="skeleton_w-100">
                <Skeleton className="skeleton_input skeleton_w-100 no-padding" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="remove-button">{deleteIcon}</span>
    </div>
  );
}
