import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';
import PageSectionsEdit from '../../../modules/pages/components/PageSectionsEdit';
import { useParams } from 'react-router-dom';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';
import { useEffect } from 'react';

export default function PageSections() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadCrumbsData({
        links: [{ label: t('page_sections'), path: '/pages' }],
        page_title: t('page_sections')
      })
    );
  }, [t, dispatch]);

  const { apiData, getDataLoading } = useFormsIntegrationHelpers({
    id,
    queryKey: ['pages', id],
    singleGetApi: `/cms/admin/pages/${id}`,
  });

  return (
    <div className="page_sections ">
      <PageSectionsEdit id={id} data={apiData} getDataLoading={getDataLoading} parentModuleType="Cms" parentType="Page" queryKey="pages" />
    </div>
  );
}
