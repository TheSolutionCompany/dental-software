import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"

const ConsultationForm = ({patientId, queueId}) => {
    // Functions from DatabaseContext
    const { getCurrentConsultation, updateConsultation } = useDatabase()

    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const [itemList, setItemList] = useState([])
    const [consultation, setConsultation] = useState("")
    const [frontDeskMessage, setFrontDeskMessage] = useState("")
    const [complains, setComplains] = useState("")

    const [itemName, setItemName] = useState("")
    const [unitPrice, setUnitPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
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

    async function handleSave(e) {
        e.preventDefault()
        setLoading(true)
        await updateConsultation(patientId, consultationId, consultation, frontDeskMessage, itemList)
        setLoading(false)
        setSaved(true)
    }

    function generateTable(list) {
        return list.map((item, index) => (
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.totalPrice}</td>
            </tr>
        ))
    }

    useEffect(() => {
        setTotalPrice(unitPrice * quantity)
    }, [unitPrice, quantity])

    function handleAddItem(e) {
        e.preventDefault()
        let item = {
            name: itemName,
            unitPrice: unitPrice,
            quantity: quantity,
            totalPrice: unitPrice * quantity,
        }
        setItemName("")
        setUnitPrice(0)
        setQuantity(0)
        setTotalPrice(0)
        setItemList([...itemList, item])
        setGrandTotal(grandTotal + item.totalPrice)
    }

    return (
        <div>
            <form id="addItemForm" onSubmit={handleAddItem}>
                <label>name</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                <label>unitPrice</label>
                <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                <label>quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <label>totalPrice</label>
                <input type="number" value={totalPrice} readOnly />
                <button type="submit">Add</button>
            </form>
            <form onSubmit={handleSave}>
                <label>Complains</label>
                <textarea rows={4} value={complains} readOnly></textarea>
                <label>Consultation</label>
                <textarea rows={10} value={consultation} onChange={(e) => setConsultation(e.target.value)}></textarea>
                <label>Frontdesk Message</label>
                <textarea rows={5} defaultValue={frontDeskMessage} onChange={(e) => setFrontDeskMessage(e.target.value)}></textarea>
                <table>
                    <tr>
                        <th>Treatment/Medicine/Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </table>
                <table>{generateTable(itemList)}</table>
                <button type="submit" disabled={loading} hidden={saved}>Save</button>
                <button type="button" hidden={!saved}>Send for payment</button>
            </form>
        </div>
    )
}

export default ConsultationForm
