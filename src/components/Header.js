import React, { useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import HeaderIcon from "../assets/icons/header-icon.png"
import { useNavigate } from "react-router-dom"

const Header = ({ handleLogout }) => {
    const navigate = useNavigate()
    const [isShown, setIsShown] = useState(false)
    const [email, setEmail] = useState("")

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setEmail(user.email)
        }
    })

    const handleDashboardChange = () => {
        navigate("/Dashboard")
    }

    const handleQueueChange = () => {
        navigate("/Queue")
    }

    const handleAppointmentChange = () => {
        navigate("/Appointment")
    }

    return (
        <header className="flex items-center justify-between bg-gray-800 h-14">
            <div className="h-full flex items-center cursor-pointer ml-4">
                <img className="h-10 w-10" src={HeaderIcon} alt="header icon" />
                <h1 className="w-full pl-2 text-white font-bold text-xl select-none">Welcome,{email}</h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleDashboardChange}>
                    Dashboard
                </button>
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleQueueChange}>
                    Queue
                </button>
                <button className="p-4 h-full text-white hover:bg-gray-700" onClick={handleAppointmentChange}>
                    Appointment
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
                            <li className="px-4 py-2 hover:bg-gray-700">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-700">Settings</li>
                            <li onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-500">
                                Logout
                            </li>
                        </ul>
                    )}
                </div>
            </div>
            {/* <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Logout
            </button> */}
        </header>
    )
}

export default Header
