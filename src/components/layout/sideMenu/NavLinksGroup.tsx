import { ITogglerNavLinkGroup, ISingleMenuLinks, IMenuLinks } from '../../../types/Interfaces';
import SingleNavLinks from './SingleNavLink';
import SideMenuAccordion from './SideMenuAccordion';
import TogglerNavLink from './TogglerNavLink';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

function isSingleMenuLinks(link: IMenuLinks | ISingleMenuLinks): link is ISingleMenuLinks {
  return !Array.isArray(link.nestedLinks) || link.nestedLinks.length === 1;
}

interface IProps extends ITogglerNavLinkGroup {
  isMouseOver: boolean;
  expanded?: string;
  setExpanded?: React.Dispatch<React.SetStateAction<string>>;
}

const NavLinksGroup = ({ links, name, icon, keyName, expanded, setExpanded, isMouseOver }: IProps) => {
  const [innerExpanded, setInnerExpanded] = useState<string>('');
  const { pathname } = useLocation();

  function checkActiveLink(link: IMenuLinks | ISingleMenuLinks) {
    if (isSingleMenuLinks(link)) {
      return link?.nestedLinks?.link === pathname;
    } else {
      return link?.nestedLinks?.some((link) => link?.link === pathname);
    }
  }

  const isActive = useMemo(() => {
    return links.some((link) => checkActiveLink(link));
  }, [pathname, links]);

  return (
    <SideMenuAccordion
      header={name}
      icon={icon}
      isActive={isActive}
      keyName={keyName}
      expanded={expanded}
      setExpanded={setExpanded}
      onClose={() => {
        const activeLink = links.find((link) => link.keyName === innerExpanded);
        if (activeLink && !checkActiveLink(activeLink)) {
          setInnerExpanded('');
        }
      }}
      isMouseOver={isMouseOver}
    >
      {links?.map((link, index) => {
        if (isSingleMenuLinks(link)) {
          return <SingleNavLinks key={`single-link-${index}`} links={{...link, nestedLinks: Array.isArray(link.nestedLinks) ? link.nestedLinks[0] : link.nestedLinks}} setExpanded={setInnerExpanded} />;
        } else {
          return <TogglerNavLink isMouseOver={isMouseOver} key={`multiple-links-${index}`} links={link} expanded={innerExpanded} setExpanded={setInnerExpanded} />;
        }
      })}
    </SideMenuAccordion>
  );
};

export default NavLinksGroup;
