import { useState } from 'react';
import ModalContainer from '../../../components/ModalContainer';
import { editIcon, seeIcon } from '../../../config/variables';
import { hasPermission, navigateRoute } from '../../../utils/HelperFunctions';
import ViewModel from './ViewModel';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../../../components/buttons/DeleteButton';

const RolesTableContainer = ({ tableHeaders, data, noDataMessage }: any) => {

    const [model, setModel] = useState(false);
    const navigate = useNavigate()

    const hasEditPermission = hasPermission(['roles.edit']);

    return (
        <div className={`table_container  `}>
            <div className="table_header" style={{ justifyContent: "space-between", display: "flex" }}>
                {tableHeaders?.map((header: any, index: number) => (
                    <span className={`head  ${header.customClass}`} key={index}>{header.label}</span>
                ))}
            </div>
            <div className={`table_data ${(!data || data?.length === 0) && "no_data"}`}
            >
                {data?.length > 0 ?
                    <>
                        {data?.map((item: any, index: number) => (
                            item.id !== 1 &&
                            <div className={`item ${hasEditPermission && "clickable"}`} key={index} style={{ justifyContent: "space-between" }} onClick={(e) => { 
                                hasEditPermission && navigateRoute(e, `/roles/create-role/${item.id}`, navigate)
                             }}>
                                <div className="column " >{item?.name || "-"}</div>
                                <div className="column actions actions_col">
                                    {hasPermission(['roles.show']) &&

                                        <div className="action_btn edit" onClick={(e) => {
                                            const contentContainer = document.querySelector(".layout_content");
                                            contentContainer?.scrollTo({ top: 0, behavior: "smooth" });
                                            e.stopPropagation();
                                            setModel(item)
                                        }}>
                                            {seeIcon}
                                        </div>
                                    }
                                    {hasEditPermission &&

                                        <div className="action_btn edit" onClick={(e) => { 
                                            navigateRoute(e, `/roles/create-role/${item.id}`, navigate)
                                         }}>
                                            {editIcon}
                                        </div>
                                    }
                                    {hasPermission(['roles.delete']) &&
                                        <DeleteButton deleteRoute={`/admin/roles`} queryKey='roles' id={item.id} />
                                    }
                                </div>

                            </div>
                        ))}
                    </>
                    :
                    <h6>{noDataMessage}</h6>
                }
            </div>
            {model &&
                <ModalContainer small>
                    <ViewModel setModel={setModel} data={model} />
                </ModalContainer>
            }
        </div>
    );
}

export default RolesTableContainer;