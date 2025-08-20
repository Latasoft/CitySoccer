"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { linkText: "Inicio", href: "/" },
  { linkText: "Quienes somos", href: "/quienessomos" },
  {
    linkText: "Servicios",
    subTitulos: [
      { linkText: "Arriendos Futbol 7", href: "/arrendarcancha/futbol7" },
      { linkText: "Arriendos Futbol 9", href: "/arrendarcancha/futbol9" },
      { linkText: "Arriendos Pickleball", href: "/arrendarcancha/pickleball" },
      {
        linkText: "Clases particulares Futbol",
        href: "/clasesparticularesfutbol",
      },
      {
        linkText: "Clases particulares Pickleball",
        href: "/clasesparticularespickleball",
      },
      { linkText: "Academia de futbol", href: "/academiadefutbol" },
      { linkText: "Academia de Pickeball", href: "/academiadepickeball" },
      { linkText: "Summer Camp", href: "/summer-camp" },
      { linkText: "Eventos", href: "/eventos" },
    ],
  },
  { linkText: "Conocenos", href: "/conocenos" },
  { linkText: "Alianzas", href: "/alianzas" },
  { linkText: "Social Media", href: "/socialmedia" },
  { linkText: "Contacto", href: "/contacto" },
  { linkText: "Login", href: "/login" },
];

