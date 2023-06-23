import React, { useState, useEffect } from "react"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { updateDoc, doc } from "firebase/firestore"

export const Queue = () => {
    const navigate = useNavigate()
    // Functions in AuthContext
    const { logout } = useAuth()

    // Variables in DatabaseContext
    const { allQueue, waitingQueue, inProgressQueue, completedQueue } = useDatabase()

    const [filter, setFilter] = useState("waiting")

    useEffect(() => {
        const queueNames = ["allQueue", "waitingQueue", "inProgressQueue", "completedQueue"]
        for (let item of queueNames) {
            let result = item.substring(0, item.length - 5)
            if (result !== filter) {
                document.getElementById(item).hidden = true
            } else {
                document.getElementById(item).hidden = false
            }
        }
        document.getElementById("tableHeader")
    }, [filter])

    function generateQueue(queues) {
        return queues.map((queue) => (
            <tr key={queue.id} onDoubleClick={() => handlePatientProfile(queue.data().patientId)}>
                <td>{queue.data().patientName}</td>
                <td>{queue.data().gender}</td>
                <td>{queue.data().age}</td>
                <td>{queue.data().ic}</td>
                <td>{queue.data().complains}</td>
                <td>{queue.data().status}</td>
                {queue.data().status === "waiting" && (
                    <td
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePatientCall(queue.id)
                        }}
                    >
                        Call
                    </td>
                )}
            </tr>
        ))
    }

    const handlePatientCall = async (queueId) => {
        await updateDoc(doc(db, "queues", queueId), {
            status: "inProgress",
        })
    }

    const handlePatientProfile = (patientId) => {
        navigate("/PatientProfile", { state: { patientId: patientId } })
    }

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleF = (e) => {
        setFilter(e.target.value)
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Queue</p>
                    <select value={filter} onChange={handleF}>
                        <option value="all">All</option>
                        <option value="waiting">Waiting</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>IC/Passport number</th>
                                <th>Complains</th>
                                <th>Status</th>
                                <th>Call</th>
                            </tr>
                        </thead>
                        <tbody id="allQueue">
                            {generateQueue(allQueue)}
                        </tbody>
                        <tbody id="waitingQueue">
                            {generateQueue(waitingQueue)}
                        </tbody>
                        <tbody id="inProgressQueue">
                            {generateQueue(inProgressQueue)}
                        </tbody>
                        <tbody id="completedQueue">
                            {generateQueue(completedQueue)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Queue
