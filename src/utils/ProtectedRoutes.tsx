import Cookies from 'js-cookie';
import { Navigate, Outlet,} from 'react-router-dom';


const ProtectedRoutes=() => {
  const token = Cookies.get("token");

  return token ? <Outlet/> : <Navigate to={"/auth/login"}/>
};

export default ProtectedRoutes;
