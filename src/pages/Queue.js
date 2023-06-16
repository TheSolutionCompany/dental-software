import React, { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { onSnapshot, query, where, collection } from "firebase/firestore"

const Queue = () => {
    const navigate = useNavigate()
    const [queues, setQueues] = useState([])

    useEffect(() => {
        const q = query(collection(db, "queues"), where("doctorId", "==", auth.currentUser.uid))
        onSnapshot(q, (querySnapshot) => {
            setQueues([])
            querySnapshot.forEach((doc) => {
                setQueues((prev) => [...prev, doc.data()])
            })
        })
    }, [])

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
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Queue</p>
                    <ul>
                        {queues.map((queue) => (
                            <li>
                                <p>{queue.patientName}</p>
                                <p>{queue.complains}</p>
                                <p>{queue.statue}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Queue
