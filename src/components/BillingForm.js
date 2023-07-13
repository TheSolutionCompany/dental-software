import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

const BillingForm = ({ queueId, patientId, patientName }) => {
    // Variables in AuthContext
    const { user } = useAuth()

    // Functions in DatabaseContext
    const { getCurrentConsultation, makePayment, updatePatientStatus } = useDatabase()

    const [isOpen, setIsOpen] = useState(false)

    const [itemList, setItemList] = useState([])
    const [grandTotal, setGrandTotal] = useState(0)
    const [frontDeskMessage, setFrontDeskMessage] = useState("")
    const [creationDate, setCreationDate] = useState("")
    const [consultationId, setConsultationId] = useState("")

    const [remarks, setRemarks] = useState("")
    const [paymentMethod, setPaymentMethod] = useState([{
        method: "",
        amount: 0   
    }])    
    const [warnShowPaymentLimit, setWarnShowPaymentLimit] = useState(false)
    function toggleModal() {
        setIsOpen(!isOpen)
    }

    const handleAddPaymentMethod = (index) => {
        //limit the number of payment method to 4
        //if the minus button is clicked, remove the current payment method
        
        if (index !== 0) {
            let newPaymentMethod = [...paymentMethod]
            newPaymentMethod.splice(index, 1)
            setPaymentMethod(newPaymentMethod)
            setWarnShowPaymentLimit(false)
            console.log(paymentMethod)
            return
        }
        if (paymentMethod.length >= 4) {
            setWarnShowPaymentLimit(true)
            return
        }
        //if the last payment method is not empty, add new payment method
        setPaymentMethod([...paymentMethod, { method: "", amount: 0 }])
        console.log(paymentMethod)
    }

    useEffect(() => {
        getCurrentConsultation(patientId, queueId).then((result) => {
            setCreationDate(result.data().creationDate)
            setItemList(result.data().items)
            setGrandTotal(result.data().grandTotal)
            setFrontDeskMessage(result.data().frontDeskMessage)
            setConsultationId(result.id)
        })
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        let payment = []
        //filter out the empty payment method
        paymentMethod.map((item) => {
            if (item.method !== "" && item.amount !== 0) {
                payment.push(item)
            }

        })
        let total = payment.map((item) => parseInt(item.amount)).reduce((a, b) => a + b, 0)
        let different = total - grandTotal
        await makePayment(patientId, queueId, user.displayName, consultationId, remarks, payment, different, creationDate)
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
            <button type="button" className="hover:text-blue-500" onClick={toggleModal}>
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
                        <p className="border border-black p-2 w-fit mb-4">
                            Patient name: <br></br> <b>{patientName}</b>
                        </p>
                        <form>
                            {paymentMethod.map((item, index) => {
                                return (
                                    <div className="flex">
                                        <div className="flex flex-col pr-4">
                                            <label>Payment method {index + 1}</label>
                                            <select
                                                className="border border-gray-500 rounded-md h-10"
                                                value={paymentMethod[index].method}
                                                onChange={
                                                    (e) => {
                                                        let newPaymentMethod = [...paymentMethod]
                                                        newPaymentMethod[index].method = e.target.value
                                                        setPaymentMethod(newPaymentMethod)
                                                    }
                                                }
                                            >
                                                <option value=""></option>
                                                <option value="Cash">Cash</option>
                                                <option value="Card">Credit Card</option>
                                                <option value="Cheque">Debit Card</option>
                                                <option value="QRPay">QR Pay</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col ">

                                            <label>Amount</label>
                                            <input
                                                type="number"
                                                className="border border-gray-500 rounded-md"
                                                value={paymentMethod[index].amount}
                                                onChange={
                                                    (e) => {
                                                        let newPaymentMethod = [...paymentMethod]
                                                        newPaymentMethod[index].amount = e.target.value
                                                        setPaymentMethod(newPaymentMethod)
                                                    }
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end pl-2">
                                            {index === 0 ?
                                            // Add button
                                            <button
                                            title="Add payment method"
                                            type="button"
                                                onClick={ () => handleAddPaymentMethod(index) }
                                                className="flex items-center justify-center rounded-full w-10 h-10 bg-green-500 font-bold text-2xl text-center" >
                                                
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                            : 
                                            // Minus button
                                            <button
                                            type="button"
                                            title="Remove payment method"
                                                onClick={ () => handleAddPaymentMethod(index) }
                                                className="flex items-center justify-center rounded-full w-10 h-10 bg-red-500 font-bold text-2xl text-center" >
                                                
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                                </svg>

                                            </button>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                            }
                            {
                                warnShowPaymentLimit && <p className="text-red-500">You have reached the maximum number of payment method</p>
                            }
                            <div className="flex flex-col my-4">

                                <label>Remark</label>
                                <textarea
                                    rows={4}
                                    type="text"
                                    className="border border-gray-500 rounded-md"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                            <button className="button-green" onClick={handleSubmit}> Submit </button>
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
                                            <td className="text-left pl-2">{item.name}</td>
                                            <td className="text-right pr-2">{item.quantity}</td>
                                            <td className="text-right pr-2">{Number(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="pl-2" colSpan="2">
                                            Grand total
                                        </td>
                                        <td className="text-right pr-2">{Number(grandTotal).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    )
}

export default BillingForm
