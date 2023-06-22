import "./App.css"
import LoginPage from "./pages/LoginPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Profile from "./pages/Profile"
import ProfileUpdate from "./pages/ProfileUpdate"
import Queue from "./pages/Queue"
import PatientProfile from "./pages/PatientProfile"
import { AuthProvider } from "./contexts/AuthContext"
import { DatabaseProvider } from "./contexts/DatabaseContext"

function App() {
    return (
        <div className="App h-[100vh]">
            <BrowserRouter>
                <AuthProvider>
                    <DatabaseProvider>
                        <Routes>
                            <Route exact path="/" element={<LoginPage />} />
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
                            <Route
                                path="/PatientProfile"
                                element={
                                    <ProtectedRoute>
                                        <PatientProfile />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </DatabaseProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
