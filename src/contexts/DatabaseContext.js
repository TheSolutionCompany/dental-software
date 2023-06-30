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
} from "firebase/firestore"

const DatabaseContext = React.createContext()

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {
    // Variables in AuthContext
    const { user, signupWithName, updateEmail } = useAuth()

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
    const [employees, setEmployees] = useState([])
    const [date, setDate] = useState(new Date())
    const dayQueueRef = collection(db, "queues")
    const inventoryRef = collection(db, "inventory")
    const employeeRef = collection(db, "users")

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
        // Employees Listener
        const employeesQ = query(employeeRef)
        onSnapshot(employeesQ, (querySnapshot) => {
            setEmployees([])
            setAvailableDoctors([])
            querySnapshot.forEach((doc) => {
                setEmployees((prev) => [...prev, doc])
                if(doc.data().position === "Doctor" || doc.data().position === "Locum Doctor"){
                    setAvailableDoctors((prev) => [...prev, doc])
                }
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
                where("doctorId", "==", user.uid)
            )
            onSnapshot(q2, (querySnapshot) => {
                setAllQueue([])
                setWaitingQueue([])
                setInProgressQueue([])
                setCompletedQueue([])
                querySnapshot.forEach((doc) => {
                    setAllQueue((prev) => [...prev, doc])
                    if (doc.data().status === "waiting") {
                        setWaitingQueue((prev) => [...prev, doc])
                    } else if (doc.data().status === "in progress") {
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
    }, [user, date, dayQueueRef, inventoryRef, employeeRef])

    async function search(name, ic, mobileNumber) {
        if (name) {
            const start = name
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(collection(db, "patients"), where("name", ">=", start), where("name", "<", end), orderBy("name", "asc"))
            const result = (await getDocs(q)).docs.map((doc) => doc)
            return Object.values(result)
        } else if (ic) {
            const start = ic
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
            const q = query(collection(db, "patients"), where("ic", ">=", start), where("ic", "<", end), orderBy("ic", "asc"))
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
        await addDoc(
            collection(dayQueueRef, date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), "queue"),
            {
                patientId,
                patientName,
                age,
                ic,
                gender,
                doctorId,
                complains,
                status,
            }
        )
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
        alert(docRef.id)
        return docRef.id
    }

    async function updatePatientStatus(queueId, status) {
        const subCollectionRef = collection(
            dayQueueRef,
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            "queue"
        )
        const docRef = doc(subCollectionRef, queueId);
        await updateDoc(docRef, {
            status: status,
        })
    }

    async function getConsultationHistory(patientId, timeCreated) {
        const subCollectionRef = collection(db, "patients", patientId, "consultationHistory")
        const q = query(subCollectionRef, where("timeCreated", "!=", timeCreated ), orderBy("timeCreated", "desc"))
        const result = (await getDocs(q)).docs.map((doc) => doc)
        return Object.values(result)
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

    async function addEmployee(displayName, email, position, password) {
        try {
            let workingHours = ['-','-','-','-','-','-','-']
            //await signupWithName(email, password, displayName)
            await addDoc(employeeRef, {displayName, email, position, workingHours})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    // For admin usage only. Should be the logged in user that changes the email not the admin
    // totally not because i realize i cannot change the email that is stored in the authentication
    // tab in firebase thru auth context lol
    async function editEmployee(id, displayName, position) {
        try {
            await updateDoc(doc(db, "users", id), {displayName: displayName, position: position})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
    // write another function that allows users to edit their own email under profile page

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
        employees: employees,
        search,
        addToQueue,
        checkRepeatedIc,
        registerNewPatient,
        addInventoryItem,
        editInventoryItem,
        deleteObject,
        issueMc,
        updatePatientStatus,
        addEmployee,
        editEmployee,
        getConsultationHistory,
    }

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>
}
