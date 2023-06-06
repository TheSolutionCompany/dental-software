import React from "react";
import { Register } from "./Register";

const SideBar = () => {
    return (
        <aside
            id="logo-sidebar"
            className="top-0 left-0 w-64 h-full bg-gray-700 border-r border-gray-200"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-3 overflow-y-auto bg-gray-600">
                <ul className="space-y-2 font-medium">
                    <Register />
                    <li className="cursor-pointer select-none">
                        <button
                            className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="text-left flex-1 ml-3 whitespace-nowrap">
                                Appointment
                            </span>
                            <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-red-200 bg-red-600 rounded-full">
                                3
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
                                MC
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default SideBar;
