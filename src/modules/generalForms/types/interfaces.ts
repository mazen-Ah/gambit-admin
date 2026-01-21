export type IOffersFormItem = {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  vehicle_model_id: string,
  vehicleModel: {
    name: {
      en: string,
      ar: string
    }
  },
  message: string,
};
export type IContactUsFormItem = {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  vehicle_model_id: string,
  vehicleModel: {
    name: {
      en: string,
      ar: string
    }
  },
  message: string,
  enquiry_type: string,
};
export type INewsLetterFormItem = {
  id: number,
  email: string,
};
export type IQuoteFormItem = {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  vehicle_model_id: string,
  vehicleModel: {
    name: {
      en: string,
      ar: string
    }
  },
  message: string,
};