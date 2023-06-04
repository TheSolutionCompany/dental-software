import React, { useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

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
            <h1>Admin Dashboard</h1>
            <h2>Hi {email}</h2>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    )
}

export default AdminDashboard
