import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { useDatabase } from "../contexts/DatabaseContext"
import InventoryForm from "../components/InventoryForm"
import DeleteConfirmation from "../components/DeleteConfirmation"

const Inventory = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const { inventory } = useDatabase()

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    function generateRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) =>
        (<tr key={inventoryRow.id}>
            <td>{inventoryRow.data().name}</td>
            <td>{inventoryRow.data().unitPrice}</td>
            <td>{inventoryRow.data().type}</td>
            <td>{inventoryRow.data().stock}</td>
            <td><InventoryForm data={{ editMode: true, activeItem: { id: inventoryRow.id, ...inventoryRow.data() } }} /></td>
            <td><DeleteConfirmation docName={"inventory"}
                activeItem={{ id: inventoryRow.id, ...inventoryRow.data() }}
            /></td>
        </tr>))
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Inventory</p>
                    <span>
                        <InventoryForm data={{ editMode: false, activeItem: null }} />
                    </span>
                    <br></br>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit Price(RM)</th>
                                <th>Type</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateRows(inventory)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Inventory