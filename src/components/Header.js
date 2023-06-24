import React, { useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import HeaderIcon from "../assets/icons/header-icon.png"
import { useNavigate, useLocation } from "react-router-dom"

const Header = ({ handleLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isShown, setIsShown] = useState(false)
    const [displayName, setDisplayName] = useState("")

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setDisplayName(user.displayName)
        }
    })

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
        if (location.pathname !== "/Appointments") {
            navigate("/Appointments")
        }
    }

    const handleProfilePage = () => {
        if (location.pathname !== "/Profile") {
            navigate("/Profile")
        }
    }

    const handleSettingsPage = () => {
        if (location.pathname !== "/Settings") {
            navigate("/Settings")
        }
    }

    const handleStockPage = () => {
        if (location.pathname !== "/Inventory") {
            navigate("/Inventory")
        }
    }

    return (
        <header className="flex items-center justify-between bg-gray-800 h-14">
            <div className="h-full flex items-center cursor-pointer ml-4">
                <img className="h-10 w-10" src={HeaderIcon} alt="header icon" />
                <h1 className="w-full pl-2 text-white font-bold text-xl select-none">Welcome,{displayName}</h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleDashboardPage}>
                    Dashboard
                </button>
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleQueuePage}>
                    Queue
                    {localStorage.getItem("queueSize") > 0 && <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-red-200 bg-red-600 rounded-full">
                        {localStorage.getItem("queueSize")}
                    </span>}
                </button>
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleAppointmentsPage}>
                    Appointments
                </button>
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleStockPage}>
                    Inventory
                </button>
                <div className="flex h-full">
                    <button
                        onMouseEnter={() => setIsShown(true)}
                        onMouseLeave={() => setIsShown(false)}
                        className="p-4 h-full text-white hover:bg-gray-700"
                    >
                        Account
                    </button>
                    {isShown && (
                        <ul
                            onMouseEnter={() => setIsShown(true)}
                            onMouseLeave={() => setIsShown(false)}
                            className="cursor-pointer absolute text-white top-14 bg-gray-800"
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
