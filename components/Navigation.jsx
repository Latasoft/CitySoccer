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
    return "text-white";
  };

  return (
    <>
      {/* Mobile Header - Fixed on top for mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-[#c0c0c0] z-50 p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/Logo.png"
                alt="City Soccer Logo"
                width={36}
                height={36}
                className="object-cover object-center h-10 w-auto rounded-full border-2 border-white"
              />
            </Link>

            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={toggleMenu}
            >
              <div className="inline-flex h-6 w-7 relative cursor-pointer transition-all ease-in-out duration-200">
                {menuOpen ? (
                  <>
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 rotate-45"></div>
                    <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-[#c0c0c0]"></div>
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
        <div className="fixed top-[72px] left-0 right-0 bg-[#c0c0c0] z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-6 py-4">
            <ul className="font-semibold text-lg space-y-2">
              {navItems.map((item, index) => (
                <li key={index} className="w-full">
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`${
                        getLinkClass(item.href)
                      } hover:text-gray-200 no-underline whitespace-nowrap block py-3 transition-colors`}
                    >
                      {item.linkText}
                    </Link>
                  )}
                  {item.subTitulos && (
                    <div>
                      <div
                        onClick={() => handleSubMenuToggle(index)}
                        className={`${
                          getLinkClass(item.href, item.subTitulos)
                        } hover:text-gray-200 cursor-pointer whitespace-nowrap py-3 flex items-center justify-between transition-colors`}
                      >
                        {item.linkText}
                        <svg
                          className={`w-4 h-4 transition-transform ${
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
                              className={`${
                                getLinkClass(subItem.href)
                              } hover:text-gray-200 no-underline text-sm whitespace-nowrap block py-2 transition-colors`}
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

            {/* Social Media Links for Mobile */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="https://www.facebook.com/citysoccer"
                  className="text-white hover:text-gray-200 text-center"
                >
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs block mt-1">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/citysoccersantiago"
                  className="text-white hover:text-gray-200 text-center"
                >
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-xs block mt-1">Instagram</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      {!isMobile && (
        <nav
          className={`fixed top-0 left-0 h-screen bg-[#c0c0c0] z-50 flex flex-col transition-all ease-in-out duration-[382ms] ${
            menuOpen ? "w-80" : "w-20"
          }`}
        >
          {/* Header del navbar con logo y botón menú */}
          <div className="flex items-center justify-center p-4 border-b border-white/20">
            {menuOpen ? (
              // Versión expandida - logo y botón menú
              <>
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/Logo.png"
                    alt="City Soccer Logo"
                    width={36}
                    height={36}
                    className="object-cover object-center h-14 w-auto rounded-full border-2 border-white"
                  />
                </Link>

                <div className="flex-1"></div>

                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  <div className="inline-flex h-6 w-7 relative cursor-pointer transition-all ease-in-out duration-200">
                    <div className="block mx-auto w-7 h-1 absolute left-0 z-20 transition-all ease-in-out duration-[380ms] bg-white top-2.5 rotate-45"></div>
                    <div className="mx-auto w-7 h-1 absolute top-2.5 left-0 z-10 transition-all ease-in-out duration-[380ms] bg-[#c0c0c0]"></div>
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
              <ul className="font-semibold text-lg px-6 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <li key={index} className="w-full">
                    {item.href && (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`${
                          getLinkClass(item.href)
                        } hover:text-gray-200 no-underline whitespace-nowrap block py-3 transition-colors`}
                      >
                        {item.linkText}
                      </Link>
                    )}
                    {item.subTitulos && (
                      <div>
                        <div
                          onClick={() => handleSubMenuToggle(index)}
                          className={`${
                            getLinkClass(item.href, item.subTitulos)
                          } hover:text-gray-200 cursor-pointer whitespace-nowrap py-3 flex items-center justify-between transition-colors`}
                        >
                          {item.linkText}
                          <svg
                            className={`w-4 h-4 transition-transform ${
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
                                className={`${
                                  getLinkClass(subItem.href)
                                } hover:text-gray-200 no-underline text-sm whitespace-nowrap block py-2 transition-colors`}
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

          {/* Footer del navbar con redes sociales - solo cuando está expandido */}
          {menuOpen && (
            <div className="p-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="https://www.facebook.com/citysoccer"
                  className="text-white hover:text-gray-200 text-center"
                >
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs block mt-1">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/citysoccersantiago"
                  className="text-white hover:text-gray-200 text-center"
                >
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-xs block mt-1">Instagram</span>
                </Link>
              </div>
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