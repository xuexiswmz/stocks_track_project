import React from "react";
import '../globals.css'
import Header from "@/components/Header";
const Layout = ({children}: { children:React.ReactNode }) => {
    return (
        <html>
            <body>
                <main className="min-h-screen text-gray-400">
                    <Header/>
                    <div className="container py-10">{children}</div>
                </main>
            </body>
        </html>
    )
}
export default Layout
