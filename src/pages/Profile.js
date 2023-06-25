import React, { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const Profile = () => {
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [position, setPosition] = useState("")

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
            const docRef = doc(db, "users", user.uid)
            getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setPosition(docSnap.data().position)
                }
            })
        })
    }, [])

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        navigate("/ProfileUpdate")
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Account"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Profile</p>
                    <label>Name</label>
                    <input type="text" value={displayName} disabled={true} />
                    <label>Email</label>
                    <input type="email" value={email} disabled={true} />
                    <label>Position</label>
                    <input type="text" value={position} disabled={true} />
                    <button onClick={handleProfileUpdate}>Update profile</button>
                </div>
            </div>
        </div>
    )
}

export default Profile
