import React, { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { onSnapshot, query, where, collection, deleteDoc, doc } from "firebase/firestore"

const Queue = () => {
    const navigate = useNavigate()
    const [queues, setQueues] = useState([])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(collection(db, "queues"), where("doctorId", "==", auth.currentUser.uid))
                onSnapshot(q, (querySnapshot) => {
                    setQueues([])
                    querySnapshot.forEach((doc) => {
                        setQueues((prev) => [...prev, doc])
                    })
                })
            }
        })
    }, [])

    const handlePatientCall = async (patientId, queueId) => {
        await deleteDoc(doc(db, "queues", queueId)).then(() => {
            localStorage.setItem("queueSize", parseInt(localStorage.getItem("queueSize")) - 1)
        })
        alert("Patient called")
    }

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
                    <table>
                        <tr>
                            <th>Patient Name</th>
                            <th>Complains</th>
                            <th>Status</th>
                        </tr>
                        {queues.map((queue) => (
                            <tr>
                                <td>{queue.data().patientName}</td>
                                <td>{queue.data().complains}</td>
                                <td>{queue.data().status}</td>
                                <td>
                                    <button onClick={() => handlePatientCall(queue.data().patientId, queue.id)}>
                                        Call
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Queue
