import React, { Component } from "react"
import firebase from "../../firebase"
import "./LoginPage.css"

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            error: "",
        }
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    handleLogin = async (event) => {
        event.preventDefault()
        this.setState({ error: "" })

        const { email, password } = this.state

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            // Login successful, you can redirect to another page here
        } catch (error) {
            this.setState({ error: error.message })
        }
    }

    render() {
        const { email, password, error } = this.state

        return (
            <div className="login-container">
                <h2>Login</h2>
                <form className="login-form" onSubmit={this.handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={this.handleEmailChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={this.handlePasswordChange} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        )
    }
}

export default LoginPage
