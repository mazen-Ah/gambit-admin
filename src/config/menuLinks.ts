import { productIcon, serviceIcon } from "./variables";

export const serviceProviderLinks = {
    header: "Service Providers",
    baseRoute: "/services",
    headerIcon: [serviceIcon],
    nestedLinks: [
      {
        label: "Service Providers", link: "/services", icon: [serviceIcon],
      },
      {
        label: "Create Service Provider", link: "/services/create-service", icon: [serviceIcon],
      },
    ]
  }
export const productLinks = {
    header: "Products",
    baseRoute: "/products",
    headerIcon: [productIcon],
    nestedLinks: [
      {
        label: "Products", link: "/products", icon: [productIcon],
      },
      {
        label: "Create Product", link: "/products/create-product?step=0", icon: [productIcon],
      },
    ]
  }

