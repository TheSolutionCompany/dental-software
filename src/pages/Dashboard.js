import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const Dashboard = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    // Variables in DatabaseContext
    const { transactions } = useDatabase()

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage="Dashboard" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <div className="border border-black m-4 w-[40%]">
                        {transactions.map((transaction) => {
                            return <div>{transaction.id}</div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
