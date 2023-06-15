import "./App.css"
import { useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Profile from "./pages/Profile"
import ProfileUpdate from "./pages/ProfileUpdate"
import Queue from "./pages/Queue"

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
