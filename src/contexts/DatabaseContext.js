import React, { useContext, useEffect, useState } from "react"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import { collection, query, where, getDocs, addDoc, updateDoc, getCountFromServer, onSnapshot, doc, deleteDoc } from "firebase/firestore"

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
    const [inventory, setInventory] = useState([])
    const [waitingQueueSize, setWaitingQueueSize] = useState(0)

    useEffect(() => {
        // AvailableDoctors Listener
        const q = query(collection(db, "users"), where("position", "in", ["Doctor", "Locum Doctor"]))
        onSnapshot(q, (querySnapshot) => {
            setAvailableDoctors([])
            querySnapshot.forEach((doc) => {
                setAvailableDoctors((prev) => [...prev, doc])
            })
        })
        // Waiting Queue Size Listener
        const q2 = query(collection(db, "queues"), where("status", "==", "waiting"))
        onSnapshot(q2, (querySnapshot) => {
            setWaitingQueueSize(querySnapshot.size)
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

        // Inventory Listener
        const inventoryQ = query(collection(db, "inventory"))
        onSnapshot(inventoryQ, (querySnapshot) => {
            setInventory([])
            querySnapshot.forEach((doc) => {
                setInventory((prev) => [...prev, doc])
            })
        })

        setLoading(false)
    }, [user])

    async function search(name, ic, mobileNumber) {
        if (name) {
            const start = name
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(collection(db, "patients"), where("name", ">=", start), where("name", "<", end))
            const result = (await getDocs(q)).docs.map((doc) => doc)
            return Object.values(result.sort())
        } else if (ic) {
            const start = ic
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(collection(db, "patients"), where("ic", ">=", start), where("ic", "<", end))
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
    }

    async function addToQueue(patientId, patientName, age, ic, gender, doctorId, complains, status) {
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
    }

    // function getWaitingQueueSize() {
    //     const q = query(collection(db, "queues"), where("status", "==", "waiting"))
    //     getCountFromServer(q).then((result) => {
    //         return result.data().count
    //     })
    // }

    async function checkRepeatedIc(ic) {
        const q = query(collection(db, "patients"), where("ic", "==", ic))
        return (await getCountFromServer(q)).data().count === 0 ? false : true
    }

    async function issueMc(patientId, doctorId, fromDate, toDate, remark) {
        await addDoc(collection(db, "mc"), {
            patientId,
            doctorId,
            fromDate,
            toDate,
            remark,
        })
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
    }

    async function addInventoryItem(name, type, unitPrice, stock) {
        try {
            await addDoc(collection(db, "inventory"), { name, type, unitPrice, stock })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async function editInventoryItem(id, name, type, unitPrice, stock) {
        try{
            await updateDoc(doc(db, "inventory", id), {name, type, unitPrice, stock})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async function deleteObject(docName, id){
        try {
            await deleteDoc(doc(db, docName, id))
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const value = {
        availableDoctors: availableDoctors,
        allQueue: allQueue,
        waitingQueue: waitingQueue,
        inProgressQueue: inProgressQueue,
        completedQueue: completedQueue,
        inventory: inventory,
        waitingQueueSize: waitingQueueSize,
        search,
        addToQueue,
        checkRepeatedIc,
        registerNewPatient,
        addInventoryItem,
        editInventoryItem,
        deleteObject
        //issueMc,
    }

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>
}
