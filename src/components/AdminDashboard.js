import React from "react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import SideBar from "./SideBar"

export const AdminDashboard = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isUserSignedIn")
                navigate("/")
            })
            .catch((error) => {
                console.log("signed out fail")
            })
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div class="container mx-aut bg-gray-200 rounded-xl shadow border">
                    <p class="text-gray-500 text-lg">Admin Dashboard</p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
