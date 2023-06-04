import React from "react"
import { Navigate } from "react-router-dom"
import firebase from "../firebase"

const ProtectedRoute = ({children}) => {
    if (firebase.auth().currentUser == null) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
