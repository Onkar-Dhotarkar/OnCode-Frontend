import React, { useState } from 'react'
import { CodeContext } from './CodeContext'
export function CodeProvider({ children }) {
    const [viewid, setviewid] = useState({
        name: "",
        lang: ""
    })
    return (
        <CodeContext.Provider value={{ viewid, setviewid }}>
            {children}
        </CodeContext.Provider>
    )
}
