import "./App.css"
import { useEffect } from "react"
import LoginPage from "./components/LoginPage"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./components/AdminDashboard"

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
