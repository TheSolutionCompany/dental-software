import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const Dashboard = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Dashboard</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