const remToPixels = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export default function Navigation() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);
  const [subMenuOpening, setOpenSubMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const subMenuRefs = useRef([]);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Cerrar todos los submenús cuando se cierra el menú principal
    if (menuOpen && subMenuOpening !== null) {
      closeSubMenu(subMenuOpening);
      setOpenSubMenu(null);
    }
  };

  const handleSubMenuToggle = (index) => {
    if (subMenuOpening === index) {
      closeSubMenu(index);
      setOpenSubMenu(null);
    } else {
      if (subMenuOpening !== null) {
        closeSubMenu(subMenuOpening);
      }
      openSubMenu(index);
      setOpenSubMenu(index);
    }
  };

  const handleLinkClick = () => {
    if (subMenuOpening !== null) {
      closeSubMenu(subMenuOpening);
      setOpenSubMenu(null);
    }
    // Close menu on mobile when clicking a link
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const closeSubMenu = (index) => {
    const subMenu = subMenuRefs.current[index];
    if (subMenu) {
      const marginBottomPixels = remToPixels(0.75);
      subMenu.style.height = `${subMenu.scrollHeight + marginBottomPixels}px`;
      requestAnimationFrame(() => {
        subMenu.style.transition =
          "height 0.382s ease-in-out, opacity 0.382s ease-in-out";
        subMenu.style.height = "0";
        subMenu.style.opacity = "0";
      });
    }
  };

  const openSubMenu = (index) => {
    const subMenu = subMenuRefs.current[index];
    if (subMenu) {
      subMenu.style.height = "0";
      subMenu.style.opacity = "0";
      requestAnimationFrame(() => {
        const marginBottomPixels = remToPixels(0.75);
        subMenu.style.transition =
          "height 0.382s ease-in-out, opacity 0.382s ease-in-out";
        subMenu.style.height = `${subMenu.scrollHeight + marginBottomPixels}px`;
        subMenu.style.opacity = "1";
      });
    }
  };

  const isSubItemActive = (subTitulos) => {
    return (
      subTitulos && subTitulos.some((subItem) => subItem.href === activePath)
    );
  };

  const getLinkClass = (path, subTitulos) => {
    const isActive = path === activePath || isSubItemActive(subTitulos);
    return `text-white ${isActive ? 'text-[#57AA32] font-medium' : 'hover:text-[#57AA32]'}`;
  };

  const getSubLinkClass = (path) => {
    const isActive = path === activePath;
    return `text-gray-300 ${isActive ? 'text-[#57AA32] font-medium' : 'hover:text-white'}`;
  };

  return (
    <>
      {/* Mobile Header - Fixed on top for mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-black z-50 p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={toggleMenu}
            >
              <div className="inline-flex h-6 w-7 relative cursor-pointer transition-all ease-in-out duration-200">
                {menuOpen ? (
                  <>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 rotate-45"></div>
                    <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-black"></div>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 -rotate-45"></div>
                  </>
                ) : (
                  <>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-0"></div>
                    <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-white"></div>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-5"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu - Full width dropdown */}
      {isMobile && menuOpen && (
        <div className="fixed top-[72px] left-0 right-0 bg-black z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-6 py-4">
            <ul className="font-inter font-medium text-lg space-y-1">
              {navItems.map((item, index) => (
                <li key={index} className="w-full">
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`${getLinkClass(
                        item.href
                      )} no-underline tracking-wide block py-3 px-2 rounded-lg transition-all duration-300 hover:bg-white/5`}
                    >
                      {item.linkText}
                    </Link>
                  )}
                  {item.subTitulos && (
                    <div>
                      <div
                        onClick={() => handleSubMenuToggle(index)}
                        className={`${getLinkClass(
                          item.href,
                          item.subTitulos
                        )} cursor-pointer tracking-wide py-3 px-2 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-white/5`}
                      >
                        {item.linkText}
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            subMenuOpening === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <ul
                        ref={(el) => (subMenuRefs.current[index] = el)}
                        className="h-0 opacity-0 leading-tight transition-all overflow-hidden"
                      >
                        {item.subTitulos.map((subItem, subIndex) => (
                          <li key={subIndex} className="ml-4">
                            <Link
                              href={subItem.href}
                              onClick={handleLinkClick}
                              className={`${getSubLinkClass(
                                subItem.href
                              )} no-underline text-sm font-normal tracking-wide block py-2 px-2 rounded-lg transition-all duration-300 hover:bg-white/5`}
                            >
                              {subItem.linkText}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      {!isMobile && (
        <nav
          className={`fixed top-0 left-0 h-screen bg-black z-50 flex flex-col transition-all ease-in-out duration-[382ms] ${
            menuOpen ? "w-80" : "w-20"
          }`}
        >
          {/* Header del navbar con logo y botón menú */}
          <div className="flex items-center justify-center p-4 border-b border-white/20">
            {menuOpen ? (
              // Versión expandida - logo y botón menú
              <>
                <div className="flex-1"></div>

                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  <div className="inline-flex h-6 w-7 relative cursor-pointer transition-all ease-in-out duration-200">
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 rotate-45"></div>
                    <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-black"></div>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 -rotate-45"></div>
                  </div>
                </div>
              </>
            ) : (
              // Versión contraída - solo botón menú
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={toggleMenu}
              >
                <div className="inline-flex h-6 w-7 relative cursor-pointer transition-all ease-in-out duration-200">
                  <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-0"></div>
                  <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-white"></div>
                  <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-5"></div>
                </div>
              </div>
            )}
          </div>

          {/* Menu items - solo visibles cuando está expandido */}
          {menuOpen && (
            <div className="flex-1 overflow-y-auto">
              <ul className="font-inter font-medium text-lg px-4 py-4 space-y-1">
                {navItems.map((item, index) => (
                  <li key={index} className="w-full">
                    {item.href && (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`${getLinkClass(
                          item.href
                        )} no-underline tracking-wide block py-3 px-3 rounded-lg transition-all duration-300 hover:bg-white/5`}
                      >
                        {item.linkText}
                      </Link>
                    )}
                    {item.subTitulos && (
                      <div>
                        <div
                          onClick={() => handleSubMenuToggle(index)}
                          className={`${getLinkClass(
                            item.href,
                            item.subTitulos
                          )} cursor-pointer tracking-wide py-3 px-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-white/5`}
                        >
                          {item.linkText}
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              subMenuOpening === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <ul
                          ref={(el) => (subMenuRefs.current[index] = el)}
                          className="h-0 opacity-0 leading-tight transition-all overflow-hidden"
                        >
                          {item.subTitulos.map((subItem, subIndex) => (
                            <li key={subIndex} className="ml-4">
                              <Link
                                href={subItem.href}
                                onClick={handleLinkClick}
                                className={`${getSubLinkClass(
                                  subItem.href
                                )} no-underline text-sm font-normal tracking-wide block py-2 px-3 rounded-lg transition-all duration-300 hover:bg-white/5`}
                              >
                                {subItem.linkText}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      )}

      {/* Spacer for content - Different behavior for mobile vs desktop */}
      <div
        className={`${
          isMobile
            ? "pt-[72px]" // Fixed top padding for mobile
            : `transition-all ease-in-out duration-[382ms] ${
                menuOpen ? "ml-80" : "ml-20"
              }` // Dynamic left margin for desktop
        }`}
      ></div>
    </>
  );
}
