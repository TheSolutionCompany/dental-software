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
            <tr className="w-full h-10 bg-gray-300 font-bold border-l border-t border-b border-black" key={queue.id} onDoubleClick={() => handlePatientProfile(queue.data().patientId)}>
                <td className="border-r border-b border-black">{queue.data().patientName}</td>
                <td className="border-r border-b border-black">{queue.data().gender}</td>
                <td className="border-r border-b border-black">{queue.data().age}</td>
                <td className="border-r border-b border-black">{queue.data().ic}</td>
                <td className="border-r border-b border-black">{queue.data().complains}</td>
                <td className="border-r border-b border-black">{queue.data().status}</td>
                {queue.data().status === "waiting" && (
                    <td className="border-r border-b border-black"
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
            status: "in progress",
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

    const handleFilter = (e) => {
        setFilter(e.target.value)
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Queue"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <select value={filter} onChange={handleFilter}>
                        <option value="all">All</option>
                        <option value="waiting">Waiting</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <table className="w-full h-10 bg-gray-300 font-bold border border-black">
                        <thead>
                            <tr className="w-full h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                                <th className="border-r border-black">Patient Name</th>
                                <th className="border-r border-black">Gender</th>
                                <th className="border-r border-black">Age</th>
                                <th className="border-r border-black">IC/Passport number</th>
                                <th className="border-r border-black">Complains</th>
                                <th className="border-r border-black">Status</th>
                                <th className="border-r border-black">Call</th>
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
