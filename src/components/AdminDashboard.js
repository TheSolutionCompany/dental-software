import React, { useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Register from "./Register"

export const AdminDashboard = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setEmail(user.email)
        }
    })

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
        <div>
            <header class="flex items-center justify-between p-4 bg-gray-800">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full icon"></div>
                    <h1 class="ml-2 text-white font-bold text-3xl">Dental</h1>
                </div>
                <button onClick={handleLogout} class="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded">
                    Logout
                </button>
            </header>
            <div>
                <Register />
            </div>
            <div class="container mx-auto  bg-gray-200 rounded-xl shadow border p-8 m-10">
                <p class="text-3xl text-gray-700 font-bold mb-5">Hi {email}</p>
                <p class="text-gray-500 text-lg">Admin Dashboard</p>
            </div>
        </div>
    )
}

export default AdminDashboard
