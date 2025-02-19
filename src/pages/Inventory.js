import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useDatabase } from "../contexts/DatabaseContext";
import InventoryForm from "../components/InventoryForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import AddStockForm from "../components/AddStockForm";
import { Icon } from "react-icons-kit";
import { sort } from "react-icons-kit/fa/sort";

const Inventory = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [filter, setFilter] = useState("medicine");

    const { medicineInventory, treatmentInventory, otherInventory } = useDatabase();

    const [search, setSearch] = useState("");

    const [order, setOrder] = useState("DSC");
    const [currSort, setCurrSort] = useState("name");
    const [col, setCol] = useState("name");
    const [sortByLowStock, setSortByLowStock] = useState(false);
    const [inv, setInv] = useState([medicineInventory]);

    useEffect(() => {
        if (filter === "medicine") {
            setInv([
                medicineInventory.sort((a, b) =>
                    a.data().name.toLocaleLowerCase() > b.data().name.toLocaleLowerCase() ? 1 : -1
                ),
            ]);
        } else if (filter === "product") {
            setInv([otherInventory.sort((a, b) => (a.data().unitPrice > b.data().unitPrice ? 1 : -1))]);
        } else {
            setInv([treatmentInventory.sort((a, b) => (a.data().stock > b.data().stock ? 1 : -1))]);
        }
    }, [filter, medicineInventory, otherInventory, treatmentInventory]);

    const sorting = (col) => {
        if (col === "name") {
            setCurrSort("name");
            setCol("name");
            if (order === "ASC") {
                inv[0].sort((a, b) => (a.data().name.toLocaleLowerCase() > b.data().name.toLocaleLowerCase() ? 1 : -1));
                setOrder("DSC");
            }

            if (order === "DSC") {
                inv[0].sort((a, b) => (a.data().name.toLocaleLowerCase() < b.data().name.toLocaleLowerCase() ? 1 : -1));
                setOrder("ASC");
            }
        } else if (col === "unitPrice") {
            setCurrSort("unitPrice");
            setCol("unitPrice");
            if (order === "ASC") {
                inv[0].sort((a, b) => (a.data().unitPrice > b.data().unitPrice ? 1 : -1));
                setOrder("DSC");
            }

            if (order === "DSC") {
                inv[0].sort((a, b) => (a.data().unitPrice < b.data().unitPrice ? 1 : -1));
                setOrder("ASC");
            }
        } else {
            setCurrSort("stock");
            setCol("stock");
            if (order === "ASC") {
                inv[0].sort((a, b) => (a.data().stock > b.data().stock ? 1 : -1));
                setOrder("DSC");
            }

            if (order === "DSC") {
                inv[0].sort((a, b) => (a.data().stock < b.data().stock ? 1 : -1));
                setOrder("ASC");
            }
        }

        if (sortByLowStock) {
            inv[0].sort((a, b) => {
                if (a.data().stock <= a.data().threshold && b.data().stock > b.data().threshold) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
    };

    const handleChange = () => {
        if (!sortByLowStock) {
            setSortByLowStock(true);
            inv[0].sort((a, b) => {
                if (a.data().stock <= a.data().threshold && b.data().stock > b.data().threshold) {
                    return -1;
                } else {
                    return 1;
                }
            });
        } else {
            setSortByLowStock(false);
            col === "name"
                ? inv[0].sort((a, b) =>
                      a.data().name.toLocaleLowerCase() > b.data().name.toLocaleLowerCase() ? 1 : -1
                  )
                : col === "unitPrice"
                ? inv[0].sort((a, b) => (a.data().unitPrice > b.data().unitPrice ? 1 : -1))
                : inv[0].sort((a, b) => (a.data().stock > b.data().stock ? 1 : -1));
        }

        return order === "ASC" ? setOrder("DSC") : "";
    };

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
        return inventoryTable
            .filter((item) => {
                return search === "" ? item : item.data().name.includes(search);
            })
            .map((inventoryRow) => (
                <tr
                    key={inventoryRow.id}
                    className={`${inventoryRow.data().stock <= inventoryRow.data().threshold ? "text-red-600" : ""}`}
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
                            activeItemId={inventoryRow.id}
                            activeItemName={inventoryRow.data().name}
                        />
                    </td>
                </tr>
            ));
    }

    function generateTreatmentRows(inventoryTable) {
        return inventoryTable
            .filter((item) => {
                return search === "" ? item : item.data().name.includes(search);
            })
            .map((inventoryRow) => (
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
            ));
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
                            <p className="">Filter by status</p>
                            <select
                                className="rounded border-2 border-black"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="medicine">Medicine</option>
                                <option value="treatment">Treatment</option>
                                <option value="product">Product</option>
                            </select>
                            <InventoryForm data={{ editMode: false, activeItem: null }} />
                            <input
                                className="w-96"
                                type="search"
                                placeholder="search for your product"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <label>Sort by low stock </label>
                            <input type="checkbox" onChange={handleChange} />
                        </div>
                        <div className="flex flex-col w-full h-[77vh] overflow-auto">
                            <table className="table-gray">
                                <thead>
                                    <tr>
                                        <th
                                            className="w-[35%]"
                                            onClick={() => {
                                                if (filter === "medicine") {
                                                    setInv([medicineInventory])
                                                } else if (filter === "product") {
                                                    setInv([otherInventory])
                                                } else {
                                                    setInv([treatmentInventory])
                                                }
                                            }}
                                        >
                                            Name
                                            <span className="cursor-pointer" onClick={() => sorting("name")}>
                                                {currSort === "name" ? (
                                                    order === "ASC" ? (
                                                        "▲"
                                                    ) : (
                                                        "▼"
                                                    )
                                                ) : (
                                                    <Icon icon={sort} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-[20%] whitespace-nowrap">
                                            Unit Price(RM)
                                            <span className="cursor-pointer" onClick={() => sorting("unitPrice")}>
                                                {currSort === "unitPrice" ? (
                                                    order === "ASC" ? (
                                                        "▲"
                                                    ) : (
                                                        "▼"
                                                    )
                                                ) : (
                                                    <Icon icon={sort} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-[15%]">
                                            Stock
                                            <span className="cursor-pointer" onClick={() => sorting("stock")}>
                                                {currSort === "stock" ? (
                                                    order === "ASC" ? (
                                                        "▲"
                                                    ) : (
                                                        "▼"
                                                    )
                                                ) : (
                                                    <Icon icon={sort} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-[10%]">Add Stock</th>
                                        <th className="w-[10%]">Edit Item</th>
                                        <th className="w-[10%]">Delete Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filter === "medicine" && generateProductRows(inv[0])}
                                    {filter === "product" && generateProductRows(inv[0])}
                                    {filter === "treatment" && generateTreatmentRows(inv[0])}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Inventory;
