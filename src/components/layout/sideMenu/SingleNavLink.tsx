import { Link, useLocation } from 'react-router-dom';
import { ISingleMenuLinks } from '../../../types/Interfaces';

interface IProps {
  links: ISingleMenuLinks;
  setExpanded?: React.Dispatch<React.SetStateAction<string>>;
}
const SingleNavLinks = ({ links, setExpanded }: IProps) => {
  const { pathname } = useLocation();
  const isActive = links?.nestedLinks?.link === pathname;

  return (
    <li className={`toggler`}>
      <Link to={links?.nestedLinks?.link} onClick={() => setExpanded && setExpanded('')}>
        <div className={`toggler_header ${isActive && 'active'}`}>
          {links?.headerIcon}
          <span className="label">{links?.header}</span>
        </div>
      </Link>
    </li>
  );
};

export default SingleNavLinks;
