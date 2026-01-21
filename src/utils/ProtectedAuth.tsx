import Cookies from 'js-cookie';
import { Navigate, Outlet,} from 'react-router-dom';


const ProtectedAuth=() => {
  const token = Cookies.get("token");

  return !token ? <Outlet/> : <Navigate to={"/"}/>
};

export default ProtectedAuth;
