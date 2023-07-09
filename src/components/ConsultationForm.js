import React, { useEffect, useState, useRef } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ConsultationForm = ({ patientId, queueId, setRequireUpdate }) => {
    // Variables from DatabaseContext
    const { inventory } = useDatabase()

    // Functions from DatabaseContext
    const { getCurrentConsultation, updateConsultation, updatePatientStatus, updateStock } = useDatabase()

    const navigate = useNavigate()

    const selectRef = useRef(null)

    const [loading, setLoading] = useState(false)
    const [edited, setEdited] = useState(false)

    const [itemList, setItemList] = useState([])
    const [consultation, setConsultation] = useState("")
    const [frontDeskMessage, setFrontDeskMessage] = useState("")
    const [complains, setComplains] = useState("")

    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("")
    const [itemType, setItemType] = useState("")
    const [unitPrice, setUnitPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)

    const [consultationId, setConsultationId] = useState("")

    useEffect(() => {
        getCurrentConsultation(patientId, queueId).then((res) => {
            setConsultation(res.data().consultation)
            setFrontDeskMessage(res.data().frontDeskMessage)
            setComplains(res.data().complains)
            setItemList(res.data().items)
            setGrandTotal(res.data().grandTotal)
            setConsultationId(res.id)
        })
    }, [])

    useEffect(() => {
        setEdited(true)
    }, [itemList, consultation, frontDeskMessage])

    useEffect(() => {
        setSubtotal(parseInt(unitPrice) * parseInt(quantity))
    }, [unitPrice, quantity])

    function handleSelectItem(e) {
        document.getElementById("quantity").disabled = false
        document.getElementById("unitPrice").disabled = false
        setItemId(e.id)
        setItemName(e.value)
        setUnitPrice(e.unitPrice)
        setItemType(e.type)
        setQuantity(1)
        if (e.type === "Treatment") {
            document.getElementById("quantity").disabled = true
        }
    }

    function handleAddItem(e) {
        e.preventDefault()
        let item
        if (itemType === "Treatment") {
            item = {
                id: itemId,
                name: itemName,
                type: itemType,
                unitPrice: unitPrice,
                subtotal: subtotal,
            }
        } else {
            item = {
                id: itemId,
                name: itemName,
                type: itemType,
                unitPrice: unitPrice,
                quantity: quantity,
                subtotal: subtotal,
            }
        }
        selectRef.current.setValue("")
        setItemId("")
        setItemName("")
        setItemType("")
        setUnitPrice(0)
        setQuantity(0)
        setSubtotal(0)
        setItemList([...itemList, item])
        setGrandTotal(grandTotal + item.subtotal)
        document.getElementById("quantity").disabled = true
        document.getElementById("unitPrice").disabled = true
    }

    function handleDeleteItem(index) {
        console.log(index)
        let item = itemList[index]
        console.log(item)
        setItemList(itemList.filter((i) => i !== item))
        setGrandTotal(grandTotal - item.subtotal)
    }

    async function handleSave(e) {
        e.preventDefault()
        setLoading(true)
        await updateConsultation(patientId, consultationId, consultation, frontDeskMessage, itemList, grandTotal)
        setLoading(false)
        setEdited(false)
        setRequireUpdate(true)
        toast.success("Consultation updated", {
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

    async function handleSendForPayment(e) {
        e.preventDefault()
        setLoading(true)
        await updateStock(itemList)
        await updatePatientStatus(queueId, "pending billing")
        toast.success("Sent for payment", {
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
        navigate("/queue")
        setLoading(false)
    }

    function generateTable(list) {
        return list.map((item, index) => (
            <tr key={index} className={`${item.quantity > inventory.filter((i) => i.id === item.id)[0].data().stock ? "text-red-500" : ""}`}>
                <td>{item.name}</td>
                <td className="text-right px-2">{item.unitPrice}</td>
                <td className="text-right px-2">
                    {item.quantity} / {inventory.filter((i) => i.id === item.id)[0].data().stock}
                </td>
                <td className="text-right px-2">{item.subtotal}</td>
                <td>
                    <button type="button" className="hover:text-red-500" onClick={() => handleDeleteItem(index)}>
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                </td>
            </tr>
        ))
    }

    return (
        <div className="flex px-8 h-4/5">
            <div className="w-1/2 pr-4">
                <form className="flex flex-col" onSubmit={handleSave}>
                    <div className="flex pb-4">
                        <div className="flex flex-col w-full pr-2">
                            <label>Complains</label>
                            <textarea 
                                rows={10} 
                                value={complains} 
                                readOnly></textarea>
                        </div>
                        <div className="flex flex-col w-full pl-2">
                            <label>Frontdesk Message</label>
                            <textarea
                                rows={10}
                                defaultValue={frontDeskMessage}
                                onChange={(e) => setFrontDeskMessage(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <label>Consultation</label>
                    <textarea
                        rows={12}
                        value={consultation}
                        onChange={(e) => setConsultation(e.target.value)}
                    >
                    </textarea>
                    <div className="p-4">
                        <button className="button-green" type="submit" disabled={loading} hidden={!edited}>
                            Save
                        </button>
                        <button className="button-green" type="button" disabled={loading} hidden={edited} onClick={handleSendForPayment}>
                            Send for payment
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-1/2 pl-4">
                <form className="flex pb-8" id="addItemForm" onSubmit={handleAddItem}>
                    <div className="flex flex-col w-full">
                        <label>Name</label>
                        <Select
                            ref={selectRef}
                            options={inventory.map((res) => {
                                return {
                                    value: res.data().name,
                                    label: res.data().name,
                                    unitPrice: res.data().unitPrice,
                                    type: res.data().type,
                                    id: res.id,
                                }
                            })}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: "42px",
                                }),
                            }}
                            onChange={(e) => {
                                handleSelectItem(e)
                            }}
                            required
                        />
                    </div>
                    <div className="flex flex-col w-28">
                        <label>Unit price</label>
                        <input
                            id="unitPrice"
                            type="number"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col w-28">
                        <label>Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col w-28">
                        <label>Subtotal</label>
                        <input type="number" value={subtotal} readOnly />
                    </div>
                    <button type="submit" className="border border-black mt-6 px-7">
                        Add
                    </button>
                </form>
                <div className="flex flex-col w-full h-3/5 overflow-auto">
                    <table className="table-gray">
                        <thead>
                            <tr>
                                <th className="w-[47%]">Treatment/Medicine/Product</th>
                                <th className="w-[14%]">Unit Price</th>
                                <th className="w-[14%]">Quantity</th>
                                <th className="w-[14%]">Subtotal</th>
                                <th className="w-[11%]">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateTable(itemList)}
                        </tbody>
                    </table>
                </div>
                <div className="text-2xl pt-4 flex flex-col items-start">
                    <div>Grand Total: </div>
                    <div className="text-right">
                        {grandTotal}
                    </div>
                </div>
            </div>
            <ToastContainer limit={1}/>
        </div>
    )
}

export default ConsultationForm
