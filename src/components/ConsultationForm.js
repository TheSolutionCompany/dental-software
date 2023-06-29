import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"

const ConsultationForm = () => {
    // Functions from DatabaseContext
    const { addConsultation } = useDatabase()

    const [tableList, setTableList] = useState([])
    const [consultation, setConsultation] = useState("")
    const [frontDeskMessage, setFrontDeskMessage] = useState("")
    const [grandTotal, setGrandTotal] = useState(0)

    const [itemName, setItemName] = useState("")
    const [unitPrice, setUnitPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    async function handleSubmit(e) {
        e.preventDefault()
        await addConsultation(consultation, frontDeskMessage, tableList, grandTotal)
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
        setTableList([...tableList, item])
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
            <form onSubmit={handleSubmit}>
                <label>Consultation</label>
                <textarea rows={10} onChange={(e) => setConsultation(e.target.value)}></textarea>
                <label>Frontdesk Message</label>
                <textarea rows={5} onChange={(e) => setFrontDeskMessage(e.target.value)}></textarea>
                <table>
                    <tr>
                        <th>Treatment/Medicine/Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </table>
                <table>{generateTable(tableList)}</table>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default ConsultationForm
