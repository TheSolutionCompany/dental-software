import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const LoginPage = () => {
    const navigate = useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    async function handleLogin(e) {
        e.preventDefault()
        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            // Login successful, you can redirect to another page here
            navigate("/Dashboard")
        } catch (error) {
            setError(error.message)
            //setError("Wrong email or password!")
        }
        setLoading(false)
    }
    return (
        <div className="h-[100vh] bg-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full icon"></div>
                    <h1 className="ml-2 text-white font-bold text-3xl select-none">Dental</h1>
                </div>
            </div>
            <div className="flex justify-center items-center h-full">
                <div className="login-container">
                    <h2 className="text-xl font-bold p-2 mb-6 select-none">Login with your account</h2>
                    <form className="" onSubmit={handleLogin}>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-start h-full">
                                <label className="select-none">Email:</label>
                            </div>
                            <input className="" type="email" ref={emailRef} />
                            <div className="flex items-center justify-start h-full">
                                <label className="select-none">Password:</label>
                            </div>
                            <input type="password" ref={passwordRef} />
                        </div>
                        <div className="mt-4">
                            <button disabled={loading} className="button-green rounded" type="submit">Login</button>
                        </div>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    )
}

export default LoginPage
