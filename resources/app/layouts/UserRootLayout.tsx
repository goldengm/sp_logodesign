import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export default function UserRootLayout(props: { children?: ReactNode }) {
  return (
    <main className="">
      <Header />
      {props.children}
      <Outlet />
    </main>
  );
}
