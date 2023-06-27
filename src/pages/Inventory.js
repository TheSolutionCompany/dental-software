import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { useDatabase } from "../contexts/DatabaseContext"
import InventoryForm from "../components/InventoryForm"
import DeleteConfirmation from "../components/DeleteConfirmation"
import AddStockForm from "../components/AddStockForm"

const Inventory = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const { medicineInventory, treatmentInventory, otherInventory } = useDatabase()


    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    // From jq: since we will explicitly tell users to restock stuff in the dashboard, i dont think i will display
    // the restock threshold here. instead, once the threshold is reached we can display the row in red.
    function generateProductRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) =>
        (<tr key={inventoryRow.id}>
            <td>{inventoryRow.data().name}</td>
            <td>{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
            <td>{inventoryRow.data().stock}</td>
            <td><InventoryForm data={{ editMode: true, activeItem: { id: inventoryRow.id, ...inventoryRow.data() } }} /></td>
            <td><DeleteConfirmation docName={"inventory"}
                activeItem={{ id: inventoryRow.id, ...inventoryRow.data() }}
            /></td>
            <td><AddStockForm activeItem={{ id: inventoryRow.id, ...inventoryRow.data() }}/></td>
        </tr>))
    }

    function generateTreatmentRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) => 
        (<tr key={inventoryRow.id}>
            <td>{inventoryRow.data().name}</td>
            <td>{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
            <td><InventoryForm data={{ editMode: true, activeItem: { id: inventoryRow.id, ...inventoryRow.data() } }} /></td>
            <td><DeleteConfirmation docName={"inventory"}
                activeItem={{ id: inventoryRow.id, ...inventoryRow.data() }}
            /></td>
        </tr>))
    }

    // From jq: i will leave it as three tables in one page for now. general styling wise: i think putting three tables next to each other
    // is the neatest. i really do not think we need a separate page for this...?
    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Inventory"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Inventory</p>
                    <span>
                        <InventoryForm data={{ editMode: false, activeItem: null }} />
                    </span>
                    <br></br>
                    <h1>Medicine Inventory</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit Price(RM)</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateProductRows(medicineInventory)}
                        </tbody>
                    </table>

                    <h1>Non-medicine Product Inventory</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit Price(RM)</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateProductRows(otherInventory)}
                        </tbody>
                    </table>

                    <h1>Treatment Inventory</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit Price(RM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateTreatmentRows(treatmentInventory)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Inventory