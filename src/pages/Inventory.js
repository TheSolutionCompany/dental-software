import React, { useState } from "react"
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

    const [filter, setFilter] = useState("medicine")

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
        return inventoryTable.map((inventoryRow) => (
            <tr
                key={inventoryRow.id}
                className={`${inventoryRow.data().stock <= inventoryRow.data().threshold ? "text-red-600" : ""
                    }`}
            >
                <td className="w-[35%] text-left px-2">{inventoryRow.data().name}</td>
                <td className="w-[20%] text-right px-2">{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
                <td className="w-[15%] text-right px-2">{inventoryRow.data().stock}</td>
                <td className="w-[10%]">
                    <AddStockForm
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
                <td className="w-[10%]">
                    <InventoryForm
                        data={{
                            editMode: true,
                            activeItem: {
                                id: inventoryRow.id,
                                ...inventoryRow.data(),
                            },
                        }}
                    />
                </td>
                <td className="w-[10%]">
                    <DeleteConfirmation
                        docName={"inventory"}
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
            </tr>
        ))
    }

    function generateTreatmentRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) => (
            <tr className="" key={inventoryRow.id}>
                <td className="w-[35%]">{inventoryRow.data().name}</td>
                <td className="w-[20%]">{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
                <td className="w-[15%]">N/A</td>
                <td className="w-[10%]">N/A</td>
                <td className="w-[10%]">
                    <InventoryForm
                        data={{
                            editMode: true,
                            activeItem: {
                                id: inventoryRow.id,
                                ...inventoryRow.data(),
                            },
                        }}
                    />
                </td>
                <td className="w-[10%]">
                    <DeleteConfirmation
                        docName={"inventory"}
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
            </tr>
        ))
    }

    // From jq: i will leave it as three tables in one page for now. general styling wise: i think putting three tables next to each other
    // is the neatest. i really do not think we need a separate page for this...?
    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Inventory"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full h-full bg-gray-200">
                    <div className="p-8">
                        <div className="flex justify-start py-4">

                            <button className="border-black p-2 hover:bg-gray-300 border-2" onClick={(e) => setFilter("medicine")}>Medicine</button>
                            <button className="border-black p-2 hover:bg-gray-300 border-y-2" onClick={(e) => setFilter("product")}>Non-medicine Product</button>
                            <button className="border-black p-2 hover:bg-gray-300 border-2" onClick={(e) => setFilter("treatment")}>Treatment</button>
                            <InventoryForm data={{ editMode: false, activeItem: null }} />
                        </div>
                        <div className="flex flex-col w-full h-[77vh] border-black overflow-auto">
                            <table className="table-gray">
                                <thead>
                                    <tr>
                                        <th className="w-[35%]">Name</th>
                                        <th className="w-[20%]">Unit Price(RM)</th>
                                        <th className="w-[15%]">Stock</th>
                                        <th className="w-[10%]">Add Stock</th>
                                        <th className="w-[10%]">Edit Item</th>
                                        <th className="w-[10%]">Delete Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filter === "medicine" && generateProductRows(medicineInventory)}
                                    {filter === "product" && generateProductRows(otherInventory)}
                                    {filter === "treatment" && generateTreatmentRows(treatmentInventory)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Inventory
