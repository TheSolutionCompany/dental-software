import "./App.css"
import { useEffect } from "react"
import LoginPage from "./components/LoginPage"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./components/Dashboard"
import Appointment from "./components/Appointment"
import Queue from "./components/Queue"

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
        <div className="App h-[100vh]">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/Dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Queue"
                        element={
                            <ProtectedRoute>
                                <Queue />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Appointment"
                        element={
                            <ProtectedRoute>
                                <Appointment />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
