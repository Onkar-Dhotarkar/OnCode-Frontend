import React, { useEffect, useState } from 'react'
import run from '../../../images/micro/play.png'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from './Loader'

export default function Runner({ code, clanguage }) {

    const [generatingOutput, setgeneratingOutput] = useState(false)
    const [error, setError] = useState(false)
    const [resp, setResponse] = useState([])
    const [input, setInput] = useState('')
    const [cname, setCname] = useState('')

    useEffect(() => {
        setCname(localStorage.getItem("cname"))
    }, [setCname])

    const handleInputChange = (e) => {
        setInput(e.target.value.replace(/ /g, '\n'))
    }

    const executeCode = async () => {
        if (!cname || !code || !clanguage) {
            toast.error("Mention all fields")
            return
        }
        setgeneratingOutput(true)
        await axios.post(process.env.RUNNER_URL || "https://oncode-backend-a5xg.onrender.com/execute", {
            code,
            cname,
            clanguage,
            input
        }).then((r) => {
            if (r.data[1] === 'false') {
                toast.error("Execution failed")
                setResponse(r.data[0])
                setError(true)
                setgeneratingOutput(false)
            } else {
                toast.success("Executed successfully")
                setResponse(r.data[0])
                setgeneratingOutput(false)
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err.message)
            setgeneratingOutput(false)
            setResponse("Failed to execute the code")
            setError(true)
        })
    }

    return (
        <div className='w-full'>
            <label htmlFor="" className='text-slate-700 font-semibold'>Code name</label>
            <input type="text" placeholder='Enter a valid name for your program' className='text-slate-600 text-sm px-3 py-2 rounded-md border border-slate-200 w-full mt-2' value={cname} onChange={(e) => {
                setCname(e.target.value)
                localStorage.setItem("cname", e.target.value)
            }} />
            <label htmlFor="" className='text-slate-700 font-semibold mt-3'>Input values</label>
            <textarea name="inputs" id="inputs" className='mt-1 w-full text-sm outline-none border border-slate-200 rounded-md px-3 py-2' placeholder='Enter your inputs if there are and give space between them for identification, remember to place an extra space at end' onChange={handleInputChange}></textarea>
            <label htmlFor="" className='text-slate-700 font-semibold mt-3'>Output</label>
            <div className={`outputarea overflow-auto w-full h-60 flex justify-start items-start py-2 px-6 border border-slate-100 rounded-md shadow shadow-slate-200 mt-1 font-semibold ${error ? 'text-red-600' : 'text-slate-600 '}`}>
                {generatingOutput ? <div className='h-full w-full flex justify-center items-center'><Loader title="Executing code" /></div> : <pre>
                    {resp}
                </pre>}
            </div>

            <button className='mx-auto w-28 background-grad py-2 px-4 rounded-md text-sm text-white font-semibold flex justify-center items-center gap-2 mt-4' onClick={executeCode}>
                Run
                <img className='w-3 h-3' src={run} alt="" />
            </button>
        </div>
    )
}
