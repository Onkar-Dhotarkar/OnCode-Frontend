import React, { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark'
import light from '../../images/micro/light.png'
import dark from '../../images/micro/sun-dark.png'
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export default function Commandview() {

    const [theme, setTheme] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    })

    return (
        <div className={`fade-slide-in ${loaded ? "loaded" : ""}`}>
            <div className="heading text-3xl font-bold text-slate-600 tracking-tight text-center mt-16">
                View your stored commands and get access whenever you want✅
            </div>
            <div className="commandName text-slate-600 font-semibold text-center mt-3">
                <div className={`w-7 h-7 rounded-full p-[2px] mx-auto ${theme ? "bg-[#a0a0a0]" : ""}`}>
                    <img src={theme ? light : dark} className={`w-full h-full mb-2 rounded-full cursor-pointer `} alt="" onClick={() => setTheme(!theme)} />
                </div>
                {localStorage.getItem("commandName")}➡️
            </div>
            <div className='mt-4'>
                <SyntaxHighlighter style={!theme ? github : atomOneDark} customStyle={{ width: "60%", borderRadius: "9px", padding: "25px", margin: "0px auto", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }} wrapLongLines={true}>
                    {localStorage.getItem("command")}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}
