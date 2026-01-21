import React, { useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generalCreate, generalGet } from '../API/api';
import { buildFormData, removeEmpty } from '../utils/HelperFunctions';
import { FormikErrors } from 'formik';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../store/context/authContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function useFormsIntegrationHelpers({
  queryKey,
  invalidateQueryKey,
  id,
  singleGetApi,
  addApi,
  editApi,
  listRoute,
  itemName,
  editPut,
  onComplete,
  customMessage,
  keysToKeepEmpty,
  refetchOnWindowFocus = false,
  noScroll = false
}: {
  queryKey?: any[];
  invalidateQueryKey?: any[];
  listRoute?: string;
  itemName?: string;
  id?: string;
  singleGetApi?: string;
  addApi?: string;
  editApi?: string;
  editPut?: boolean;
  onComplete?: (values: any, res?: any) => void;
  customMessage?: string;
  keysToKeepEmpty?: string[];
  refetchOnWindowFocus?: true | false | 'always';
  noScroll?: boolean;
}) {
  const [apiData, setApiData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { catchError } = useContext(authContext);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [...(queryKey || [] || '')],
    queryFn: () => (singleGetApi ? generalGet(singleGetApi) : ''),
    enabled: !!id && !!singleGetApi && !!queryKey,
    refetchOnWindowFocus: refetchOnWindowFocus
  });

  useEffect(() => {
    const reqData = data?.data.data;
    if (isSuccess) {
      setApiData(reqData);
    } else if (!id) {
      setApiData(null);
    }
  }, [isSuccess, data, id]);

  const handleSubmit = async (
    values: any,
    setErrors?: (errors: FormikErrors<any>) => void,
    resetForm?: any,
    noFormData?: boolean,
    customOnComplete?: (values?: any, res?: any) => void
  ) => {
    setLoading(true);
    let route = id ? editApi : addApi;

    removeEmpty(values, keysToKeepEmpty);
    const formData = new FormData();
    buildFormData(formData, values, '');
    await generalCreate({ route, values: noFormData ? values : formData, method: editPut ? 'put' : 'post' })
      .then((res) => {
        onComplete && onComplete(values, res);
        customOnComplete && customOnComplete(values, res);
        (customMessage || itemName) && toast.success(customMessage || `${itemName} ${!id ? t('created') : t('updated')} ${t('successfully')}`);
        queryKey && queryClient.invalidateQueries({ queryKey: queryKey });
        invalidateQueryKey && queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
        if (!noScroll) {
          const contentContainer = document.querySelector('.layout_content');
          contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
        }
        listRoute && navigate(listRoute);
        resetForm && resetForm();
      })
      .catch((error) => {
        catchError(error, setLoading, setErrors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    handleSubmit,
    apiData,
    submitLoading: loading,
    getDataLoading: isLoading
  };
}
