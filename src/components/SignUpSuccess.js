import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom"

export const SignUpSuccess = () => {
    const navigate = useNavigate();
    const navigateToLoginPage = async event => {
        try {
            navigate("/");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div class="flex flex-col items-center justify-center h-screen">
            <div class="text-2xl font-bold mb-4">Account Sign Up Successful!</div>
            <p class="text-gray-600">Congratulations! Your account has been successfully created.</p>
            <button onClick={navigateToLoginPage} class="mt-8 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded">Go back to Login</button>
        </div>
    );
};

export default SignUpSuccess