import React, { useContext, useEffect, useState } from "react"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import { collection, query, where, getDocs, addDoc, getCountFromServer, onSnapshot } from "firebase/firestore"

const DatabaseContext = React.createContext()

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {
    // Variables in AuthContext
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [availableDoctors, setAvailableDoctors] = useState([])
    const [allQueue, setAllQueue] = useState([])
    const [waitingQueue, setWaitingQueue] = useState([])
    const [inProgressQueue, setInProgressQueue] = useState([])
    const [completedQueue, setCompletedQueue] = useState([])

    useEffect(() => {
        // AvailableDoctors Listener
        const q = query(collection(db, "users"), where("position", "in", ["Doctor", "Locum Doctor"]))
        onSnapshot(q, (querySnapshot) => {
            setAvailableDoctors([])
            querySnapshot.forEach((doc) => {
                setAvailableDoctors((prev) => [...prev, doc])
            })
        })
        // Queue Listener
        if (user) {
            const q1 = query(collection(db, "queues"), where("doctorId", "==", user.uid))
            onSnapshot(q1, (querySnapshot) => {
                setAllQueue([])
                setWaitingQueue([])
                setInProgressQueue([])
                setCompletedQueue([])
                querySnapshot.forEach((doc) => {
                    setAllQueue((prev) => [...prev, doc])
                    if (doc.data().status === "waiting") {
                        setWaitingQueue((prev) => [...prev, doc])
                    } else if (doc.data().status === "inProgress") {
                        setInProgressQueue((prev) => [...prev, doc])
                    } else if (doc.data().status === "completed") {
                        setCompletedQueue((prev) => [...prev, doc])
                    }
                })
            })
        }
        setLoading(false)
    }, [user])


    async function search(name, IC, mobileNumber) {
        try {
            if (name) {
                const start = name
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "patients"), where("name", ">=", start), where("name", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => doc)
                return Object.values(result.sort())
            } else if (IC) {
                const start = IC
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "patients"), where("IC", ">=", start), where("IC", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => doc)
                return Object.values(result.sort())
            } else if (mobileNumber) {
                const start = mobileNumber
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(
                    collection(db, "patients"),
                    where("mobileNumber", ">=", start),
                    where("mobileNumber", "<", end)
                )
                const result = (await getDocs(q)).docs.map((doc) => doc)
                return Object.values(result.sort())
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function addToQueue(patientId, patientName, age, ic, gender, doctorId, complains, status) {
        try {
            await addDoc(collection(db, "queues"), {
                patientId,
                patientName,
                age,
                ic,
                gender,
                doctorId,
                complains,
                status,
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getWaitingQueueSize() {
        try {
            const q = query(collection(db, "queue"), where("status", "==", "waiting"))
            return (await getCountFromServer(q)).data().count
        } catch (error) {
            console.log(error)
        }
    }

    async function checkRepeatedIc(ic) {
        try {
            const q = query(collection(db, "patients"), where("ic", "==", ic))
            return (await getCountFromServer(q)).data().count === 0 ? false : true
        } catch (error) {
            console.log(error)
        }
    }

    async function registerNewPatient(
        title,
        name,
        ic,
        gender,
        dob,
        age,
        mobileNumber,
        phoneNumber,
        email,
        race,
        maritalStatus,
        nationality,
        emergencyContactName,
        emergencyContactNumber,
        bloodType,
        knowAboutUs,
        panelCompany,
        occupation,
        preferredLanguage,
        preferredCommunication,
        referBy,
        address,
        secondAddress,
        allergy,
        remarks
    ) {
        try {
            await addDoc(collection(db, "patients"), {
                title,
                name,
                ic,
                gender,
                dob,
                age,
                mobileNumber,
                phoneNumber,
                email,
                race,
                maritalStatus,
                nationality,
                emergencyContactName,
                emergencyContactNumber,
                bloodType,
                knowAboutUs,
                panelCompany,
                occupation,
                preferredLanguage,
                preferredCommunication,
                referBy,
                address,
                secondAddress,
                allergy,
                remarks,
            })
        } catch (error) {
            console.log("Error at registerNewPatient function: " + error)
        }
    }
    const value = {
        availableDoctors: availableDoctors,
        allQueue: allQueue,
        waitingQueue: waitingQueue,
        inProgressQueue: inProgressQueue,
        completedQueue: completedQueue,
        search,
        addToQueue,
        getWaitingQueueSize,
        checkRepeatedIc,
        registerNewPatient,
    }

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>
}
