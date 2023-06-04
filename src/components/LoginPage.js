import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import "./LoginPage.css"

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
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}

export default LoginPage
