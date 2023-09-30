import { useState } from 'react'
import { LangContext } from './LangContext'
export function LangProvider({ children }) {
    const [langDetails, setlangDetails] = useState('')
    return (
        <LangContext.Provider value={{ langDetails, setlangDetails }}>
            {children}
        </LangContext.Provider>
    )
}
