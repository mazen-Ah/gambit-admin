import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';
import { useTranslation } from 'react-i18next';
import CreateSectionTypeForm from '../../../modules/sectionTypes/components/CreateSectionTypeForm';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const CreateSectionType = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const title = id ? t('edit_section_type') : t('create_section_type');

  useEffect(() => {
    dispatch(
      setBreadCrumbsData({
        links: [{ label: title, path: '/section-types/create-section-type' }],
        page_title: title
      })
    );
  }, [title, dispatch]);

  return (
    <div>
      <CreateSectionTypeForm />
    </div>
  );
};

export default CreateSectionType;
