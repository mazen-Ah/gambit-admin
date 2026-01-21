import Cookies from "js-cookie";
import { axiosInstance } from "../../../config/axiosConfig";

interface ILoginRequestProps {
    route: string;
    values: {
        email: string;
        password: string;
    };
}
interface IPasswordRequestProps {
    route: string;
    values: {
      old_password?: string;
        password: string;
        password_confirmation: string;
        _method: string;

    };
}

interface IVerificationRequestProps {
    route: string;
    values: {
        // token: string;
        // email: string;
        password: string;
        password_confirmation: string;
    };
}

interface IResetPasswordRequestProps {
    route: string;
    values: {
        email: string;
        password: string;
        password_confirmation: string;
    };
}
interface IForgotPasswordRequestProps {
    route: string;
    values: {
        email: string;
    };
}

export const loginPostRequest = async (props: ILoginRequestProps) => {
    const { route, values } = props;
  
    const response = await axiosInstance
      .post(route, values)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
    return response;
  };
export const verificationPostRequest = async (props: IVerificationRequestProps) => {
    const { route, values } = props;
  
    const response = await axiosInstance
      .post(route, values)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
    return response;
  };
export const resetPasswordPostRequest = async (props: IResetPasswordRequestProps) => {
    const { route, values } = props;
  
    const response = await axiosInstance
      .post(route, values)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
    return response;
  };

  export const passwordPostRequest = async (props: IPasswordRequestProps) => {
    const { route, values } = props;
  
    const response = await axiosInstance
      .post(route, values, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
    return response;
  };
  export const forgotPasswordPostRequest = async (props: IForgotPasswordRequestProps) => {
    const { route, values } = props;
  
    const response = await axiosInstance
      .post(route, values, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
    return response;
  };


  export const logout = async () => {
    const response = await axiosInstance.post("/admin/auth/logout")
    return response
  }
  
  