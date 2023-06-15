import React, { useState, useEffect } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged, reload, signOut, updateEmail, updateProfile } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const ProfileUpdate = () => {
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [position, setPosition] = useState("")
    const [userId, setUserId] = useState("")

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
                setUserId(user.uid)
                setDisplayName(user.displayName)
                setEmail(user.email)
                const docRef = doc(db, "users", user.uid)
                getDoc(docRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        setPosition(docSnap.data().position)
                    }
                })
            }
        })
    }, [])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        updateProfile(auth.currentUser, { displayName: displayName }).then(() => {
            updateEmail(auth.currentUser, email).then(() => {
                reload(auth.currentUser).then(() => {
                    const docRef = doc(db, "users", userId)
                    updateDoc(docRef, {
                        position: position,
                        displayName: displayName,
                        email: email,
                    }).then(() => {
                        navigate("/profile")
                    })
                })
            })
        })
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
                        <label>Position</label>
                        <select onChange={(e) => setPosition(e.target.value)}>
                            <option value="Doctor">Doctor</option>
                            <option value="Locum Doctor">Locum Doctor</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                        <button>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileUpdate
