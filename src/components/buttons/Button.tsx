import { useNavigate } from 'react-router-dom';
import { IButtonProps } from '../../types/Interfaces';
import { navigateRoute } from '../../utils/HelperFunctions';

const Button = ({ text, customClass, type, children, onClick, disabled, loading, scrollUp, link, commentBtn }: IButtonProps) => {
  const navigate = useNavigate()
  return (
    <button
      className={`button_container  ${disabled && 'disabled'} ${loading && 'loading'} ${customClass && customClass}`}
      type={type && type}
      onClick={(e: any) => {
        if(disabled || loading) return;
        commentBtn && e.stopPropagation();
        const contentContainer = document.querySelector('.layout_content');
        scrollUp && contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
        commentBtn && onClick && e.preventDefault();
        onClick && onClick(e);
        link && navigateRoute(e, link, navigate);
      }}
      disabled={disabled}
    >
      {loading ? (
        <div className="loader-page login">
          <div className="submit_loading_container"></div>
        </div>
      ) : (
        <>
          {text && <span className="bold">{text}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
