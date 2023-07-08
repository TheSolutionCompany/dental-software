import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import BillingForm from "../components/BillingForm"

export const Queue = () => {
    const navigate = useNavigate()
    // Functions in AuthContext
    const { logout } = useAuth()

    // Variables in DatabaseContext
    const { allQueue, waitingQueue, inProgressQueue, pendingBillingQueue, completedQueue } = useDatabase()

    // Functions in DatabaseContext
    const { updatePatientStatus } = useDatabase()

    const [filter, setFilter] = useState("waiting")

    function generateQueue(queues) {
        return queues.map((row) => (
            <tr
                key={row.id}
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
                            className="hover:text-green-500"
                            onClick={(e) => {
                                handlePatientCall(row.data().patientId, row.id)
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
                    {row.data().status === "in progress" && (
                        <button
                            className="hover:text-green-500"
                            onClick={(e) => {
                                handlePatientProfile(row.data().patientId, row.id)
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                        </button>
                    )}
                    {row.data().status === "pending billing" && (
                        <BillingForm
                            queueId={row.id}
                            patientId={row.data().patientId}
                            patientName={row.data().patientName}
                        />
                    )}
                </td>
            </tr>
        ))
    }

    const handlePatientCall = async (patientId, queueId) => {
        await updatePatientStatus(queueId, "in progress")
        handlePatientProfile(patientId, queueId)
    }

    const handlePatientProfile = (patientId, queueId) => {
        navigate("/PatientProfile", { state: { patientId: patientId, mode: "consult", queueId: queueId } })
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
                    <div className="p-8">
                        <div className="pb-8 text-left">
                            <p className="">Filter by status</p>
                            <select className="rounded border-2 border-black" value={filter} onChange={handleFilter}>
                                <option value="all">All</option>
                                <option value="waiting">Waiting</option>
                                <option value="inProgress">In Progress</option>
                                <option value="pendingBilling">Pending Billing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-full border-black overflow-auto">
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
                                <tbody>
                                    {filter === "all" && generateQueue(allQueue)}
                                    {filter === "waiting" && generateQueue(waitingQueue)}
                                    {filter === "inProgress" && generateQueue(inProgressQueue)}
                                    {filter === "pendingBilling" && generateQueue(pendingBillingQueue)}
                                    {filter === "completed" && generateQueue(completedQueue)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Queue
