import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

export const SignUp = ({ history }) => {
    const navigate = useNavigate();
    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            navigate("/SignUpSuccess");
        } catch (error) {
            alert(error);
        }
    }, [history]);

    
    const handleLogin = async event => {
        event.preventDefault();
        try {
            navigate("/");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div class="flex justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
            <div class="login-container">
                <p class="text-xl font-bold p-2 mb-6">Sign up new account</p>
                <form class="" onSubmit={handleSignUp}>
                    <div class="flex">
                        <div class="flex flex-col pr-2">
                            <div class="flex items-center justify-end h-full">
                                <label class="">Email:</label>
                            </div>
                            <div class="flex items-center justify-end h-full">
                                <label class="">Password:</label>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <input name="email" type="email" />
                            <input name="password" type="password" />
                        </div>
                    </div>
                    <div class="mt-4">
                        <button class="button-gray rounded" type="submit">Sign Up</button>
                    </div>
                </form>
                <div class="mt-4">
                <p className="text-gray-600">Don't have an account? <button onClick={handleLogin} className="text-blue-500">Login now</button></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp