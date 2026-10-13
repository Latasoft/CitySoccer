"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminModeToggle, useAdminMode } from "@/contexts/AdminModeContext";
import { useAuth } from "@/hooks/useAuth";
import EditableNavLink from "./EditableNavLink";

// Menú de la landing: cada opción baja a una sección de la página de inicio.
// Ya no incluye los arriendos de canchas, porque ahora las reservas se hacen en Easycancha.
const fallbackNavItems = [
    { id: 1, text: "Inicio", href: "/" },
    { id: 2, text: "Quiénes somos", href: "/#quienes-somos" },
    {
        id: 3,
        text: "Fútbol",
        submenu: [
            { id: 33, text: "Clases particulares Fútbol", href: "/#clases-futbol" },
            { id: 34, text: "Academia de Fútbol", href: "/#academia-futbol" },
        ],
    },
    {
        id: 4,
        text: "Pickleball",
        submenu: [
            { id: 43, text: "Clases particulares Pickleball", href: "/#clases-pickleball" },
            { id: 44, text: "Academia de Pickleball", href: "/#academia-pickleball" },
        ],
    },
    { id: 5, text: "Summer Camp", href: "/#summer-camp" },
    { id: 6, text: "Eventos", href: "/#eventos" },
    { id: 7, text: "Contacto", href: "/#contacto" },
];

const remToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export default function Navigation() {
    const pathname = usePathname();
    const { user, isAdmin } = useAuth();
    const { isAdminMode } = useAdminMode();
    const [activePath, setActivePath] = useState(pathname);
    const [subMenuOpening, setOpenSubMenu] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [navItems, setNavItems] = useState(fallbackNavItems);
    const [loadingNav, setLoadingNav] = useState(true);

    const subMenuRefs = useRef([]);

    // Cargar items del menú desde archivo JSON local
    useEffect(() => {
        const CACHE_KEY = 'navigation_menu_cache';
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
        
        const loadMenuItems = async (forceRefresh = false) => {
            // Landing: el menú usa siempre la lista escrita en este archivo (fallbackNavItems).
            // El navigation.json guardado en el disco de Render tiene el menú antiguo (con arriendos)
            // y no se actualiza al publicar, por eso ya no se carga desde ahí.
            const USAR_MENU_DEL_CODIGO = true;
            if (USAR_MENU_DEL_CODIGO) {
                const itemsWithAuth = [...fallbackNavItems];
                if (user) {
                    itemsWithAuth.push({ id: 999, text: "Dashboard", href: "/dashboard" });
                } else {
                    itemsWithAuth.push({ id: 999, text: "Login", href: "/login" });
                }
                setNavItems(itemsWithAuth);
                setLoadingNav(false);
                return;
            }
            try {
                console.log('🔍🧭 Navigation: Iniciando carga de menú...', { forceRefresh });
                
                // Intentar usar cache si no se fuerza refresh
                if (!forceRefresh && typeof window !== 'undefined') {
                    try {
                        const cached = localStorage.getItem(CACHE_KEY);
                        if (cached) {
                            const { data, timestamp } = JSON.parse(cached);
                            const age = Date.now() - timestamp;
                            
                            if (age < CACHE_DURATION) {
                                console.log(`🔍🧭 ✅ Usando cache (${Math.round(age / 1000)}s de antigüedad)`);
                                
                                // Aplicar los datos cacheados
                                if (data && data.menu_items && data.menu_items.length > 0) {
                                    const itemsWithAuth = [...data.menu_items];
                                    if (user) {
                                        itemsWithAuth.push({ id: 999, text: "Dashboard", href: "/dashboard" });
                                    } else {
                                        itemsWithAuth.push({ id: 999, text: "Login", href: "/login" });
                                    }
                                    setNavItems(itemsWithAuth);
                                    setLoadingNav(false);
                                    return; // Salir sin hacer fetch
                                }
                            } else {
                                console.log(`🔍🧭 Cache expirado (${Math.round(age / 1000)}s), recargando...`);
                            }
                        }
                    } catch (cacheError) {
                        console.warn('🔍🧭 Error leyendo cache, continuando con fetch:', cacheError);
                    }
                }
                
                const url = forceRefresh 
                    ? '/api/content?pageKey=navigation&fresh=true'
                    : '/api/content?pageKey=navigation';
                const response = await fetch(url);            console.log('🔍🧭 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔍🧭 ERROR Response:', errorText);
                throw new Error('No se pudo cargar navigation.json');
            }
            
            const result = await response.json();
            console.log('🔍🧭 Result recibido:', {
                success: result.success,
                hasData: !!result.data,
                dataKeys: result.data ? Object.keys(result.data) : []
            });
            
            const data = result.data;
            
            // Guardar en cache
            if (data && typeof window !== 'undefined') {
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data,
                        timestamp: Date.now()
                    }));
                    console.log('🔍🧭 ✅ Menu guardado en cache');
                } catch (cacheError) {
                    console.warn('🔍🧭 Error guardando cache:', cacheError);
                }
            }
            
            if (data && data.menu_items && data.menu_items.length > 0) {
                const itemsWithAuth = [...data.menu_items];
                
                console.log('🔍🧭 Menu items cargados:', itemsWithAuth.length, itemsWithAuth.map(i => i.text));
                
                // Agregar Login o Dashboard al final según autenticación
                if (user) {
                    itemsWithAuth.push({ id: 999, text: "Dashboard", href: "/dashboard" });
                } else {
                    itemsWithAuth.push({ id: 999, text: "Login", href: "/login" });
                }
                
                console.log('🔍🧭 Items finales con auth:', itemsWithAuth.map(i => i.text));
                setNavItems(itemsWithAuth);
                } else {
                    // Usar fallback
                    const itemsWithAuth = [...fallbackNavItems];
                    
                    if (user) {
                        itemsWithAuth.push({ id: 999, text: "Dashboard", href: "/dashboard" });
                    } else {
                        itemsWithAuth.push({ id: 999, text: "Login", href: "/login" });
                    }
                    
                    setNavItems(itemsWithAuth);
                }
            } catch (error) {
                console.error('🔍🧭 ERROR CRÍTICO cargando menú:', error.message);
                console.error('🔍🧭 Stack:', error.stack);
                // Usar fallback con Login/Dashboard correcto
                const itemsWithAuth = [...fallbackNavItems];
                
                if (user) {
                    itemsWithAuth.push({ id: 999, text: "Dashboard", href: "/dashboard" });
                } else {
                    itemsWithAuth.push({ id: 999, text: "Login", href: "/login" });
                }
                
                setNavItems(itemsWithAuth);
            } finally {
                setLoadingNav(false);
            }
        };

        loadMenuItems();
        
        // Escuchar evento de actualización desde EditableNavLink
        const handleNavigationUpdate = (event) => {
            console.log('🔍🧭 Evento navigation-updated recibido!', event.detail);
            
            // Invalidar cache y recargar
            if (typeof window !== 'undefined') {
                localStorage.removeItem('navigation_menu_cache');
                console.log('🔍🧭 Cache invalidado, recargando...');
            }
            loadMenuItems(true); // Forzar recarga sin cache
        };
        
        window.addEventListener('navigation-updated', handleNavigationUpdate);
        
        return () => {
            window.removeEventListener('navigation-updated', handleNavigationUpdate);
        };
    }, [user, isAdmin]);

    useEffect(() => {
    }, [user, isAdmin]); // Agregar dependencias user e isAdmin

    // Función para transformar datos de BD al formato esperado
    const transformMenuData = (menuData) => {
        const rootItems = menuData.filter(item => !item.parent_id);
        
        return rootItems.map(parent => {
            const children = menuData.filter(item => item.parent_id === parent.id);
            
            if (children.length > 0) {
                return {
                    linkText: parent.label,
                    subTitulos: children.map(child => ({
                        linkText: child.label,
                        href: child.url,
                        externo: child.externo
                    }))
                };
            } else {
                return {
                    linkText: parent.label,
                    href: parent.url,
                    externo: parent.externo
                };
            }
        });
    };

    useEffect(() => {
        setActivePath(pathname);
    }, [pathname]);

    // Add this new useEffect to close navbar when pathname changes
    useEffect(() => {
        // Close the navbar when navigating to a new page
        setMenuOpen(false);

        // Also close any open submenus
        if (subMenuOpening !== null) {
            closeSubMenu(subMenuOpening);
            setOpenSubMenu(null);
        }
    }, [pathname]); // This runs whenever the pathname changes

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
        // No abrir submenús en modo admin (para permitir edición)
        if (isAdminMode) {
            return;
        }
        
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

    const handleLinkClick = (e) => {
        // Prevenir navegación en modo admin
        if (isAdminMode) {
            e.preventDefault();
            return;
        }
        
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

    const isSubItemActive = (submenu) => {
        return (
            submenu && submenu.some((subItem) => subItem.href === activePath)
        );
    };

    const getLinkClass = (path, submenu) => {
        const isActive = path === activePath || isSubItemActive(submenu);
        return `text-white ${
            isActive ? "text-[#57AA32] font-medium" : "hover:text-[#FFED00]"
        }`;
    };

    const getSubLinkClass = (path) => {
        const isActive = path === activePath;
        return `text-gray-300 ${
            isActive ? "text-[#57AA32] font-medium" : "hover:text-[#FFED00]"
        }`;
    };

    return (
        <>
            {/* Mobile Header - Fixed on top for mobile */}
            {isMobile && (
                <div className="fixed top-0 left-0 right-0 bg-black z-50 p-6 border-b border-white/20">
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
                        
                        {/* Admin Mode Toggle */}
                        <AdminModeToggle />
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
                                            <EditableNavLink itemId={item.id} defaultText={item.text} />
                                        </Link>
                                    )}
                                    {item.submenu && (
                                        <div>
                                            <div
                                                onClick={() => handleSubMenuToggle(index)}
                                                className={`${getLinkClass(
                                                    item.href,
                                                    item.submenu
                                                )} cursor-pointer tracking-wide py-3 px-2 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-white/5`}
                                            >
                                                <EditableNavLink itemId={item.id} defaultText={item.text} />
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
                                                {item.submenu.map((subItem, subIndex) => (
                                                    <li key={subIndex} className="ml-4">
                                                        <Link
                                                            href={subItem.href}
                                                            onClick={handleLinkClick}
                                                            className={`${getSubLinkClass(
                                                                subItem.href
                                                            )} no-underline text-sm font-normal tracking-wide block py-2 px-2 rounded-lg transition-all duration-300 hover:bg-white/5`}
                                                        >
                                                            <EditableNavLink itemId={subItem.id} defaultText={subItem.text} />
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
                                                <EditableNavLink itemId={item.id} defaultText={item.text} />
                                            </Link>
                                        )}
                                        {item.submenu && (
                                            <div>
                                                <div
                                                    onClick={() => handleSubMenuToggle(index)}
                                                    className={`${getLinkClass(
                                                        item.href,
                                                        item.submenu
                                                    )} cursor-pointer tracking-wide py-3 px-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-white/5`}
                                                >
                                                    <EditableNavLink itemId={item.id} defaultText={item.text} />
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
                                                    {item.submenu.map((subItem, subIndex) => (
                                                        <li key={subIndex} className="ml-4">
                                                            <Link
                                                                href={subItem.href}
                                                                onClick={handleLinkClick}
                                                                className={`${getSubLinkClass(
                                                                    subItem.href
                                                                )} no-underline text-sm font-normal tracking-wide block py-2 px-3 rounded-lg transition-all duration-300 hover:bg-white/5`}
                                                            >
                                                                <EditableNavLink itemId={subItem.id} defaultText={subItem.text} />
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
                    
                    {/* Admin Mode Toggle - Desktop */}
                    {menuOpen && (
                        <div className="p-4 border-t border-white/20">
                            <AdminModeToggle />
                        </div>
                    )}
                </nav>
            )}
        </>
    );
}
