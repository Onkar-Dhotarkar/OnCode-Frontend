import React from 'react'
import { HashLoader } from 'react-spinners'
export default function Loader({ title }) {
    return (
        <div className="loader flex flex-col justify-center items-center mx-auto">
            <HashLoader
                size={55}
                color="#fb6976" />
            <span className='mt-3 text-slate-500 text-xl font-semibold tracking-tight'>{title}</span>
        </div>
    )
}
