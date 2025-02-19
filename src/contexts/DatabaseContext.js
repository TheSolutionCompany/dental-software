import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
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
} from "firebase/firestore";

const DatabaseContext = React.createContext();

export function useDatabase() {
    return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
    // Variables in AuthContext
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [availableDoctors, setAvailableDoctors] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [patients, setPatients] = useState([]);

    const [allQueue, setAllQueue] = useState([]);
    const [waitingQueue, setWaitingQueue] = useState([]);
    const [inProgressQueue, setInProgressQueue] = useState([]);
    const [pendingBillingQueue, setPendingBillingQueue] = useState([]);
    const [completedQueue, setCompletedQueue] = useState([]);
    const [waitingQueueSize, setWaitingQueueSize] = useState(0);

    const [inventory, setInventory] = useState([]);
    const [medicineInventory, setMedicineInventory] = useState([]);
    const [treatmentInventory, setTreatmentInventory] = useState([]);
    const [otherInventory, setOtherInventory] = useState([]);

    const [transactions, setTransactions] = useState([]);

    const [appointments, setAppointments] = useState([]);
    const [appointmentFlipFlop, setAppointmentFlipFlop] = useState(false);
    const [commonVariables, setCommonVariables] = useState([]);

    const [date, setDate] = useState(new Date());
    const dayQueueRef = collection(db, "queues");
    const inventoryRef = collection(db, "inventory");
    const employeeRef = collection(db, "users");

    const commonVariablesRef = collection(db, "commonvariables");

    useEffect(() => {
        const timer = setInterval(() => {
            const newDate = new Date();
            if (
                date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() !==
                newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()
            ) {
                setDate(new Date());
                console.log("date changed");
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [date]);

    useEffect(() => {
        // Employees Listener
        const employeesQ = query(employeeRef);
        onSnapshot(employeesQ, (querySnapshot) => {
            setEmployees([]);
            setAvailableDoctors([]);
            querySnapshot.forEach((doc) => {
                setEmployees((prev) => [...prev, doc]);
                if (doc.data().position === "Doctor" || doc.data().position === "Locum Doctor") {
                    setAvailableDoctors((prev) => [...prev, doc]);
                }
            });
        });

        if (user) {
            // Waiting Queue Size Listener
            const q1 = query(
                collection(
                    dayQueueRef,
                    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                    "queue"
                ),
                where("status", "==", "waiting"),
                where("doctorId", "==", user.uid)
            );
            onSnapshot(q1, (querySnapshot) => {
                console.log("waiting queue size listener");
                setWaitingQueueSize(querySnapshot.size);
            });

            // Queue Listener
            const q2 = query(
                collection(
                    dayQueueRef,
                    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                    "queue"
                ),
                orderBy("queueNumber", "asc")
            );
            onSnapshot(q2, (querySnapshot) => {
                console.log("queue listener");
                setAllQueue([]);
                setWaitingQueue([]);
                setInProgressQueue([]);
                setPendingBillingQueue([]);
                setCompletedQueue([]);
                querySnapshot.forEach((doc) => {
                    if (doc.data().doctorId === user.uid) {
                        setAllQueue((prev) => [...prev, doc]);
                        if (doc.data().status === "waiting") {
                            setWaitingQueue((prev) => [...prev, doc]);
                        } else if (doc.data().status === "in progress") {
                            setInProgressQueue((prev) => [...prev, doc]);
                        } else if (doc.data().status === "pending billing") {
                            setPendingBillingQueue((prev) => [...prev, doc]);
                        } else if (doc.data().status === "completed") {
                            setCompletedQueue((prev) => [...prev, doc]);
                        }
                    }
                });
            });

            // Appointment Listener
            const appointmentQ = query(collection(db, "users", user.uid, "appointments"));
            onSnapshot(appointmentQ, (querySnapshot) => {
                console.log("appointment listener");
                setAppointments([]);
                querySnapshot.forEach((doc) => {
                    setAppointments((prev) => [...prev, doc]);
                });
            });

            // Transactinos Listener
            const transactionsQ = query(
                collection(db, "payments", date.getFullYear() + "-" + (date.getMonth() + 1), date.getDate() + ""),
                where("doctorId", "==", user.uid)
            );
            onSnapshot(transactionsQ, (querySnapshot) => {
                console.log("transactions listener");
                setTransactions([]);
                querySnapshot.forEach((doc) => {
                    setTransactions((prev) => [...prev, doc]);
                });
            });
        }

        // Patients Listener
        const patientsQ = query(collection(db, "patients"));
        onSnapshot(patientsQ, (querySnapshot) => {
            console.log("patients listener");
            setPatients([]);
            querySnapshot.forEach((doc) => {
                setPatients((prev) => [...prev, doc]);
            });
        });

        // Inventory Listener
        const inventoryQ = query(collection(db, "inventory"));
        onSnapshot(inventoryQ, (querySnapshot) => {
            console.log("inventory listener");
            setInventory([]);
            setMedicineInventory([]);
            setTreatmentInventory([]);
            setOtherInventory([]);
            querySnapshot.forEach((doc) => {
                setInventory((prev) => [...prev, doc]);
                if (doc.data().type === "Medicine") {
                    setMedicineInventory((prev) => [...prev, doc]);
                } else if (doc.data().type === "Treatment") {
                    setTreatmentInventory((prev) => [...prev, doc]);
                } else if (doc.data().type === "Other Product") {
                    setOtherInventory((prev) => [...prev, doc]);
                }
            });
        });

        // Common Variables Listener
        const commonVarQ = query(commonVariablesRef);
        onSnapshot(commonVarQ, (querySnapshot) => {
            console.log("common variables listener");
            setCommonVariables([]);
            querySnapshot.forEach((doc) => {
                setCommonVariables((prev) => [...prev, doc]);
            });
        });

        setLoading(false);
    }, [user, date]);

    async function search(name, ic, mobileNumber) {
        if (name) {
            const start = name;
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
            return patients
                .filter((patient) => patient.data().name >= start && patient.data().name < end)
                .sort((a, b) => a.data().name.localeCompare(b.data().name));
        } else if (ic) {
            const start = ic;
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
            return patients
                .filter((patient) => patient.data().ic >= start && patient.data().ic < end)
                .sort((a, b) => a.data().ic.localeCompare(b.data().ic));
        } else if (mobileNumber) {
            const start = mobileNumber;
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
            return patients
                .filter((patient) => patient.data().mobileNumber >= start && patient.data().mobileNumber < end)
                .sort((a, b) => a.data().mobileNumber.localeCompare(b.data().mobileNumber));
        } else {
            return [];
        }
    }

    async function addToQueue(patientId, patientName, age, ic, gender, doctorId, complains, status) {
        // Used a nowDate variable to prevent the date from changing when the function is running
        const nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const consultationNoQ = doc(commonVariablesRef, "consultationNo");
        var consultationNo = await getDoc(consultationNoQ);
        if (!consultationNo.exists()) {
            await setDoc(consultationNoQ, { consultationNo: 1 });
        } else {
            await updateDoc(consultationNoQ, { consultationNo: increment(1) });
        }
        consultationNo = (await getDoc(consultationNoQ)).data().consultationNo;
        const creationDate = Date.now();
        const q = doc(dayQueueRef, nowDate);
        var res = await getDoc(q);
        if (!res.exists()) {
            await setDoc(q, { queueNumber: 1 });
        } else {
            await updateDoc(q, { queueNumber: increment(1) });
        }
        res = await getDoc(q);
        // Create a new queue document
        const queueRef = await addDoc(collection(dayQueueRef, nowDate, "queue"), {
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
        });
        const consultationLocRef = collection(db, "patients", patientId, "consultation");
        // Create a new consultation document
        const consultationRef = await addDoc(consultationLocRef, {
            consultationNo,
            queueId: queueRef.id,
            creationDate,
            consultation: "",
            frontDeskMessage: "",
            complains,
            items: [],
            grandTotal: 0,
        });
        // Update the queue document with the consultation id
        await updateDoc(doc(dayQueueRef, nowDate, "queue", queueRef.id), {
            consultationId: consultationRef.id,
        });
    }

    async function checkRepeatedIc(ic) {
        const q = query(collection(db, "patients"), where("ic", "==", ic));
        return (await getCountFromServer(q)).data().count === 0 ? false : true;
    }

    async function issueMc(patientId, doctorId, fromDate, toDate, remark) {
        await addDoc(collection(db, "mc"), {
            patientId,
            doctorId,
            fromDate,
            toDate,
            remark,
        });
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
        });
        return docRef.id;
    }

    async function updatePatientStatus(queueId, status) {
        const subCollectionRef = collection(
            dayQueueRef,
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            "queue"
        );
        const docRef = doc(subCollectionRef, queueId);
        await updateDoc(docRef, {
            status: status,
        });
    }

    async function getCurrentConsultation(patientId, queueId) {
        const subCollectionRef = collection(db, "patients", patientId, "consultation");
        const q = query(subCollectionRef, where("queueId", "==", queueId));
        const result = (await getDocs(q)).docs[0];
        return result;
    }

    async function getConsultationHistory(patientId) {
        const subCollectionRef = collection(db, "patients", patientId, "consultation");
        const q = query(subCollectionRef, orderBy("creationDate", "desc"));
        const result = (await getDocs(q)).docs.map((doc) => doc);
        return Object.values(result);
    }

    async function updateConsultation(patientId, consultationId, consultation, frontDeskMessage, items, grandTotal) {
        const docRef = doc(db, "patients", patientId, "consultation", consultationId);
        await updateDoc(docRef, {
            consultation: consultation,
            frontDeskMessage: frontDeskMessage,
            items: items,
            grandTotal: grandTotal,
        });
    }

    async function updateStock(itemList) {
        for (let item of itemList) {
            if (item.type !== "Treatment") {
                const docRef = doc(db, "inventory", item.id);
                await updateDoc(docRef, {
                    stock: increment(-item.quantity),
                });
            }
        }
    }

    async function makePayment(
        patientId,
        queueId,
        userId,
        doctorId,
        consultationId,
        remarks,
        payment,
        different,
        creationDate
    ) {
        const yearMonth = new Date(creationDate).getFullYear() + "-" + (new Date(creationDate).getMonth() + 1);
        const day = new Date(creationDate).getDate() + "";
        const collectionRef = collection(db, "payments", yearMonth, day);
        const docRef = await addDoc(collectionRef, {
            patientId,
            queueId,
            consultationId,
            remarks,
            payment,
            creationDate,
            personHandled: userId,
            doctorId,
        });
        const consultationRef = doc(db, "patients", patientId, "consultation", consultationId);
        await updateDoc(consultationRef, {
            paymentId: docRef.id,
        });
        const queueRef = doc(
            dayQueueRef,
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            "queue",
            queueId
        );
        await updateDoc(queueRef, {
            paymentId: docRef.id,
        });
        if (different !== 0) {
            const patientRef = doc(db, "patients", patientId);
            await updateDoc(patientRef, {
                balance: increment(different),
            });
        }
    }

    async function getPaymentDetails(paymentId, creationDate) {
        const yearMonth = new Date(creationDate).getFullYear() + "-" + (new Date(creationDate).getMonth() + 1);
        const day = new Date(creationDate).getDate() + "";
        const docRef = doc(db, "payments", yearMonth, day, paymentId);
        const docSnap = await getDoc(docRef);
        return docSnap;
    }

    async function addInventoryItem(name, type, unitPrice, stock, threshold) {
        try {
            if (type === "Treatment") {
                await addDoc(inventoryRef, { name, type, unitPrice });
            } else {
                await addDoc(inventoryRef, { name, type, unitPrice, stock, threshold });
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function editInventoryItem(id, name, type, unitPrice, stock, threshold) {
        try {
            await updateDoc(doc(db, "inventory", id), { name, type, unitPrice, stock, threshold });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function addEmployee(displayName, email, position, password) {
        try {
            let workingHours = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
            //await signupWithName(email, password, displayName)
            await addDoc(employeeRef, { displayName, email, position, workingHours });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    // For admin usage only. Should be the logged in user that changes the email not the admin
    // totally not because i realize i cannot change the email that is stored in the authentication
    // tab in firebase thru auth context lol
    async function editWorkingHours(id, workingHours) {
        try {
            await updateDoc(doc(db, "users", id), { workingHours });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    // write another function that allows users to edit their own email under profile page

    async function getAppointments(doctorId, start, end) {
        const apptCollnRef = collection(db, "users", doctorId, "appointments");
        // luckily there is no appts that go over 12 am, firebase does not allow
        // range query for multiple fields wtf... legit relational db is far superior but then $$$$$$
        const result = (
            await getDocs(query(apptCollnRef, where("startTime", ">=", start), where("startTime", "<", end)))
        ).docs.map((doc) => doc);
        return Object.values(result);
    }

    async function makeAppointment(doctorId, patientId, patientName, age, ic, gender, startTime, endTime, complaints) {
        const apptCollnRef = collection(db, "users", doctorId, "appointments");
        try {
            await addDoc(apptCollnRef, {
                patientId,
                patientName,
                age,
                ic,
                gender,
                startTime,
                endTime,
                complaints,
                status: "Appt made",
            });
            setAppointmentFlipFlop(!appointmentFlipFlop);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function updateApptDetails(doctorId, appointmentId, startTime, endTime, complaints) {
        const apptRef = doc(db, "users", doctorId, "appointments", appointmentId);
        try {
            await updateDoc(apptRef, { startTime, endTime, complaints });
            setAppointmentFlipFlop(!appointmentFlipFlop);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function updateApptStatus(doctorId, appointmentId, status) {
        const apptRef = doc(db, "users", doctorId, "appointments", appointmentId);
        try {
            await updateDoc(apptRef, { status });
            setAppointmentFlipFlop(!appointmentFlipFlop);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function updateCancelledApptRemark(doctorId, appointmentId, remark) {
        const apptRef = doc(db, "users", doctorId, "appointments", appointmentId);
        try {
            await updateDoc(apptRef, { remark });
            setAppointmentFlipFlop(!appointmentFlipFlop);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function setBusinessHours(details) {
        try {
            await updateDoc(doc(db, "commonvariables", "businessHours"), { details });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function deleteObject(docName, id) {
        try {
            await deleteDoc(doc(db, docName, id));
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const value = {
        date: date,
        availableDoctors: availableDoctors,
        allQueue: allQueue,
        waitingQueue: waitingQueue,
        inProgressQueue: inProgressQueue,
        pendingBillingQueue: pendingBillingQueue,
        completedQueue: completedQueue,
        inventory: inventory,
        medicineInventory: medicineInventory,
        treatmentInventory: treatmentInventory,
        otherInventory: otherInventory,
        waitingQueueSize: waitingQueueSize,
        employees: employees,
        appointments: appointments,
        commonVariables: commonVariables,
        appointmentFlipFlop: appointmentFlipFlop,
        transactions: transactions,
        search,
        addToQueue,
        checkRepeatedIc,
        registerNewPatient,
        updateStock,
        addInventoryItem,
        editInventoryItem,
        deleteObject,
        issueMc,
        updatePatientStatus,
        addEmployee,
        editWorkingHours,
        getCurrentConsultation,
        getConsultationHistory,
        updateConsultation,
        makePayment,
        getAppointments,
        makeAppointment,
        updateApptDetails,
        updateApptStatus,
        updateCancelledApptRemark,
        getPaymentDetails,
        setBusinessHours,
    };

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>;
}
