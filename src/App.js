import "./App.css"
import { useEffect } from "react"
import LoginPage from "./components/LoginPage"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./components/AdminDashboard"
import SignUp from "./components/SignUp"
import SignUpSuccess from "./components/SignUpSuccess"

function App() {
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem("isUserSignedIn", true)
            } else {
                localStorage.removeItem("isUserSignedIn")
            }
        })
    }, [])


    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/SignUp" element={<SignUp /> }/>
                    <Route path="/SignUpSuccess" element={<SignUpSuccess /> }/>
                    <Route
                        path="/AdminDashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
