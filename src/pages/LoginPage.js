import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, getCountFromServer, query, where } from "firebase/firestore"

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
            const q = query(collection(db, "queues"), where("doctorId", "==", auth.currentUser.uid))
            const count = await getCountFromServer(q)
            localStorage.setItem("queueSize", parseInt(count.data().count))
            navigate("/Dashboard")
        } catch (error) {
            setError(error.message)
            //setError("Wrong email or password!")
        }
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
                            <input className="" type="email" value={email} onChange={handleEmailChange} />
                            <div className="flex items-center justify-start h-full">
                                <label className="select-none">Password:</label>
                            </div>
                            <input type="password" value={password} onChange={handlePasswordChange} />
                        </div>
                        <div className="mt-4">
                            <button className="button-green rounded" type="submit">Login</button>
                        </div>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    )
}

export default LoginPage
