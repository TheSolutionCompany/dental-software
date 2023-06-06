import React from "react";

const Header = ({ handleLogout }) => {
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
                <h1 className="ml-2 text-white font-bold text-3xl select-none">
                    Dental
                </h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button className="mr-4 text-white hover:text-gray-400">Patient List</button>
                <button className="mr-4 text-white hover:text-gray-400">Appointment List</button>
                <button className="mr-4 text-white hover:text-gray-400">Account</button>
            </div>
            <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;
