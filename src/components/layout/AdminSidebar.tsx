
import React from "react";
import { NavLink } from "react-router-dom";

type AdminSidebarProps = {
  links: {
    to: string;
    label: string;
    icon: React.ReactNode;
  }[];
  isOpen: boolean;
};

export const AdminSidebar = ({ links, isOpen }: AdminSidebarProps) => {
  return (
    <aside className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-56 border-r bg-background overflow-y-auto ${isOpen ? 'block' : 'hidden'} md:block`}>
      <div className="py-4">
        <ul className="space-y-1 px-2">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
