export interface IUser {
  first_name: string;
  last_name: string;
  name?: string;
  mobile: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  profession: string;
  address: {
    // region: string
    street: string;
    city: string;
  };
  role_id: string;
  roles?: string[];
  id?: string;
  status?: number;
  email_verified_at?: string | null;
  is_verified?: boolean;
}

export interface IAdmin {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  city_id?: string;
  roles?: string[];
  mobile?: string;
  status?: string;
  verified?: boolean;
}
