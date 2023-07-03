import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

export const Queue = () => {
    const navigate = useNavigate()
    // Functions in AuthContext
    const { logout } = useAuth()

    const [onFocusIndex, setOnFocusIndex] = useState("")

    // Variables in DatabaseContext
    const { allQueue, waitingQueue, inProgressQueue, completedQueue } = useDatabase()

    // Functions in DatabaseContext
    const { updatePatientStatus } = useDatabase()

    const [filter, setFilter] = useState("waiting")

    function generateQueue(queues) {
        return queues.map((row) => (
            <tr
                className={`cursor-pointer
                ${onFocusIndex === row.id ? "tr-focus" :""}`}
                key={row.id}
                onClick={() => {
                    row.id === onFocusIndex ? setOnFocusIndex(null) : setOnFocusIndex(row.id)
                }}
                onDoubleClick={() => handlePatientProfile(row.data().patientId)}
            >
                <td className="w-[20%]">{row.data().patientName}</td>
                <td className="w-[10%]">{row.data().gender}</td>
                <td className="w-[5%] ">{row.data().age}</td>
                <td className="w-[18%]">{row.data().ic}</td>
                <td className="w-[30%]">{row.data().complains}</td>
                <td className="w-[10%]">{row.data().status}</td>
                <td className="w-[7%]">
                    {row.data().status === "waiting" && (
                        <button
                            className="pt-2 hover:text-green-500"
                            onClick={(e) => {
                                handlePatientCall(row.id, row.data().patientId)
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
                    )}
                </td>
            </tr>
        ))
    }

    const handlePatientCall = async (queueId, patientId) => {
        await updatePatientStatus(queueId, "in progress")
        alert(queueId + " " + patientId)
        //navigate("/PatientProfile", { state: { patientId: patientId } })
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
                <div className="w-full bg-gray-200 h-full">
                    <div className="pt-4 pl-10 text-left">
                        <p className="">Filter by status</p>
                        <select className="rounded border-2 border-black" value={filter} onChange={handleFilter}>
                            <option value="all">All</option>
                            <option value="waiting">Waiting</option>
                            <option value="inProgress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex flex-col pt-10 px-8 w-full">
                        <table className="table-gray">
                            <thead>
                                <tr>
                                    <th className="w-[20%]">Patient Name</th>
                                    <th className="w-[10%]">Gender</th>
                                    <th className="w-[5%]">Age</th>
                                    <th className="w-[18%]">IC/Passport number</th>
                                    <th className="w-[30%]">Complains</th>
                                    <th className="w-[10%]">Status</th>
                                    <th className="w-[7%]">Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="flex flex-col w-full mt-[-1px] px-8 h-[82%] overflow-auto">
                        <table className="table-gray">
                            <tbody>
                                {filter === "all" && generateQueue(allQueue)}
                                {filter === "waiting" && generateQueue(waitingQueue)}
                                {filter === "inProgress" && generateQueue(inProgressQueue)}
                                {filter === "completed" && generateQueue(completedQueue)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Queue
