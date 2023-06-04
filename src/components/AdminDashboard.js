import React from "react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const AdminDashboard = () => {
    const navigate = useNavigate()

    const handleLogout = (event) => {
        signOut(auth)
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                console.log("signed out fail")
            })
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button type="submit" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    )
}

export default AdminDashboard
