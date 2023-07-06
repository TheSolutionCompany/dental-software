import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import { useNavigate } from "react-router-dom"
import Select from "react-select"

const ConsultationForm = ({ patientId, queueId }) => {
    // Variables from DatabaseContext
    const { inventory } = useDatabase()

    // Functions from DatabaseContext
    const { getCurrentConsultation, updateConsultation, updatePatientStatus, updateStock } = useDatabase()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const [itemList, setItemList] = useState([])
    const [consultation, setConsultation] = useState("")
    const [frontDeskMessage, setFrontDeskMessage] = useState("")
    const [complains, setComplains] = useState("")

    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("")
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
            setConsultationId(res.id)
        })
    }, [])

    function handleSelectItem(e) {
        setItemId(e.id)
        setItemName(e.value)
        setUnitPrice(e.unitPrice)
        setQuantity(1)
    }

    function handleDeleteItem(e) {
        let index = e.target.parentNode.parentNode.rowIndex - 1
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
        setSaved(true)
    }

    async function handleSendForPayment(e) {
        e.preventDefault()
        await updateStock(itemList)
        await updatePatientStatus(queueId, "pending billing")
        navigate("/queue")
    }

    function generateTable(list) {
        return list.map((item, index) => (
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.subtotal}</td>
                <td>
                    <button type="button" onClick={handleDeleteItem}>
                        Delete
                    </button>
                </td>
            </tr>
        ))
    }

    useEffect(() => {
        setSubtotal(unitPrice * quantity)
    }, [unitPrice, quantity])

    function handleAddItem(e) {
        e.preventDefault()
        let item = {
            id: itemId,
            name: itemName,
            unitPrice: unitPrice,
            quantity: quantity,
            subtotal: unitPrice * quantity,
        }
        setItemName("")
        setUnitPrice(0)
        setQuantity(0)
        setSubtotal(0)
        setItemList([...itemList, item])
        setGrandTotal(grandTotal + item.subtotal)
    }

    return (
        <div className="flex flex-row">
            <div className="w-[50%] pr-4">
                <form className="flex flex-col" onSubmit={handleSave}>
                    <div className="flex flex-row pb-4">
                        <div className="flex flex-col w-full pr-2">
                            <label>Complains</label>
                            <textarea rows={6} value={complains} readOnly></textarea>
                        </div>
                        <div className="flex flex-col w-full pl-2">
                            <label>Frontdesk Message</label>
                            <textarea
                                rows={6}
                                defaultValue={frontDeskMessage}
                                onChange={(e) => setFrontDeskMessage(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <label>Consultation</label>
                    <textarea
                        rows={20}
                        value={consultation}
                        onChange={(e) => setConsultation(e.target.value)}
                    ></textarea>
                    <button type="submit" disabled={loading} hidden={saved}>
                        Save
                    </button>
                    <button type="button" hidden={!saved} onClick={handleSendForPayment}>
                        Send for payment
                    </button>
                </form>
            </div>
            <div className="w-[50%] pl-4">
                <form className="flex flex-row pb-8" id="addItemForm" onSubmit={handleAddItem}>
                    <div className="flex flex-col w-full">
                        <label>Name</label>
                        <Select
                            options={inventory.map((res) => {
                                return {
                                    value: res.data().name,
                                    label: res.data().name,
                                    unitPrice: res.data().unitPrice,
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
                            //unstyled
                            required
                        />
                    </div>
                    <div className="flex flex-col w-32">
                        <label>Unit price</label>
                        <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                    </div>
                    <div className="flex flex-col w-32">
                        <label>Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="flex flex-col w-32">
                        <label>Subtotal</label>
                        <input type="number" value={subtotal} readOnly />
                    </div>
                    <button type="submit">Add</button>
                </form>
                <table className="table-gray">
                    <thead>
                        <tr>
                            <th>Treatment/Medicine/Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>{generateTable(itemList)}</tbody>
                </table>
            </div>
        </div>
    )
}

export default ConsultationForm
