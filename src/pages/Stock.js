import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import { useDatabase } from "../contexts/DatabaseContext"
import StockForm from "../components/StockForm"

const Stock = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const { stock } = useDatabase()

    const [stateToPass, setStateToPass] = useState({isOpen: false, editMode: false, activeItem: null})

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    function generateRows(stockTable) {
        return stockTable.map((stockRow) =>
        (<tr key={stockRow.id}>
            <td>{stockRow.data().name}</td>
            <td>{stockRow.data().price}</td>
            <td>{stockRow.data().type}</td>
            <td>{stockRow.data().stock}</td>
            <td><StockForm data={{editMode: true, activeItem: stockRow.data()}}/></td>
            <td><button>Delete</button></td>
        </tr>))
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Stock</p>
                    <span>
                    <StockForm data={{editMode: false, activeItem: null}}/>
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
                            {generateRows(stock)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Stock