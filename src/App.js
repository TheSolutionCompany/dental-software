import "./App.css"
import LoginPage from "./pages/LoginPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Appointment from "./pages/Appointment"
import Profile from "./pages/Profile"
import ProfileUpdate from "./pages/ProfileUpdate"
import Queue from "./pages/Queue"
import PatientProfile from "./pages/PatientProfile"
import Inventory from "./pages/Inventory"
import { AuthProvider } from "./contexts/AuthContext"
import { DatabaseProvider } from "./contexts/DatabaseContext"
import Setting from "./pages/Setting"
import Employee from "./pages/Employee"

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
                                path="/Appointment"
                                element={
                                    <ProtectedRoute>
                                        <Appointment />
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
                            <Route
                                path="/Inventory"
                                element={
                                    <ProtectedRoute>
                                        <Inventory />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/Setting"
                                element={
                                    <ProtectedRoute>
                                        <Setting />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/Employee"
                                element={
                                    <ProtectedRoute>
                                        <Employee />
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
