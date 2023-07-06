import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import HeaderIcon from "../assets/icons/header-icon.png"
import { useNavigate, useLocation } from "react-router-dom"

const Header = ({ currentPage, handleLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isShown, setIsShown] = useState(false)
    const { user } = useAuth()
    const { waitingQueueSize } = useDatabase()

    const handleDashboardPage = () => {
        if (location.pathname !== "/Dashboard") {
            navigate("/Dashboard")
        }
    }

    const handleQueuePage = () => {
        if (location.pathname !== "/Queue") {
            navigate("/Queue")
        }
    }

    const handleAppointmentsPage = () => {
        if (location.pathname !== "/Appointment") {
            navigate("/Appointment")
        }
    }

    const handleProfilePage = () => {
        if (location.pathname !== "/Profile") {
            navigate("/Profile")
        }
    }

    const handleSettingsPage = () => {
        if (location.pathname !== "/Setting") {
            navigate("/Setting")
        }
    }

    const handleInventoryPage = () => {
        if (location.pathname !== "/Inventory") {
            navigate("/Inventory")
        }
    }

    const handleEmployeePage = () => {
        if (location.pathname !== "/Employee") {
            navigate("/Employee")
        }
    }

    return (
        <header className="flex items-center justify-between bg-gray-800 h-14">
            <div className="h-full w-full flex items-center cursor-pointer ml-4 text-left">
                <img className="h-10 w-10" src={HeaderIcon} alt="header icon" />
                <h1 className="w-full pl-4 text-white font-bold text-xl select-none">Welcome, Dr {user.displayName}</h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button
                    className={`p-4 h-full ${
                        currentPage === "Dashboard" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                    }`}
                    onClick={handleDashboardPage}
                >
                    Dashboard
                </button>
                <button
                    className={`p-4 h-full ${
                        currentPage === "Queue" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                    }`}
                    onClick={handleQueuePage}
                >
                    <div className="flex">

                    Queue
                    {waitingQueueSize > 0 && (
                        <span className="flex items-center justify-center w-3 h-3 p-3 ml-2 text-sm font-medium text-red-200 bg-red-600 rounded-full">
                            {waitingQueueSize}
                        </span>
                    )}
                    </div>
                </button>
                <button
                    className={`p-4 h-full ${
                        currentPage === "Appointment" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                    }`}
                    onClick={handleAppointmentsPage}
                >
                    Appointment
                </button>
                <button
                    className={`p-4 h-full ${
                        currentPage === "Inventory" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                    }`}
                    onClick={handleInventoryPage}
                >
                    Inventory
                </button>
                <button
                    className={`p-4 h-full ${
                        currentPage === "Employee" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                    }`}
                    onClick={handleEmployeePage}
                >
                    Employee
                </button>
                <div className="flex h-full">
                    <button
                        onMouseEnter={() => setIsShown(true)}
                        onMouseLeave={() => setIsShown(false)}
                        className={`p-4 h-full ${
                            currentPage === "Account" ? "bg-gray-200 text-black" : "hover:bg-gray-700 text-white "
                        }`}
                    >
                        Account
                    </button>
                    {isShown && (
                        <ul
                            onMouseEnter={() => setIsShown(true)}
                            onMouseLeave={() => setIsShown(false)}
                            className="cursor-pointer absolute text-white top-14 bg-gray-800 z-50"
                        >
                            <li className="px-4 py-2 hover:bg-gray-700" onClick={handleProfilePage}>
                                Profile
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-700" onClick={handleSettingsPage}>
                                Settings
                            </li>
                            <li onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-500">
                                Logout
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
