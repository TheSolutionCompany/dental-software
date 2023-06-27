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

    const [onFocusIndex, setOnFocusIndex] = useState("")

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
        return queues.map((row) => (
            <tr
                title="Double Click to Show Profile"
                className={`w-full h-10 font-bold border-l border-t border-b border-black
                ${onFocusIndex === row.id ? "bg-gray-400" : "bg-gray-200"}`}
                key={row.id}
                onClick={() => {
                    row.id === onFocusIndex ? setOnFocusIndex(null) : setOnFocusIndex(row.id)
                }}
                onDoubleClick={() => handlePatientProfile(row.data().patientId)}
            >
                <td className="border-r border-b border-black">{row.data().patientName}</td>
                <td className="border-r border-b border-black">{row.data().gender}</td>
                <td className="border-r border-b border-black">{row.data().age}</td>
                <td className="border-r border-b border-black">{row.data().ic}</td>
                <td className="border-r border-b border-black">{row.data().complains}</td>
                <td className="border-r border-b border-black">{row.data().status}</td>
                {row.data().status === "waiting" && (
                    <td title="call" className="border-r border-b border-black">
                        <button
                            className="pt-2 hover:text-green-500"
                            onClick={(e) => {
                                e.stopPropagation()
                                handlePatientCall(row.id)
                            }}
                        >
                            <span class="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                                    />
                                </svg>
                            </span>
                        </button>
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
                <div className="w-full bg-gray-200 px-8">
                    <div className="p-4 text-left">
                        <p className="">Filter by status</p>
                        <select className="rounded border-2 border-black" value={filter} onChange={handleFilter}>
                            <option value="all">All</option>
                            <option value="waiting">Waiting</option>
                            <option value="inProgress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <table className="table-gray">
                        <thead>
                            <tr className="w-full h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                                <th className="table-th-gray">Patient Name</th>
                                <th className="table-th-gray">Gender</th>
                                <th className="table-th-gray w-[4%]">Age</th>
                                <th className="table-th-gray w-[20%]">IC/Passport number</th>
                                <th className="table-th-gray w-[30%]">Complains</th>
                                <th className="table-th-gray">Status</th>
                                <th className="table-th-gray">Action</th>
                            </tr>
                        </thead>
                        <tbody id="allQueue">{generateQueue(allQueue)}</tbody>
                        <tbody id="waitingQueue">{generateQueue(waitingQueue)}</tbody>
                        <tbody id="inProgressQueue">{generateQueue(inProgressQueue)}</tbody>
                        <tbody id="completedQueue">{generateQueue(completedQueue)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Queue
