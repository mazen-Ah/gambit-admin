import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalContainer from './ModalContainer';
import DeleteModal from './DeleteModal';
import { useMediaQuery } from 'react-responsive';
import { deleteIcon, editIcon } from '../config/variables';
import { hasPermission } from '../utils/HelperFunctions';

const ContactsTableContainer = ({ tableHeaders, data, noDataMessage, setRefetchData, border, setOpenModel,
    setContactId, deleteRoute, lessColumns, }: any) => {

    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { t } = useTranslation()
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });


    return (
        <div className={`table_container ${border && "border"} ${lessColumns && isDesktop && "lessColumns"}`}>
            <div className="table_header">
                {tableHeaders?.map((header: any, index: number) => (
                    <span className={`head ${header.customClass} ${index != tableHeaders.length - 1 && "longHead"} `} key={index}>{header.label}</span>
                ))}
            </div>
            <div className={`table_data ${(!data || data?.length == 0) && "no_data"}`}>
                {data?.length > 0 ?
                    <>
                        {data?.map((item: any, index: number) => (
                            <div className="item clickable has_logo" key={index}>
                                <div className="column longHead " >{item?.name || "-"}</div>
                                <div className="column longHead " >{item?.email || "-"}</div>
                                <div className="column longHead " >{item?.mobile || "-"}</div>
                                {hasPermission(['service_providers.crud']) &&
                                    <div className="column actions actions_col ">
                                        <div className="action_btn edit" onClick={(e) => {
                                            const contentContainer = document.querySelector(".layout_content");
                                            contentContainer?.scrollTo({ top: 0, behavior: "smooth" }); e.stopPropagation(); setContactId(item.id); setOpenModel(1);
                                        }}>
                                            {editIcon}
                                        </div>
                                        <div className="action_btn delete" onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(item.id) }}>
                                            {deleteIcon}
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </>
                    :
                    <h6>{noDataMessage}</h6>
                }
            </div>
            {deleteModalOpen && (
                <ModalContainer small>
                    <DeleteModal id={deleteModalOpen} setModal={setDeleteModalOpen} setRefetchData={setRefetchData} route={deleteRoute} successMsg={"Contact deleted successfully"} warningMsg={"Are you sure you want to delete that contact?"} />
                </ModalContainer>
            )}
        </div>
    );
}

export default ContactsTableContainer;