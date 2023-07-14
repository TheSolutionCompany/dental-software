import React from "react"
import RegisterExisting from "./RegisterExisting"
import RegisterNew from "./RegisterNew"
import MedicalCertificate from "./MedicalCertificate"
import MakeAppointment from "./MakeAppointment"
import BusinessHourForm from "./BusinessHourForm"

const SideBar = () => {
    return (
        <aside
            id="logo-sidebar"
            className="top-0 left-0 w-64 h-full bg-gray-700 border-r border-gray-200"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-3 overflow-y-auto bg-gray-600">
                <ul className="space-y-2 font-medium">
                    <BusinessHourForm />
                    <RegisterExisting />
                    <RegisterNew />
                    <MedicalCertificate />
                    <MakeAppointment />
                </ul>
            </div>
        </aside>
    )
}

export default SideBar
