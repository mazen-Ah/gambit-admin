export const Nationalities = ['saudi', 'non-saudi'];
export const SalaryTo = ['payroll', 'non-payroll'];
export const SalaryToCheck = [
  { value: 'payroll', label: 'payroll' },
  { value: 'non-payroll', label: 'non-payroll' }
];
export const NationalitiesCheck = [
  { value: 'saudi', label: 'saudi' },
  { value: 'non-saudi', label: 'non-saudi' }
];
export const Gender = ['male', 'female'];
export const FixedSearchData = {
  vehicle_model_id: '',
  variant_id: '',
  price: '',
  work_sector_id: '',
  nationality_id: '',
  salary_transfer_to: '',
  age: '',
  salary: '',
  down_payment: '',
  finance_duration: '',
  service_period: '',
  balloon_percentage: '',
  car_make: ''
};
export const days = Array.from({ length: 31 }, (_, i) => i + 1);
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 71 }, (_, i) => currentYear - 70 + i);
export const permissionNames = [
  'makes',
  'models',
  'variants',
  'specs',
  'vehicle',
  'body_types',
  'fuel_types',
  'locations',
  'colors',
  'transmissions',
  'trim',
  'finance',
  'banks',
  'service_requests',
  'orders',
  'reports',
  'customers',
  'admins',
  'banners',
  'pages',
  'roles',
  'invoices',
  'ford',
  'chery',
  'articles',
  'rsa',
  'payments',
  'additional_fees',
  'service_providers',
  'users',
  'work_sectors',
  'products',
  'offers',
  'access',
  'distributors',
  'applications',
  'dashboard',
];

export const dashboardDurations = [
  {
    label: 'year',
    value: '1 Year'
  },
  {
    label: 'months',
    value: '6 Months'
  },
  {
    label: 'days',
    value: '30 Days'
  },
  {
    label: 'customize',
    value: 'customize'
  }
];
export const dashboardDataSet = {
  x: '',
  value: ''
};
