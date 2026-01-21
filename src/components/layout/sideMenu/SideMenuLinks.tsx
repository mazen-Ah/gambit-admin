import ActiveSideMenuAccordionContextProvider from '../../../store/context/activeSideMenuAccordionContext';
import { hasPermission } from '../../../utils/HelperFunctions';
import TogglerNavLink from './TogglerNavLink';
import {
  createIcon,
  listIcon,
  Sales,
  permissionsIcon,
  stepsIcon,
  dashboard,
  vehicleMakeIcon,
  bodyTypeIcon,
  fuelTypeIcon,
  locationIcon,
  transmissionsIcon,
  colorsIcon,
  cityIcon,
  warrantyIcon,
  notificationsIcon,
  templateIcon,
  pageIcon,
  jobIcon,
  CategoriesIcon,
  OfferIcon,
  cmsIcon,
  termsIcon,
  faqsIcon,
  articlesIcon,
  tagsIcon,
  mapIcon
} from '../../../config/variables';
import { useTranslation } from 'react-i18next';
import { IMenuLinks, ISingleMenuLinks, ITogglerNavLinkGroup } from '../../../types/Interfaces';
import { useMemo, useState } from 'react';
import SingleNavLinks from './SingleNavLink';
import { generalGet } from '../../../API/api';
import { useQuery } from '@tanstack/react-query';
import NavLinksGroup from './NavLinksGroup';
import { useSelector } from 'react-redux';

const SideMenuLinks = ({ isMouseOver }: { isMouseOver: boolean }) => {
  const { t, i18n } = useTranslation();

  const { authData } = useSelector((store: any) => store);

  console.log(authData, 'authData');

  const pagesLinks = {
    header: t('links.pages'),
    baseRoute: '/pages',
    headerIcon: [pageIcon],
    keyName: 'pagesLinks',
    nestedLinks: [
      {
        label: t('links.pages'),
        link: '/pages',
        icon: [listIcon]
      },
      {
        label: t('create_page'),
        link: '/pages/create-page',
        icon: [createIcon]
      }
    ]
  };

  const sectionTypesLinks = {
    header: t('section_types'),
    baseRoute: '/section-types',
    headerIcon: [cmsIcon],
    keyName: 'sectionTypesLinks',
    nestedLinks: [
      {
        label: t('section_types'),
        link: '/section-types',
        icon: [listIcon]
      },
      {
        label: t('create_section_type'),
        link: '/section-types/create-section-type',
        icon: [createIcon]
      }
    ]
  };

  function filterValidNested(links: any) {
    return links.filter(
      (
        ele: any
      ): ele is {
        label: string;
        link: string;
        icon: JSX.Element[];
      } => ele !== false
    );
  }


  const generalFormsLinks = {
    header: t('links.general_forms'),
    baseRoute: '/general-forms',
    headerIcon: [listIcon],
    keyName: 'generalFormsLinks',
    nestedLinks: [
      { label: t('links.offers_forms'), link: '/general-forms/offers', icon: [listIcon] },
      { label: t('links.contact-us_forms'), link: '/general-forms/contact-us', icon: [listIcon] },
      { label: t('links.news-letter_forms'), link: '/general-forms/news-letter', icon: [listIcon] },
      { label: t('links.quote_forms'), link: '/general-forms/quote', icon: [listIcon] }
    ]
  };

  const rolesLinks = {
    header: t('rolesAndPermissions'),
    baseRoute: '/roles',
    headerIcon: [permissionsIcon],
    keyName: 'rolesLinks',
    nestedLinks: filterValidNested([
      hasPermission(['roles.show']) && { label: t('roles'), link: '/roles', icon: [listIcon] },
      hasPermission(['roles.edit']) && { label: t('createRole'), link: '/roles/create-role', icon: [createIcon] }
    ])
  };

  const adminsLinks = {
    header: t('links.admins'),
    baseRoute: '/admins',
    headerIcon: [Sales],
    keyName: 'adminsLinks',
    nestedLinks: filterValidNested([
      hasPermission(['admins.show']) && { label: t('links.admins'), link: '/admins', icon: [listIcon] },
      hasPermission(['admins.edit']) && { label: t('create_admin'), link: '/admins/create-admin', icon: [createIcon] }
    ])
  };

  const menuGroups: ITogglerNavLinkGroup[] = [
    {
      name: t('cms'),
      icon: [cmsIcon],
      keyName: 'cmsGroupLinks',
      links: [pagesLinks, sectionTypesLinks].filter(Boolean) as (IMenuLinks | ISingleMenuLinks)[]
    },
    // {
    //   name: t('links.leads'),
    //   icon: [Sales],
    //   keyName: 'leadsGroupLinks',
    //   links: [hasPermission(['general_forms.show']) && generalFormsLinks].filter(Boolean) as (IMenuLinks | ISingleMenuLinks)[]
    // },
  ].filter((ele) => ele.links.length > 0);

  const [expanded, setExpanded] = useState<string>('');

  return (
    <ul className="nav_links">
      <ActiveSideMenuAccordionContextProvider>
        {/* <SingleNavLinks links={dashboardLinks} setExpanded={setExpanded} /> */}
        <TogglerNavLink isMouseOver={isMouseOver} key={'pagesLinks'} links={pagesLinks as IMenuLinks} expanded={expanded} setExpanded={setExpanded} />
        <TogglerNavLink isMouseOver={isMouseOver} key={'sectionTypesLinks'} links={sectionTypesLinks as IMenuLinks} expanded={expanded} setExpanded={setExpanded} />

        {/* {hasPermission(['admins.show', 'admins.edit']) && (
          <TogglerNavLink isMouseOver={isMouseOver} key={'adminsLinks'} links={adminsLinks as IMenuLinks} expanded={expanded} setExpanded={setExpanded} />
        )}
        {hasPermission(['roles.get', 'roles.edit']) && (
          <TogglerNavLink isMouseOver={isMouseOver} key={'rolesLinks'} links={rolesLinks as IMenuLinks} expanded={expanded} setExpanded={setExpanded} />
        )} */}
      </ActiveSideMenuAccordionContextProvider>
    </ul>
  );
};

export default SideMenuLinks;
