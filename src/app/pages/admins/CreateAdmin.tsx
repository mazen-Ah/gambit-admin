import { useDispatch } from "react-redux";
import { setBreadCrumbsData } from "../../../store/redux/breadCrumbsData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CreateAdminForm from "../../../modules/admins/components/CreateAdminForm";

const CreateAdmin = () => {
    const {id} = useParams();
    const {t}=useTranslation()
    const dispatch=useDispatch()
    const title = id ? t('edit_admin') : t('create_admin');
    dispatch(setBreadCrumbsData({
        links: [{label: t("create_admin"),path:"/admins/create-admin"}],
        page_title: title
    }))
    return (
        <div>
            <CreateAdminForm/>
        </div>
    );
}

export default CreateAdmin;