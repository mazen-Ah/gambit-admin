import { useDispatch } from "react-redux";
import { setBreadCrumbsData } from "../../store/redux/breadCrumbsData";

const NotFound = () => {

    const dispatch = useDispatch()
    dispatch(setBreadCrumbsData({
        page_title: "Not Found",
    }))

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-text">Oops! The page you're looking for doesn't exist.</p>
        </div>
    );
}

export default NotFound;