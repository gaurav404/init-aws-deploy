'use client'
import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "../../../lib/constants";
import React from "react";
import { useGetAuthUserQuery } from "@/state/api";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: userData } = useGetAuthUserQuery();
  console.log(userData);
  return <div className="h-full w-full">
    <Navbar/>
    <main className={`flex h-full w-full`} style={{
        paddingTop: `${NAVBAR_HEIGHT}px`,
    }}>
        {children}
    </main>
  </div>;
};

export default Layout;