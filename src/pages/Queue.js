import React, { useEffect, useRef, useState } from "react"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { updateDoc, doc } from "firebase/firestore"

export const Queue = () => {
    // Functions in AuthContext
    const { user, logout } = useAuth()

    // Variables in DatabaseContext
    const { allQueue, waitingQueue, inProgressQueue, completedQueue } = useDatabase()

    // const filter = useRef("waiting")
    const [queues, setQueues] = useState(waitingQueue)
    let [change, setChange] = useState("waiting")
    let filter = "waiting"

    const navigate = useNavigate()

    const handlePatientCall = async (patientId, queueId) => {
        await updateDoc(doc(db, "queues", queueId), {
            status: "inProgress",
        })
    }

    const handlePatientProfile = (patientId) => {
        navigate("/PatientProfile", { state: { patientId: patientId, doctorId: user.uid } })
    }

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    function handleFilter(e) {
        console.log("beforeSetFilter")
        console.log(e.target.value)
        filter = e.target.value
        setChange(e.target.value)
        console.log("afterSetFilter")
    }

    useEffect(() => {
        console.log("useEffectStart")
        console.log(filter)
        switch (filter) {
            case "all":
                console.log("Inall")
                setQueues(allQueue)
                break
            case "waiting":
                setQueues(waitingQueue)
                break
            case "inProgress":
                setQueues(inProgressQueue)
                break
            case "completed":
                setQueues(completedQueue)
                break
            default:
                setQueues(allQueue)
                break
        }
        console.log("useEffectEnd")
    }, [filter, allQueue, waitingQueue, inProgressQueue, completedQueue])

    useEffect(() => {
        console.log("queueChange")
    }, [queues])

    return (
        <div>queue</div>
        // <div className="flex flex-col h-full">
        //     <Header className="z-50" handleLogout={handleLogout} />
        //     <div className="flex h-full">
        //         <SideBar />
        //         <div className="w-full bg-gray-200">
        //             <p className="text-gray-500 text-lg">Queue</p>
        //             <select onChange={handleFilter}>
        //                 <option value="all">All</option>
        //                 <option selected value="waiting">
        //                     Waiting
        //                 </option>
        //                 <option value="inProgress">In progress</option>
        //                 <option value="completed">Completed</option>
        //             </select>
        //                 <table>
        //                     <thead>
        //                         <tr>
        //                             <th>Patient Name</th>
        //                             <th>Gender</th>
        //                             <th>Age</th>
        //                             <th>IC/Passport number</th>
        //                             <th>Complains</th>
        //                             <th>Status</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {/* {filter.current.value === "all" &&
        //                             allQueue.map((queue) => (
        //                                 <tr onClick={() => handlePatientProfile(queue.data().patientId)}>
        //                                     <td>{queue.data().patientName}</td>
        //                                     <td>{queue.data().gender}</td>
        //                                     <td>{queue.data().age}</td>
        //                                     <td>{queue.data().IC}</td>
        //                                     <td>{queue.data().complains}</td>
        //                                     <td>{queue.data().status}</td>
        //                                     {queue.data().status === "waiting" && (
        //                                         <td
        //                                             onClick={(e) => {
        //                                                 e.stopPropagation()
        //                                                 handlePatientCall(queue.data().patientId, queue.id)
        //                                             }}
        //                                         >
        //                                             Call
        //                                         </td>
        //                                     )}
        //                                 </tr>
        //                             ))} */}
        //                         {
        //                             queues.map((queue) => (
        //                                 <tr key={queue.id} onClick={() => handlePatientProfile(queue.data().patientId)}>
        //                                     <td>{queue.data().patientName}</td>
        //                                     <td>{queue.data().gender}</td>
        //                                     <td>{queue.data().age}</td>
        //                                     <td>{queue.data().IC}</td>
        //                                     <td>{queue.data().complains}</td>
        //                                     <td>{queue.data().status}</td>
        //                                     {queue.data().status === "waiting" && (
        //                                         <td
        //                                             onClick={(e) => {
        //                                                 e.stopPropagation()
        //                                                 handlePatientCall(queue.data().patientId, queue.id)
        //                                             }}
        //                                         >
        //                                             Call
        //                                         </td>
        //                                     )}
        //                                 </tr>
        //                             ))}
        //                     </tbody>
        //                 </table>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Queue
