import React from "react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const Appointment = () => {
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
            <Header className="z-50" currentPage={"Appointment"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                </div>
            </div>
        </div>
    )
}

export default Appointment
