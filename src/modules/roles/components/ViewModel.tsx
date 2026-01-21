import { useTranslation } from "react-i18next";
import CloseButton from "../../../components/buttons/CloseButton";
import PermissionsData from "./PermissionsData";

const ViewModel = ({ setModel, data }: any) => {

    const { t } = useTranslation()
    const uniqueNames = Array.from(
        new Set<string>(
          data?.permissions?.map((item: { name: string }) => item.name.split('.')[0])
        )
      );

      
    return (
        <div className="permissions modal_content">
            <div className="header">
                <h4 >{t('permissions')}</h4>
                <CloseButton handleClose={() => { setModel(false) }} />
            </div>
            {data.permissions?.length > 0 ?

                uniqueNames.map((item: string, index: number) => (
                    <PermissionsData text={item} data={data} key={index} />
                ))
                :
                <p style={{ padding: "0rem 2rem 1rem" }}>{t('no_permissions')}</p>
            }
        </div>
    );
}

export default ViewModel;