import React, { useState } from "react";
import HeaderIcon from "../assets/icons/header-icon.png";
const Header = ({ handleLogout }) => {
    
    const [isShown, setIsShown] = useState(false);

    return (
        <header className="flex items-center justify-between bg-gray-800">
            <div className="flex items-center cursor-pointer ml-4">
                <div className="w-8 mr-2"><img src={HeaderIcon} alt="header icon" /></div>
                <h1 className="text-white font-bold text-3xl select-none">
                    Dental
                </h1>
            </div>
            <div className="h-full w-full flex items-center justify-end font-bold">
                <button className="p-4 h-full text-white hover:bg-gray-700">Patient List</button>
                <button className="p-4 h-full text-white hover:bg-gray-700">Appointment List</button>
                <div className="flex h-full">

                    <button 
                        onMouseEnter={() => setIsShown(true)} 
                        onMouseLeave={() => setIsShown(false)}
                        className="p-4 h-full text-white hover:bg-gray-700">Account</button>
                    {isShown && (
                        <ul 
                            onMouseEnter={() => setIsShown(true)} 
                            onMouseLeave={() => setIsShown(false)}
                            className="cursor-pointer absolute text-white top-14 bg-gray-800"
                        >
                            <li className="px-4 py-2 hover:bg-gray-700">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-700">Settings</li>
                            <li onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-500">Logout</li>
                        </ul>
                    )}
                </div>
            </div>
            {/* <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Logout
            </button> */}
        </header>
    );
};

export default Header;
