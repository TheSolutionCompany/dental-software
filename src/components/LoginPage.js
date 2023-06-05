import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export const LoginPage = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        setError("")

        try {
            await signInWithEmailAndPassword(auth, email, password)
            // Login successful, you can redirect to another page here
            navigate("/AdminDashboard")
        } catch (error) {
            setError(error.message)
            //setError("Wrong email or password!")
        }
    }
    const handleSignUp = async (event) => {
        event.preventDefault()
        setError("")

        try {
            navigate("/SignUp")
        } catch (error) {
            setError(error.message)
            //setError("Wrong email or password!")
        }
    }
    return (
        // <div className="flex justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
        // <div className="login-container">
        //     <h2 className="text-xl font-bold p-2 mb-6">Login with your account</h2>
        //     <form className="" onSubmit={handleLogin}>
        //         <div className="flex">
        //             <div className="flex flex-col pr-2">
        //                 <div className="flex items-center justify-end h-full">
        //                     <label className="">Email:</label>
        //                 </div>
        //                 <div className="flex items-center justify-end h-full">
        //                     <label className="">Password:</label>
        //                 </div>
        //             </div>
        //             <div className="flex flex-col">
        //                 <input className="" type="email" value={email} onChange={handleEmailChange} />
        //                 <input type="password" value={password} onChange={handlePasswordChange} />
        //             </div>
        //         </div>
        //         <div className="mt-4">
        //             <button className="button-green rounded" type="submit">Login</button>
        //         </div>
        //     </form>
        //     {error && <div className="error-message">{error}</div>}
        // </div>
        // <button onClick={handleSignUp} class="">Sign Up</button>
        // </div>
        <div className="flex justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
            <div className="login-container">
                <h2 className="text-xl font-bold p-2 mb-6">Login with your account</h2>
                <form className="" onSubmit={handleLogin}>
                    <div className="flex">
                        <div className="flex flex-col pr-2">
                            <div className="flex items-center justify-end h-full">
                                <label className="">Email:</label>
                            </div>
                            <div className="flex items-center justify-end h-full">
                                <label className="">Password:</label>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <input className="" type="email" value={email} onChange={handleEmailChange} />
                            <input type="password" value={password} onChange={handlePasswordChange} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-600">Don't have an account? <button onClick={handleSignUp} className="text-blue-500">Sign up</button></p>
                    </div>
                    <div className="mt-4">
                        <button className="button-green rounded" type="submit">Login</button>
                    </div>
                </form>
                {error && <div className="error-message">{error}</div>}

            </div>
        </div>
    )
}

export default LoginPage
