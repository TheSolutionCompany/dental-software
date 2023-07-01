import React, { useContext, useEffect, useState } from "react"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    getCountFromServer,
    onSnapshot,
    doc,
    deleteDoc,
    orderBy,
    getDoc,
    setDoc,
    increment,
} from "firebase/firestore"

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
    const [medicineInventory, setMedicineInventory] = useState([])
    const [treatmentInventory, setTreatmentInventory] = useState([])
    const [otherInventory, setOtherInventory] = useState([])
    const [waitingQueueSize, setWaitingQueueSize] = useState(0)
    const [date, setDate] = useState(new Date())
    const dayQueueRef = collection(db, "queues")
    const inventoryRef = collection(db, "inventory")

    useEffect(() => {
        const timer = setInterval(() => {
            const newDate = new Date()
            if (
                date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() !==
                newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()
            ) {
                setDate(new Date())
                console.log("date changed")
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [date])

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
        const q1 = query(
            collection(dayQueueRef, date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), "queue"),
            where("status", "==", "waiting")
        )
        onSnapshot(q1, (querySnapshot) => {
            setWaitingQueueSize(querySnapshot.size)
        })
        // Queue Listener
        if (user) {
            const q2 = query(
                collection(
                    dayQueueRef,
                    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                    "queue"
                ),
                orderBy("queueNumber", "asc")
            )
            onSnapshot(q2, (querySnapshot) => {
                setAllQueue([])
                setWaitingQueue([])
                setInProgressQueue([])
                setCompletedQueue([])
                querySnapshot.forEach((doc) => {
                    if (doc.data().doctorId === user.uid) {
                        setAllQueue((prev) => [...prev, doc])
                        if (doc.data().status === "waiting") {
                            setWaitingQueue((prev) => [...prev, doc])
                        } else if (doc.data().status === "in progress") {
                            setInProgressQueue((prev) => [...prev, doc])
                        } else if (doc.data().status === "completed") {
                            setCompletedQueue((prev) => [...prev, doc])
                        }
                    }
                })
            })
        }

        // Inventory Listener
        const inventoryQ = query(collection(db, "inventory"))
        onSnapshot(inventoryQ, (querySnapshot) => {
            setInventory([])
            setMedicineInventory([])
            setTreatmentInventory([])
            setOtherInventory([])
            querySnapshot.forEach((doc) => {
                setInventory((prev) => [...prev, doc])
                if (doc.data().type === "Medicine") {
                    setMedicineInventory((prev) => [...prev, doc])
                } else if (doc.data().type === "Treatment") {
                    setTreatmentInventory((prev) => [...prev, doc])
                } else if (doc.data().type === "Other Product") {
                    setOtherInventory((prev) => [...prev, doc])
                }
            })
        })

        setLoading(false)
    }, [user, date])

    async function search(name, ic, mobileNumber) {
        if (name) {
            const start = name
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(
                collection(db, "patients"),
                where("name", ">=", start),
                where("name", "<", end),
                orderBy("name", "asc")
            )
            const result = (await getDocs(q)).docs.map((doc) => doc)
            return Object.values(result)
        } else if (ic) {
            const start = ic
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(
                collection(db, "patients"),
                where("ic", ">=", start),
                where("ic", "<", end),
                orderBy("ic", "asc")
            )
            const result = (await getDocs(q)).docs.map((doc) => doc)
            return Object.values(result)
        } else if (mobileNumber) {
            const start = mobileNumber
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(
                collection(db, "patients"),
                where("mobileNumber", ">=", start),
                where("mobileNumber", "<", end),
                orderBy("mobileNumber", "asc")
            )
            const result = (await getDocs(q)).docs.map((doc) => doc)
            return Object.values(result)
        } else {
            return []
        }
    }

    async function addToQueue(patientId, patientName, age, ic, gender, doctorId, complains, status) {
        const creationDate = Date.now()
        const q = doc(dayQueueRef, date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
        var res = await getDoc(q)
        if (!res.exists()) {
            await setDoc(q, { queueNumber: 1 })
        } else {
            await updateDoc(q, { queueNumber: increment(1) })
        }
        res = await getDoc(q)
        const docRef = await addDoc(
            collection(dayQueueRef, date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), "queue"),
            {
                queueNumber: res.data().queueNumber,
                patientId,
                patientName,
                age,
                ic,
                gender,
                doctorId,
                complains,
                status,
                creationDate,
                frontDeskMessage: "",
            }
        )
        const consultationRef = collection(db, "patients", patientId, "consultation")
        await addDoc(consultationRef, {
            queueId: docRef.id,
            creationDate,
            consultation: "",
            frontDeskMessage: "",
            complains,
            items: [],
        })
    }

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
        const docRef = await addDoc(collection(db, "patients"), {
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
        return docRef.id
    }

    async function updatePatientStatus(queueId, status) {
        const subCollectionRef = collection(
            dayQueueRef,
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            "queue"
        )
        const docRef = doc(subCollectionRef, queueId)
        await updateDoc(docRef, {
            status: status,
        })
    }

    async function getCurrentConsultation(patientId, queueId) {
        const subCollectionRef = collection(db, "patients", patientId, "consultation")
        const q = query(subCollectionRef, where("queueId", "==", queueId))
        const result = (await getDocs(q)).docs[0]
        return result
    }

    async function getConsultationHistory(patientId) {
        const subCollectionRef = collection(db, "patients", patientId, "consultation")
        const q = query(subCollectionRef, orderBy("creationDate", "desc"))
        const result = (await getDocs(q)).docs.map((doc) => doc)
        return Object.values(result)
    }

    async function updateConsultation(patientId, consultationId, consultation, frontDeskMessage, items) {
        const docRef = doc(db, "patients", patientId, "consultation", consultationId)
        await updateDoc(docRef, {
            consultation: consultation,
            frontDeskMessage: frontDeskMessage,
            items: items,
        })
    }

    async function addInventoryItem(name, type, unitPrice, stock, threshold) {
        try {
            await addDoc(inventoryRef, { name, type, unitPrice, stock, threshold })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async function editInventoryItem(id, name, type, unitPrice, stock, threshold) {
        try {
            await updateDoc(doc(db, "inventory", id), { name, type, unitPrice, stock, threshold })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async function deleteObject(docName, id) {
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
        medicineInventory: medicineInventory,
        treatmentInventory: treatmentInventory,
        otherInventory: otherInventory,
        waitingQueueSize: waitingQueueSize,
        search,
        addToQueue,
        checkRepeatedIc,
        registerNewPatient,
        addInventoryItem,
        editInventoryItem,
        deleteObject,
        issueMc,
        updatePatientStatus,
        getCurrentConsultation,
        getConsultationHistory,
        updateConsultation,
    }

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>
}
