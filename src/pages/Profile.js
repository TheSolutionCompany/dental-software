import React, { useEffect, useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const Profile = () => {
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isUserSignedIn")
                navigate("/")
            })
            .catch(() => {
                console.log("signed out fail")
            })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName)
                setEmail(user.email)
            }
        })
    }, [])

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        navigate("/ProfileUpdate")
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Profile</p>
                    <label>Name</label>
                    <input type="text" value={displayName} />
                    <label>Email</label>
                    <input type="email" value={email} />
                    <button onClick={handleProfileUpdate}>Update profile</button>
                </div>
            </div>
        </div>
    )
}

export default Profile
