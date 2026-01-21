import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ISideMenuAccordionProps {
  expanded?: string;
  header: string;
  keyName: string;
  className?: string;
  isActive?: boolean;
  icon: React.ReactNode;
  setExpanded?: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
  isMouseOver: boolean;
  onClose?: () => void;
}

const SideMenuAccordion = ({ expanded, setExpanded, keyName, className, header, icon, children, onClose, isActive, isMouseOver }: ISideMenuAccordionProps) => {
  const el = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline());
  const tlClose = useRef<gsap.core.Timeline>(gsap.timeline());
  const [active, setActive] = useState(false);
  const {i18n} = useTranslation()

  const handleToggle = () => {
    setExpanded && setExpanded(expanded === keyName ? '' : keyName);
  };

  useEffect(() => {
    if (isActive && setExpanded) {
      setExpanded(keyName);
    }
  }, []);

  useEffect(() => {
    if (!headerRef.current || !itemsRef) return;
    tlClose?.current?.kill();
    tl?.current?.kill();

    tl.current = gsap.timeline({ paused: true });
    tlClose.current = gsap.timeline({ paused: true });

    tl.current
      .to(itemsRef.current, { height: 'auto', ease: 'power3.out', duration: 0.5 })
      .to(headerRef.current.querySelector('.chevron'), { rotate: i18n.language === 'ar' ? 270 : 90, ease: 'power3.inOut', duration: 0.2 }, 0)
      .to(itemsRef.current, { autoAlpha: 1, ease: 'power3.inOut', duration: 0.3 }, 0.15);

    tlClose.current
      .to(itemsRef.current, { autoAlpha: 0, ease: 'power3.outIn', duration: 0.3 })
      .to(headerRef.current.querySelector('.chevron'), { rotate: i18n.language === 'ar' ? 180 : 0, ease: 'power3.outIn', duration: 0.2 }, 0)
      .to(itemsRef.current, { height: 0, ease: 'power3.out', duration: 0.5 }, 0.15);

    if (expanded === keyName && !active && isMouseOver) {
      tl?.current?.play(0);
      setActive(true);
    } else if (active && (expanded !== keyName || !isMouseOver)) {
      tlClose.current?.play(0);
      setActive(false);
      onClose && onClose()
    }
  }, [expanded, keyName, setActive, isMouseOver]);

  return (
    <div className={`toggler ${className || ''}`} ref={el}>
      <div
        className={`toggler_header ${isActive && 'active'} ${expanded === keyName && !isActive && 'just_expanded_header'}`}
        onClick={() => {
          handleToggle();
        }}
        ref={headerRef}
      >
        {icon}
        <span className="label">{header}</span>
        <svg className="chevron" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path fill="currentColor" d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </div>
      <ul className={`collapsed_items ${expanded === keyName && 'expanded_items'}`} ref={itemsRef}>
        <div className="inner">{children}</div>
      </ul>
    </div>
  );
};

export default SideMenuAccordion;
