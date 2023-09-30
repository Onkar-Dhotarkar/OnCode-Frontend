import { useState } from "react"
import { AuthContext } from "../contexts/AuthContext"

export function AuthProvider({ children }) {
    const [authLoad, setauthLoad] = useState(0)
    const [authenticated, setAuthenticated] = useState('')
    const [user, setUser] = useState({
        useruid: '',
        username: '',
        usermail: '',
        userprofile: '',
        userdate: ''
    })
    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, user, setUser, authLoad, setauthLoad }}>
            {children}
        </AuthContext.Provider>
    )
}