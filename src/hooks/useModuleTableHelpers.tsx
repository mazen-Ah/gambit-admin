import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../store/redux/breadCrumbsData';
import { Pagination, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { perPageOptions } from '../utils/StaticObjects';
import { paginationControlStyles, sortStyles } from '../utils/SelectStyles';
import Select from 'react-select';
import { generalGet } from '../API/api';
import { authContext } from '../store/context/authContext';
import { useQuery } from '@tanstack/react-query';
import TableFilters from '../components/TableFilters';
import { IMeta } from '../types/Interfaces';

export default function useModuleTableHelpers({
  route,
  withPagination,
  withBreadcrumb,
  customBreadcrumbRoute,
  breadcrumbTitle,
  withSearch,
  customSearchPlaceholder,
  queryKey,
  extraParams = {},
  noFilterDuration = false
}: {
  route: string;
  withPagination?: boolean;
  withSearch?: boolean;
  withBreadcrumb?: boolean;
  customBreadcrumbRoute?: string;
  breadcrumbTitle?: string;
  customSearchPlaceholder?: string;
  queryKey?: string | any[];
  extraParams?: Record<string, string | number | boolean>;
  noFilterDuration?: boolean;
}) {
  const [filters, setFilters] = useState({});
  const [metaData, setMetaData] = useState<IMeta>();

  const buildQueryParams = (params: Record<string, any>) => {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  };

  const [currentRoute, setCurrentRoute] = useState(
    `/${route}?${buildQueryParams({
      ...extraParams,
      ...(withPagination ? { page: '1', per_page: '25' } : {})
    })}`
  );

  const [selectedPerPage, setSelectedPerPage] = useState({ value: '25', label: '25' });
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [apiData, setApiData] = useState<any>();
  const { catchError } = useContext(authContext);

  const dispatch = useDispatch();

  withBreadcrumb &&
    breadcrumbTitle &&
    dispatch(
      setBreadCrumbsData({
        links: [{ label: breadcrumbTitle, path: customBreadcrumbRoute || `/${route}` }],
        page_title: breadcrumbTitle
      })
    );

  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: Array.isArray(queryKey) ? [...(queryKey || []), i18n, currentRoute] : [queryKey, i18n, currentRoute],
    queryFn: () => generalGet(currentRoute),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    error && catchError(error);
  }, [catchError, error]);

  useEffect(() => {
    if (isSuccess) {
      setApiData(data?.data?.data?.data || data?.data?.data);
      data?.data?.meta && setMetaData(data?.data?.meta);
    }
  }, [isSuccess, data]);

  const handleChange = useCallback(
    (_: any, value: number) => {
      setPage(value);
      setCurrentRoute(
        `/${route}?${buildQueryParams({
          ...extraParams,
          page: value,
          per_page: selectedPerPage.value,
          ...(filters || {})
        })}`
      );
    },
    [route, extraParams, selectedPerPage.value, filters]
  );

  useEffect(() => {
    setCurrentRoute(
      `/${route}?${buildQueryParams({
        ...extraParams,
        ...(withPagination ? { page: 1, per_page: selectedPerPage.value } : {}),
        ...(filters || {})
      })}`
    );
  }, [selectedPerPage, filters, route]);

  const paginationEle = useMemo(() => {
    if (metaData && withPagination) {
      return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '1rem' }}>
          {!!apiData?.length && (
            <div className="" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t('rowsPerPage')}{' '}
              <Select
                value={selectedPerPage}
                placeholder={t('perPage')}
                isSearchable={false}
                isClearable={false}
                isMulti={false}
                options={perPageOptions}
                className={`select-drop-down `}
                noOptionsMessage={() => t('no_options')}
                classNamePrefix="react-select"
                styles={{ ...sortStyles, ...paginationControlStyles }}
                menuPlacement='top'
                onChange={(e) => {
                  e && setSelectedPerPage(e);
                }}
              />
            </div>
          )}
          {Number(metaData?.last_page) > 1 && <Pagination count={Number(metaData?.last_page)} page={page} onChange={handleChange} />}{' '}
        </Stack>
      );
    }

    return null;
  }, [handleChange, metaData, page, selectedPerPage, t, withPagination]);

  const searchEle = useMemo(() => {
    if (withSearch) {
      return <TableFilters setFilters={setFilters} customSearchPlaceholder={customSearchPlaceholder} noDuration={noFilterDuration} />;
    }

    return null;
  }, [withSearch, customSearchPlaceholder]);

  return {
    filters,
    currentRoute,
    setMetaData,
    paginationEle,
    searchEle,
    apiData,
    apiDataLoading: isLoading
  };
}
