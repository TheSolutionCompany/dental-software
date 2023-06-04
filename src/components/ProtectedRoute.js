import React from "react"
import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

const ProtectedRoute = ({ children }) => {
    if (auth.currentUser == null) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
