import React from "react";
import { NAVBAR_HEIGHT } from "../../lib/constants";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return <div
    className="fixed top-0 left-0 right-0 z-50 shadow-xl"
    style={{
        height: `${NAVBAR_HEIGHT}px`,
    }}
  >
    <div className="flex items-center justify-between w-full px-8 py-3 bg-primary-700 text-white">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 md:gap-6">
                <Link href="/" className="cursor-pointer" scroll={false}>
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="logo" width={24} height={24} className="w-6 h-6" />
                        <span className="text-xl font-bold">RENT</span>
                    </div>
                </Link>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Link href='/signin' className="cursor-pointer" scroll={false}>
                <div className="flex items-center gap-2">
                    <button className="border border-red-500 rounded-full px-4 py-2">Sign In</button>
                </div>
            </Link>
            <Link href='/signup' className="cursor-pointer" scroll={false}>
                <div className="flex items-center gap-2">
                    <button className="border border-white rounded-full px-4 py-2">Sign Up</button>
                </div>
            </Link>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                signOut();
                router.push('/signin');
            }}>
                <button className="border border-white rounded-full px-4 py-2">Log out</button>
            </div>
        </div>
    </div>
  </div>;
};

export default Navbar;