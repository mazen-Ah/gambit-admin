import { Link, useLocation } from 'react-router-dom';
import { ITogglerNavLink } from '../../../types/Interfaces';
import SideMenuAccordion from './SideMenuAccordion';

const TogglerNavLink = ({ links, expanded, setExpanded, isMouseOver }: ITogglerNavLink) => {
  const { pathname } = useLocation();

  const isActive = !!links?.nestedLinks?.some((link) => link?.link === pathname);

  return (
    <SideMenuAccordion
      icon={links?.headerIcon}
      isMouseOver={isMouseOver}
      isActive={isActive}
      keyName={links?.keyName}
      header={links?.header}
      expanded={expanded}
      setExpanded={setExpanded}
    >
      {links?.nestedLinks?.map(
        (item: any, index: number) =>
          item && (
            <li className={`item`} key={`multiple-link-${index}-${item.link}`}>
              <Link
                to={item.link}
                onClick={() => {
                  const contentContainer = document.querySelector('.layout_content');
                  contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {item?.icon && <div className="icon">{item?.icon}</div>}
                <span className="label">{item?.label}</span>
              </Link>
            </li>
          )
      )}
    </SideMenuAccordion>
  );
};

export default TogglerNavLink;
