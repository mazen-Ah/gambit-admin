import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Lang_Icon, sideMenuOpenIcon } from "../../../config/variables";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import SideMenuLinks from "./SideMenuLinks";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie';

const SideMenu = ({ openMenu, setOpenMenu }: { openMenu?: boolean, setOpenMenu?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { i18n } = useTranslation()
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<boolean>(true);
  const [keepExpanded, setKeepExpanded] = useState<boolean>(true);
  const el = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline());
  const navigate = useNavigate();
  const { authData } = useSelector((store: any) => store)

  console.log(authData, "authData");

  const isDesktopOrBigger = useMediaQuery({ query: '(min-width: 1024px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current = gsap.timeline();

      if (!isDesktopOrBigger) {
        tl.current.fromTo(
          ".label",
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            ease: "power3.inOut",
            duration: 0.3,
          },
          0.1
        );
      }

      if (isDesktopOrBigger) {
        tl.current
          .fromTo(
            el.current,
            {
              width: "4.5rem",
            },
            {
              width: isDesktopOrBigger ? "18rem" : "100%",
              ease: "power3.inOut",
              duration: 0.5,
            })
          .fromTo(
            ".logo_expand_container .logo_container h4",
            {
              width: 0,
              duration: 0.5,
            },
            {
              width: "14rem",
              ease: "power3.inOut",
              duration: 0.5,
            },
            0.1
          )
          .fromTo(
            ".logo_expand_container .expand_btn",
            {
              marginInlineEnd: "1rem",
              duration: 0.5,
            },
            {
              marginInlineEnd: 0,
              ease: "power3.inOut",
              duration: 0.5,
            },
            0.1
          )
          .fromTo(
            ".logo_expand_container .logo_container h4",
            {
              autoAlpha: 0,
              duration: 0.7,
            },
            {
              autoAlpha: 1,
              ease: "power3.inOut",
              duration: 0.7,
            },
            0.2
          );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [isDesktopOrBigger]);

  const [isMouseOver, setIsMouseOver] = useState(true)

  return (
    <div className={`sidemenu_wrapper ${!isDesktopOrBigger && (openMenu ? "open" : "close")}  ${[
      "/auth/login",
      "/auth/forgot-password",
      "/verify-admin",
      "/auth/reset-password"
    ].some(path => pathname.includes(path)) ? "hide_sidebar" : ""}
    `} ref={el}
      onMouseEnter={() => { if (!keepExpanded && isDesktopOrBigger) { tl.current.play(); setIsMouseOver(true) } }}
      onMouseLeave={() => { if (!keepExpanded && isDesktopOrBigger) { tl.current.reverse(); setIsMouseOver(false) } }}
    >
      <div className="logo_expand_container">
        <div className="logo_container pointer">
          <h4 style={{ color: "white" }} onClick={() => {
            const contentContainer = document.querySelector(".layout_content");
            contentContainer?.scrollTo({ top: 0, behavior: "smooth" });
            navigate("/")
          }}>{'Gambit'}</h4>
        </div>
        <div className={`expand_btn label ${keepExpanded && "keep_expanded"}`}
          onClick={() => {
            isDesktopOrBigger ? setExpanded(!expanded) : setOpenMenu && setOpenMenu(false);
            isDesktopOrBigger && setKeepExpanded(!keepExpanded);

          }}
        >
          {sideMenuOpenIcon}
        </div>

      </div>
      <SideMenuLinks isMouseOver={isMouseOver}/>
      {isMobile && (
        <div className="lang" onClick={() => i18n.language === "ar" ? i18n.changeLanguage("en") : i18n.changeLanguage("ar")}>
          <span className="lang-name">{i18n.language === "en" ? "عربي" : "EN"}</span>{Lang_Icon}
        </div>
      )}
    </div>
  );
};

export default SideMenu;