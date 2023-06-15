import React from "react"

const Profile = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isUserSignedIn")
                navigate("/")
            })
            .catch((error) => {
                console.log("signed out fail")
            })
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <p className="text-gray-500 text-lg">Profile</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
