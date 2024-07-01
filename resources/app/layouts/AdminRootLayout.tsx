import Header from "@/components/admin/Header";
import Sider from "@/components/admin/Sider";
import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";

export default function AdminRootLayout(props: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState<Boolean>(false);
  return (
    <main className="">
      <div className="flex">
        <Sider collapsed={collapsed} />
        <div className="w-full">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          {props.children}
          <Outlet />
        </div>
      </div>
    </main>
  );
}
