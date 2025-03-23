import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

type NavigationItem = {
  title: string;
  to?: string;
  subLinks?: SubLink[];
};

type SubLink = {
  title: string;
  to: string;
  activePaths?: string[];
};

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    to: "/",
  },
  {
    title: "Products",
    subLinks: [
      {
        title: "All Products",
        to: "/products/all",
        activePaths: ["/products/edit"],
      },
      { title: "Create Product", to: "/products/create" },
    ],
  },
];

export default function Sidebar() {
  const [collapsedState, setCollapsedState] = useState<{
    [key: string]: boolean;
  }>(() =>
    navigationItems.reduce((acc, nav) => {
      acc[nav.title] = true;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const location = useLocation();

  const isSubLinkActive = (subLinks: SubLink[]): boolean => {
    return subLinks.some(
      (subLink) =>
        location.pathname.startsWith(subLink.to) ||
        subLink.activePaths?.some((activePath) =>
          location.pathname.startsWith(activePath)
        )
    );
  };

  useEffect(() => {
    navigationItems.forEach((nav) => {
      if (nav.subLinks) {
        if (isSubLinkActive(nav.subLinks)) {
          setCollapsedState((prevState) => ({
            ...prevState,
            [nav.title]: false,
          }));
        }
      }
    });
  }, [location]);

  const toggleCollapse = (title: string) => {
    setCollapsedState((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  return (
    <div
      className="sticky top-0 left-0 h-screen w-[170px] bg-primary-500 dark:bg-secondary-600 transition-colors duration-200
    px-3 py-5"
    >
      <img className="size-12 mx-auto" src="/src/assets/logo2.svg" alt="" />
      <ul className="mt-4 space-y-2">
        {navigationItems.map((nav) => (
          <li key={nav.to || nav.title}>
            {nav.subLinks ? (
              <div>
                <button
                  className="w-full flex items-center justify-between text-start py-1.5 px-3 rounded-md cursor-pointer text-sm font-semibold text-neutral-100 tracking-wide transition-colors duration-200 hover:bg-primary-400 dark:hover:bg-neutral-500/50"
                  onClick={() => toggleCollapse(nav.title)}
                >
                  {nav.title}
                  <ChevronRight
                    size={15}
                    className={`transition-transform duration-200 ${
                      !collapsedState[nav.title] && "rotate-90"
                    }`}
                  />
                </button>

                {!collapsedState[nav.title] && (
                  <ul className="ms-4 mt-2 space-y-1">
                    {nav.subLinks.map((subNav) => (
                      <li key={subNav.to}>
                        <NavLink
                          to={subNav.to}
                          className={({ isActive }) =>
                            `py-1.5 px-3 rounded-md cursor-pointer w-full flex gap-2 justify-start 
                            font-semibold text-sm text-neutral-100 tracking-wide transition-colors duration-200 
                            ${
                              isActive ||
                              subNav.activePaths?.some((activePath) =>
                                location.pathname.startsWith(activePath)
                              )
                                ? "bg-neutral-100 text-primary-500 hover:bg-neutral-200"
                                : "hover:bg-primary-400 dark:hover:bg-neutral-500/50"
                            }`
                          }
                        >
                          {subNav.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={nav.to || ""}
                className={({ isActive }) =>
                  `py-1.5 px-3 rounded-md cursor-pointer w-full flex gap-2 justify-start 
                  font-semibold text-sm text-neutral-100 tracking-wide transition-colors duration-200 
                  ${
                    isActive
                      ? "bg-neutral-100 text-primary-500 hover:bg-neutral-200"
                      : "hover:bg-primary-400 dark:hover:bg-neutral-500/50"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
