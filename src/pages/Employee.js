import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useDatabase } from "../contexts/DatabaseContext";
import DeleteConfirmation from "../components/DeleteConfirmation"
import EmployeeDetailForm from "../components/EmployeeDetailForm";
import { encode, verify } from "../util/JwtUtil"

export default function Employee() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { employees } = useDatabase();

    async function handleLogout() {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    function generateEmployeeRows(employeeTable) {
        return employeeTable.map((employeeRow) => (
            <tr className="table-tr-tbody-gray" key={employeeRow.id}>
                <td className="table-td-gray w-[30%]">{employeeRow.data().displayName}</td>
                <td className="table-td-gray w-[30%]">{employeeRow.data().email}</td>
                <td className="table-td-gray w-[10%]">{employeeRow.data().position}</td>
                <td className="table-td-gray w-[10%]">Edit Working Hours</td>
                <td className="table-td-gray w-[10%]">
                    <DeleteConfirmation
                        docName={"users"}
                        activeItemId={employeeRow.id}
                        activeItemName={employeeRow.data().displayName}
                    /></td>
                <th className="table-th-gray w-[10%]">
                    <button onClick={()=>showToken(employeeRow.data(), employeeRow.id)}>
                        Generate Token
                    </button>
                </th>
            </tr>
        ))
    }

    async function showToken(employee, id){
        let jwt = await encode({name: employee.displayName, email: employee.email, position: employee.position}, id)
        alert(jwt)
        let decrypted = await verify(jwt, id)
        console.log(decrypted)
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Employee"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full h-full bg-gray-200">
                    <h1>Employee List</h1>
                    <EmployeeDetailForm data={{editMode: false, activeEmployee: null}}/>
                    <div className="flex flex-col pt-10 px-8 w-full">
                        <table className="table-gray">
                            <tr className="table-tr-thead-gray">
                                <th className="table-th-gray w-[30%]">Name</th>
                                <th className="table-th-gray w-[30%]">Email</th>
                                <th className="table-th-gray w-[10%]">Position</th>
                                <th className="table-th-gray w-[10%]">Edit Working Hours</th>
                                <th className="table-th-gray w-[10%]">Delete Employee</th>
                                <th className="table-th-gray w-[10%]">Generate Token</th>
                            </tr>
                            <tbody>
                                {generateEmployeeRows(employees)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
