import { TOptions } from '../types/types';
import { hasPermission } from './HelperFunctions';

export const serviceProviderSelectProps = (language: string, beforeOptionsMaping?: (options: any) => any) => ({
  labelKey: `name.${language}`,
  valueKey: 'id',
  searchKeys: ['first_name', 'last_name', 'email', 'mobile'],
  modelRoute: '/service-providers?per_page=1000',
  beforeOptionsMaping,
  queryKey: ['service-providers'],
  enabled: hasPermission(['service_providers.show'])
});

export const makesSelectProps = (staticOptions?: TOptions[]) => ({
  labelKey: ['name'],
  valueKey: 'id',
  modelRoute: 'admin/makes',
  queryKey: ['vehicle-makes'],
  staticOptions,
  enabled: hasPermission(['makes.show'])
});

export const workSectorsSelectProps = (language: string) => ({
  labelKey: [`name[${language}]`],
  valueKey: 'id',
  modelRoute: `/work-sectors`,
  queryKey: ['work-sectors'],
  enabled: hasPermission(['work_sectors.show'])
});

export const nationalitiesSelectProps = (language: string) => ({
  labelKey: [`name[${language}]`],
  valueKey: 'id',
  modelRoute: `/admin/nationalities`,
  queryKey: ['nationalities']
});

export const modelsSelectProps = (language: string, makeId?: number, staticOptions?: TOptions[]) => ({
  labelKey: [`name.en`],
  valueKey: 'id',
  modelRoute: `admin/makes/${makeId}/models`,
  queryKey: ['models', makeId],
  enabled: !!makeId && hasPermission(['models.show']),
  staticOptions
});

export const variantsSelectProps = (language: string, modelId?: number, extraParams?: string) => ({
  labelKey: [`name.en`],
  valueKey: 'id',
  modelRoute: `admin/models/${modelId}/variants${extraParams || ''}`,
  queryKey: ['variants', modelId],
  enabled: !!modelId && hasPermission(['variants.show'])
});

export const chassisSelectProps = (variantId?: number, exteriorColorId?: number, interiorColorId?: number, valueKey?: 'chassis' | 'id') => ({
  labelKey: 'chassis',
  valueKey: valueKey || 'id',
  modelRoute: `admin/vehicles/filter?variant_id=${variantId}&exterior_color_id=${exteriorColorId}&interior_color_id=${interiorColorId}&in_stock=1`,
  queryKey: ['vehicles', variantId, exteriorColorId, interiorColorId],
  enabled: !!variantId && !!exteriorColorId && !!interiorColorId && hasPermission(['vehicles.show'])
});

export const salesSelectProps = (disabled?: boolean) => ({
  labelKey: ['first_name', 'last_name'],
  valueKey: 'id',
  withoutDashes: true,
  beforeOptionsMaping: (options: any) => options.filter((option: any) => option?.type == 'Sales'),
  modelRoute: 'admin/admins?relations=roles,roles.permissions',
  queryKey: ['admins'],
  enabled: hasPermission(['admins.show']) && !disabled
});