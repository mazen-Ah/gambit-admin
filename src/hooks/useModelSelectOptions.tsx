import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { generalGet } from '../API/api';
import { getIn } from 'formik';
import { TOptions } from '../types/types';

export default function useModelSelectOptions({
  modelRoute,
  queryKey,
  labelKey,
  valueKey,
  disabled,
  beforeOptionsMaping,
  withoutDashes,
  searchKeys,
  staticOptions,
  strings = false,
  onDataLoadMapping,
}: {
  modelRoute: string;
  queryKey?: any[];
  labelKey: string | string[];
  valueKey: string;
  disabled?: boolean;
  beforeOptionsMaping?: (options: any) => any;
  withoutDashes?: boolean;
  searchKeys?: string[];
  staticOptions?: TOptions[];
  strings?: boolean;
  onDataLoadMapping?: (options: any) => any
}) {
  const [modelOptions, setModelOptions] = useState<TOptions[]>([]);

  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: queryKey || [modelRoute],
    queryFn: () => generalGet(modelRoute),
    enabled: !disabled
  });

  useEffect(() => {
    let reqData = data?.data?.data?.data || data?.data?.data;
    if (isSuccess && reqData) {
      if (beforeOptionsMaping) {
        reqData = beforeOptionsMaping(reqData);
      }
      let options = [
        ...(staticOptions || []),
        ...reqData.map((item: any) => {
          let label;
          if (strings){
            label = item;
          } else if(Array.isArray(labelKey)) {
            label = labelKey.reduce((acc, key) => (acc ? `${acc} ${withoutDashes ? '' : '- '}${getIn(item, key)}` : getIn(item, key)), '');
          } else {
            label = getIn(item, labelKey);
          }
          let searchText;
          searchText = searchKeys?.reduce((acc, key) => (acc ? `${acc} ${getIn(item, key)}` : getIn(item, key)), '');
          return { value: strings ? item : getIn(item, valueKey), label: label || "---", searchText };
        })
      ];

      if (onDataLoadMapping) {
        options = onDataLoadMapping(options);
      }
      setModelOptions(options);
    }
  }, [data, isSuccess, labelKey?.toString(), valueKey?.toString(), searchKeys?.toString()]);

  return {
    modelOptions,
    apiData: data?.data?.data,
    apiDataLoading: isLoading || isFetching
  };
}