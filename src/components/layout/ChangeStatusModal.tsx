import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { authContext } from "../../store/context/authContext";
import { generalToggleStatus } from "../../API/api";
import Button from "../buttons/Button";

export default function ChangeStatusModal({ id, setModal, setRefetchData, route, successMsg, warningMsg, setIsActive, post }: any) {

    const [loading, setLoading] = useState(false);
    const { t } = useTranslation()
    const { catchError } = useContext(authContext)
    function handleDelete() {
        setLoading(true);
        generalToggleStatus(route, post).then(res => {
            setIsActive(post ? res.data.data.status == 2 ? true : false : res.data.data.is_active)
            toast.success(successMsg);
            setRefetchData(new Date())
            setLoading(false);
            setModal(null)
        }).catch(error => {
            catchError(error, setLoading)
        })
    }

    return (
        <div className="common-modal delete">
            <h4>{warningMsg}</h4>
            <div className="buttons">
                <Button
                    loading={loading}
                    onClick={handleDelete}
                >
                    <span className="bold">Confirm</span>
                </Button>
                <Button type={"submit"} onClick={() => setModal(false)}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
