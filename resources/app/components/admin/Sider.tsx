import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuList = [
  {
    title: "User",
    href: "/admin/users",
  },
  {
    title: "Template",
    href: "/admin/templates",
  },
];
export default function Sider({ collapsed }) {
  const location = useLocation();

  return (
    <div
      className={`${
        collapsed ? "-ml-64" : "ml-0"
      } w-64 border-r h-screen transition-all`}
    >
      <Link to="/">
        <img
          src={"/assets/logo.png"}
          css={{ maxHeight: "100%" }}
          className="p-2"
        />
      </Link>
      <nav>
        <ul className="">
          {menuList.map((item) => {
            return (
              <li
                key={item.href}
                className={`flex ${
                  location.pathname.includes(item.href)
                    ? "bg-gray-100 border-r-2 border-blueSecondary"
                    : "hover:bg-gray-50"
                }`}
              >
                <Link className="pl-4 py-2 w-full" to={item.href}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
