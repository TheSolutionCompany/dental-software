import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useDatabase } from "../contexts/DatabaseContext";
import DeleteConfirmation from "../components/DeleteConfirmation"
import EmployeeDetailForm from "../components/EmployeeDetailForm";

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
                <td className="table-td-gray w-[25%]">{employeeRow.data().email}</td>
                <td className="table-td-gray w-[10%]">{employeeRow.data().position}</td>
                <td className="table-td-gray w-[10%]">
                    <EmployeeDetailForm
                        data={{
                            editMode: true,
                            activeEmployee: {
                                id: employeeRow.id,
                                ...employeeRow.data()
                            }
                        }}
                    />
                </td>
                <td className="table-td-gray w-[10%]">Edit Working Hours</td>
                <td className="table-td-gray w-[10%]">
                    <DeleteConfirmation
                        docName={"users"}
                        activeItemId={employeeRow.id}
                        activeItemName={employeeRow.data().displayName}
                    /></td>
            </tr>
        ))
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
                                <th className="table-th-gray w-[25%]">Email</th>
                                <th className="table-th-gray w-[10%]">Position</th>
                                <th className="table-th-gray w-[10%]">Edit Details</th>
                                <th className="table-th-gray w-[15%]">Edit Working Hours</th>
                                <th className="table-th-gray w-[15%]">Delete Employee</th>
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
