import React from "react"
import RegisterExisting from "./RegisterExisting"
import RegisterNew from "./RegisterNew"

const SideBar = () => {
    return (
        <aside
            id="logo-sidebar"
            className="top-0 left-0 w-64 h-full bg-gray-700 border-r border-gray-200"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-3 overflow-y-auto bg-gray-600">
                <ul className="space-y-2 font-medium">
                    <RegisterExisting />
                    <RegisterNew />
                    <li className="cursor-pointer select-none">

                        <button
                            className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="text-left flex-1 ml-3 whitespace-nowrap">
                                Make Appointment
                            </span>
                        </button>
                    </li>
                    <li className="cursor-pointer select-none">
                        <button
                            className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="text-left flex-1 ml-3 whitespace-nowrap">
                                Billing
                            </span>
                        </button>
                    </li>
                    <li className="cursor-pointer select-none">
                        <button
                            className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="text-left flex-1 ml-3 whitespace-nowrap">
                                Issue MC
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default SideBar
