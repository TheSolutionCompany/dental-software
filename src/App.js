import "./App.css"
import { useEffect } from "react"
import LoginPage from "./components/LoginPage"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./components/Dashboard"
import Appointments from "./components/Appointments"
import Queue from "./components/Queue"
import Profile from "./components/Profile"
import ProfileUpdate from "./components/ProfileUpdate"

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
                        path="/Appointments"
                        element={
                            <ProtectedRoute>
                                <Appointments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ProfileUpdate"
                        element={
                            <ProtectedRoute>
                                <ProfileUpdate />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
