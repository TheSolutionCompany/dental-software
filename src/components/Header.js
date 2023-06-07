import React, { useState } from "react";
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth";

const Header = ({ handleLogout }) => {
    const [email, setEmail] = useState("")

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setEmail(user.email)
        }
    })
    return (
        // <header class="flex items-center justify-between p-4 bg-gray-800">
        //     <div class="flex items-center">
        //         <div class="w-8 h-8 rounded-full icon"></div>
        //         <h1 class="ml-2 text-white font-bold text-3xl select-none">
        //             Dental
        //         </h1>
        //     </div>
        //     <span className="">Patient List</span>
        //     <button
        //         onClick={handleLogout}
        //         class="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
        //     >
        //         Logout
        //     </button>
        // </header>
        <header className="flex items-center justify-between p-4 bg-gray-800">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full icon"></div>
                <h1 className="ml-2 text-white font-bold text-3xl select-none">Welcome, {email}</h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button className="mr-4 text-white hover:text-gray-400">Dashboard</button>
                <button className="mr-4 text-white hover:text-gray-400">Queue</button>
                <button className="mr-4 text-white hover:text-gray-400">Appointments</button>
                <button className="mr-4 text-white hover:text-gray-400">Admin settings</button>
            </div>
            <button onClick={handleLogout} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded">
                Logout
            </button>
        </header>
    )
};

export default Header;
