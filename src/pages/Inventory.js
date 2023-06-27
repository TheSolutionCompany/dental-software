import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useDatabase } from "../contexts/DatabaseContext";
import InventoryForm from "../components/InventoryForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import AddStockForm from "../components/AddStockForm";

const Inventory = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { medicineInventory, treatmentInventory, otherInventory } =
        useDatabase();

    async function handleLogout() {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    // From jq: since we will explicitly tell users to restock stuff in the dashboard, i dont think i will display
    // the restock threshold here. instead, once the threshold is reached we can display the row in red.
    function generateProductRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) => (
            <tr
                key={inventoryRow.id}
                className={`table-tr-tbody-gray ${
                    inventoryRow.data().stock <= inventoryRow.data().threshold
                        ? "text-red-600"
                        : ""
                }`}
            >
                <td className="table-td-gray">{inventoryRow.data().name}</td>
                <td className="table-td-gray">{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
                <td className="table-td-gray">{inventoryRow.data().stock}</td>
                <td className="table-td-gray">
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
                <td className="table-td-gray">
                    <DeleteConfirmation
                        docName={"inventory"}
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
                <td className="table-td-gray">
                    <AddStockForm
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
            </tr>
        ));
    }

    function generateTreatmentRows(inventoryTable) {
        return inventoryTable.map((inventoryRow) => (
            <tr className="table-tr-tbody-gray" key={inventoryRow.id}>
                <td className="table-td-gray">{inventoryRow.data().name}</td>
                <td className="table-td-gray">{Number(inventoryRow.data().unitPrice).toFixed(2)}</td>
                <td className="table-td-gray">
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
                <td className="table-td-gray">
                    <DeleteConfirmation
                        docName={"inventory"}
                        activeItem={{
                            id: inventoryRow.id,
                            ...inventoryRow.data(),
                        }}
                    />
                </td>
            </tr>
        ));
    }

    // From jq: i will leave it as three tables in one page for now. general styling wise: i think putting three tables next to each other
    // is the neatest. i really do not think we need a separate page for this...?
    return (
        <div className="flex flex-col h-full">
            <Header
                className="z-50"
                currentPage={"Inventory"}
                handleLogout={handleLogout}
            />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full h-[92vh] bg-gray-200 overflow-scroll">
                    <span>
                        <InventoryForm
                            data={{ editMode: false, activeItem: null }}
                        />
                    </span>
                    <br></br>
                    <div className="flex flex-col py-2 px-8">
                        <h1>Medicine Inventory</h1>
                        <table className="table-gray">
                            <thead>
                                <tr className="table-tr-thead-gray">
                                    <th className="table-th-gray">Name</th>
                                    <th className="table-th-gray">Unit Price(RM)</th>
                                    <th className="table-th-gray">Stock</th>
                                    {/* <th className="table-th-gray"></th>
                                    <th className="table-th-gray"></th>
                                    <th className="table-th-gray"></th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {generateProductRows(medicineInventory)}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col py-2 px-8">
                        <h1>Non-medicine Product Inventory</h1>
                        <table className="table-gray">
                            <thead>
                                <tr className="table-tr-gray">
                                    <th className="table-th-gray">Name</th>
                                    <th className="table-th-gray">
                                        Unit Price(RM)
                                    </th>
                                    <th className="table-th-gray">Stock</th>
                                </tr>
                            </thead>
                            <tbody>{generateProductRows(otherInventory)}</tbody>
                        </table>
                    </div>

                    <div className="flex flex-col py-2 px-8">
                        <h1>Treatment Inventory</h1>
                        <table className="table-gray mx-2">
                            <thead>
                                <tr className="table-tr-gray">
                                    <th className="table-th-gray">Name</th>
                                    <th className="table-th-gray">
                                        Unit Price(RM)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateTreatmentRows(treatmentInventory)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
