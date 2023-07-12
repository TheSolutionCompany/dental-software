import React, { useEffect, useRef, useState } from "react"
import Modal from "react-modal"
import { useReactToPrint } from "react-to-print"
import { useDatabase } from "../contexts/DatabaseContext"
import CloseButton from "./CloseButton"

Modal.setAppElement("#root")

const InvoiceForm = ({ queueId, patientId, patientName, paymentId, doctorId }) => {
    // Variables in DatabaseContext
    const { availableDoctors, date } = useDatabase()

    // Functions in DatabaseContext
    const { getPaymentDetails, getCurrentConsultation } = useDatabase()

    const [doctor, setDoctor] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [itemList, setItemList] = useState([])
    const [paymentDetails, setPaymentDetails] = useState([])
    const toPrintRef = useRef()

    useEffect(() => {
        setDoctor(availableDoctors.find((item) => item.id === doctorId).data().name)
        getPaymentDetails(paymentId).then((result) => {
            setPaymentDetails(result.payment)
        })
        getCurrentConsultation(patientId, queueId).then((result) => {
            setItemList(result.data().items)
        })
    }, [])

    function toggleModal() {
        setIsOpen(!isOpen)
    }

    const handlePrint = useReactToPrint({
        content: () => toPrintRef.current,
        documentTitle: { patientName },
    })

    return (
        <div>
            <button className="hover:text-green-500">
                <div onClick={toggleModal}>
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
                            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                        />
                    </svg>
                </div>
            </button>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Invoice"
                shouldCloseOnOverlayClick={false}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                    },
                    content: {
                        position: "absolute",
                        top: "50px",
                        left: "300px",
                        right: "300px",
                        bottom: "50px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "4px",
                        outline: "none",
                        padding: "20px",
                    },
                }}
            >
                <CloseButton name="Receipt Preview" func={toggleModal} />
                <form className="border border-black p-5">
                    <div ref={toPrintRef}>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-align-center font-bold">Receipt</p>
                            <br />
                            <p className="text-align-center font-bold">Klinik Pergigian Sunlightdental</p>
                            <p className="text-align-center">No. 87 (GF), Jalan Anggerik Emas 1.</p>
                            <p className="text-align-center">Taman Anggerik Emas,</p>
                            <p className="text-align-center">81200 Johor Bahru</p>
                            <p className="text-align-center">019-9468987</p>
                        </div>
                        <br />
                        <div className="flex flex-col">
                            <div>Date: {date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}</div>
                            <div>Receipt no:</div>
                            <div>Treatment no:</div>
                            <div>Doctor: {doctor}</div>
                            <div>Collected by: {}</div>
                        </div>
                        <br />
                        <p className="font-bold">{patientName}</p>
                        <br />
                        <br />
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-align-center">
                                ----------Printed:{" "}
                                {date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}----------
                            </p>
                            <p className="text-align-center">Thank you</p>
                        </div>
                    </div>
                </form>
                <br />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button
                        style={{
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            border: "1px solid black",
                            backgroundColor: "lightgray",
                            width: "100px",
                            height: "30px",
                        }}
                        onClick={handlePrint}
                    >
                        Print
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default InvoiceForm
