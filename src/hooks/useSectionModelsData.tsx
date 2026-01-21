import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useModelSelectOptions from './useModelSelectOptions';

const getModelData = (make?: string, model?: string, i18n?: any): Record<string, any> => ({
  exterior_colors: {
    labelKey: ['code', 'display_name.en'],
    valueKey: 'id',
    route: 'admin/exterior-colors',
    queryKey: ["exterior-colors"]
  },
  interior_colors: {
    labelKey: ['code', 'display_name.en'],
    valueKey: 'id',
    route: 'admin/interior-colors',
    queryKey: ["interior-colors"]
  },
  makes: {
    labelKey: 'name',
    valueKey: 'id',
    route: `admin/makes`,
    queryKey: ["makes"]
  },
  vehicle_models: {
    labelKey: 'label',
    valueKey: 'value',
    route: `admin/makes/${make}/models`,
    queryKey: ["models", make]
  },
  variants: {
    labelKey: 'label',
    valueKey: 'value',
    route: `admin/models/${model}/variants`,
    queryKey: ["variants", model]
  },
  vehicles: {
    labelKey: 'label',
    valueKey: 'value',
    route: 'admin/vehicles',
    queryKey: ["vehicles"]
  },
  career_jobs: {
    labelKey: ['title.en'],
    valueKey: 'id',
    route: 'cms/admin/career-jobs',
    queryKey: ["career-jobs"]
  },
  articles: {
    labelKey: [`title.${i18n.language}`],
    valueKey: 'id',
    route: 'cms/admin/career-jobs',
    queryKey: ["career-jobs"]
  },
  vehicle_offers: {
    labelKey: [`title.${i18n.language}`],
    valueKey: 'id',
    route: 'admin/vehicle_offers',
    queryKey: ["vehicle-offers"]
  },
});

export default function useSectionModelsData(selectedModel: string, extraData?: {model?: string, make?: string}) {
  const { t, i18n } = useTranslation();
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
    []
  );

  const model = getModelData(extraData?.make, extraData?.model, i18n)[selectedModel]

  const {modelOptions, apiDataLoading} = useModelSelectOptions({
    labelKey: model?.labelKey,
    valueKey: model?.valueKey,
    modelRoute: selectedModel ? model?.route : '',
    queryKey: model?.queryKey,
    disabled: !selectedModel
  })

  return {
    selectOptions: modelOptions,
    dataTypesOptions,
    apiDataLoading
  };
}
