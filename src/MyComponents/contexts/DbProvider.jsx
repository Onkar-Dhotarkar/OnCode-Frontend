import { useState } from 'react'
import { DbContext } from './DbContext'

export function DbProvider({ children }) {
    const [dbdata, setdbdata] = useState([])
    return (
        <DbContext.Provider value={{ dbdata, setdbdata }}>
            {children}
        </DbContext.Provider>
    )
}
