import React from 'react'
import Image from 'next/image'
import NavItems from "@/components/NavItems";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
const Header = () => {
    return (
        <header>
            <div className="sticky top-0 header">
                <div className="container header-wrapper">
                    <Link href="/">
                        <Image src="/assets/icons/logo.svg" alt="logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
                    </Link>
                    <nav className="hidden sm:block">
                        <NavItems/>
                    </nav>
                    <UserDropdown/>
                </div>
            </div>
        </header>
    )
}
export default Header
