import { createContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleUnAuthenticated } from "../../modules/auth/store/redux/authData";
import { logout } from "../../modules/auth/API/api";
import { setPermissions, setRolesData } from "../redux/rolesData";
import { FormikErrors } from "formik";
import { toast } from "react-toastify";
import { transformBackendValidations } from "../../utils/transformBackendValidations";
import { useQueryClient } from "@tanstack/react-query";

export const authContext = createContext<any>({ handleLogout: () => { }, catchError: () => { } });

interface prop {
  children: React.ReactNode;
}


export default function AuthProvider({ children }: prop) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const removeCookies = () => {
    Cookies.remove("token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("user_permissions")
  }

  const handleLogout = () => {
    logout().then(res => {
      removeCookies()
      dispatch(handleUnAuthenticated());
      dispatch(setRolesData([]));
      dispatch(setPermissions([]));
      navigate("/auth/login");
    }).catch(err => {
      removeCookies()
      dispatch(handleUnAuthenticated());
      navigate("/auth/login");
    }).finally(() => {
      queryClient.clear()
    })
  }

  const catchError = (error: any, setLoading?: (loading: boolean) => void, setErrors?: (errors: FormikErrors<any>) => void) => {
    if (error) {
      setLoading && setLoading(false)
      toast.error(error?.response?.data?.message)
      if (error?.response?.data?.code === 401) {
        handleLogout()
      } else if (error?.response?.data?.code === 403) {
        handleLogout()
      }
      if(setErrors && error?.response?.data?.errors) {
        const transformedErrors = transformBackendValidations(error?.response?.data?.errors);
        setErrors(transformedErrors)
      }
    }
  }

  const catchErrorWithToast = (
    error: any,
    setLoading?: (loading: boolean) => void,
    setErrors?: (errors: FormikErrors<any>) => void
  ) => {
    if (error) {
      setLoading && setLoading(false);
  
      // Handle Unauthorized / Forbidden
      const code = error?.response?.data?.code;
      if (code === 401 || code === 403) {
        handleLogout();
        return;
      }
  
      // Set form field errors (Formik)
      const apiErrors = error?.response?.data?.errors;
      if (setErrors && apiErrors) {
        const transformedErrors = transformBackendValidations(apiErrors);
        setErrors(transformedErrors);
      }
  
      // Show toast for each error message
      if (apiErrors && typeof apiErrors === 'object') {
        Object.values(apiErrors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          }
        });
      } else {
        // Fallback generic error message
        toast.error(error?.response?.data?.message || 'An unexpected error occurred');
      }
    }
  };
  
  

  const value = {
    handleLogout,
    catchError,
    catchErrorWithToast
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
