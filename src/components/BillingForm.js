import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

const BillingForm = ({ queueId, patientId, patientName }) => {
    // Functions in DatabaseContext
    const { getCurrentConsultation, makePayment, updatePatientStatus } = useDatabase()

    const [isOpen, setIsOpen] = useState(false)

    const [itemList, setItemList] = useState([])
    const [grandTotal, setGrandTotal] = useState(0)
    const [frontDeskMessage, setFrontDeskMessage] = useState("")

    const [remarks, setRemarks] = useState("")
    const [consultationId, setConsultationId] = useState("")
    const [paymentMethod1, setPaymentMethod1] = useState("")
    const [paymentMethod2, setPaymentMethod2] = useState("")
    const [paymentMethod3, setPaymentMethod3] = useState("")
    const [paymentMethod4, setPaymentMethod4] = useState("")
    const [paymentAmount1, setPaymentAmount1] = useState(0)
    const [paymentAmount2, setPaymentAmount2] = useState(0)
    const [paymentAmount3, setPaymentAmount3] = useState(0)
    const [paymentAmount4, setPaymentAmount4] = useState(0)

    function toggleModal() {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        getCurrentConsultation(patientId, queueId).then((result) => {
            setItemList(result.data().items)
            setGrandTotal(result.data().grandTotal)
            setFrontDeskMessage(result.data().frontDeskMessage)
            setConsultationId(result.id)
        })
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        let payment = [{
            method: paymentMethod1,
            amount: paymentAmount1
        }, {
            method: paymentMethod2,
            amount: paymentAmount2
        }, {
            method: paymentMethod3,
            amount: paymentAmount3
        }, {
            method: paymentMethod4,
            amount: paymentAmount4
        }]
        let total = paymentAmount1 + paymentAmount2 + paymentAmount3 + paymentAmount4
        let different = total - grandTotal
        console.log(total + " " + grandTotal + " " + different)
        await makePayment(patientId, queueId, consultationId, remarks, payment, different)
        await updatePatientStatus(queueId, "completed")
        toggleModal()
        toast.success("Payment done", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
        toast.clearWaitingQueue()
    }

    return (
        <div>
            <button type="button" className="hover:text-green-500" onClick={toggleModal}>
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
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                </svg>
            </button>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} shouldCloseOnOverlayClick={false}>
                <CloseButton name="Payment Summary" func={toggleModal} />
                <div className="flex flex-row">
                    <div className="flex flex-col w-1/2 p-2">
                        <p>
                            Patient name: <b>{patientName}</b>
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label>Remark</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-md"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                            <div className="flex flex-row">
                                <label>Payment method 1</label>
                                <select
                                    className="border border-gray-300 rounded-md"
                                    value={paymentMethod1}
                                    onChange={(e) => setPaymentMethod1(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="Cheque">Debit Card</option>
                                    <option value="Cheque">QR Pay</option>
                                </select>
                                <label>Payment amount 1</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md"
                                    value={paymentAmount1}
                                    onChange={(e) => setPaymentAmount1(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-row">
                                <label>Payment method 2</label>
                                <select
                                    className="border border-gray-300 rounded-md"
                                    value={paymentMethod2}
                                    onChange={(e) => setPaymentMethod2(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="Cheque">Debit Card</option>
                                    <option value="Cheque">QR Pay</option>
                                </select>
                                <label>Payment amount 2</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md"
                                    value={paymentAmount2}
                                    onChange={(e) => setPaymentAmount2(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-row">
                                <label>Payment method 3</label>
                                <select
                                    className="border border-gray-300 rounded-md"
                                    value={paymentMethod3}
                                    onChange={(e) => setPaymentMethod3(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="Cheque">Debit Card</option>
                                    <option value="Cheque">QR Pay</option>
                                </select>
                                <label>Payment amount 3</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md"
                                    value={paymentAmount3}
                                    onChange={(e) => setPaymentAmount3(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-row">
                                <label>Payment method 4</label>
                                <select
                                    className="border border-gray-300 rounded-md"
                                    value={paymentMethod4}
                                    onChange={(e) => setPaymentMethod4(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="Cheque">Debit Card</option>
                                    <option value="Cheque">QR Pay</option>
                                </select>
                                <label>Payment amount 4</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md"
                                    value={paymentAmount4}
                                    onChange={(e) => setPaymentAmount4(e.target.value)}
                                />
                            </div>
                            <button type="submit"> Submit </button>
                        </form>
                    </div>
                    <div className="flex flex-col w-1/2 p-2">
                        <label>Front desk message</label>
                        <textarea
                            className="border border-gray-300 rounded-md mb-4"
                            rows={6}
                            value={frontDeskMessage}
                            readOnly
                        />
                        <label>Treatment details</label>
                        <div className="overflow-auto h-[50vh]">
                            <table className="table-gray">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemList.map((item) => (
                                        <tr>
                                            <td className="pl-2">{item.name}</td>
                                            <td className="text-right pr-2">{item.quantity}</td>
                                            <td className="text-right pr-2">{item.subtotal}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="pl-2" colSpan="2">
                                            Grand total
                                        </td>
                                        <td className="text-right pr-2">{grandTotal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default BillingForm
