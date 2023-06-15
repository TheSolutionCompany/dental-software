import React, { useState, useEffect } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged, reload, signOut, updateEmail, updateProfile } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const ProfileUpdate = () => {
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
        console.log("componentDidMount")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName)
                setEmail(user.email)
            }
        })
    }, [])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        if (displayName !== auth.currentUser.displayName || email !== auth.currentUser.email) {
            updateProfile(auth.currentUser, { displayName: displayName }).then(() => {
                updateEmail(auth.currentUser, email).then(() => {
                    reload(auth.currentUser).then(() => {
                        navigate("/profile")
                    })
                })
            })
        } else {
            navigate("/profile")
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Profile Update</p>
                    <form onSubmit={handleUpdateProfile}>
                        <label>Name</label>
                        <input
                            type="text"
                            defaultValue={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <label>Email</label>
                        <input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                        <button>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileUpdate
