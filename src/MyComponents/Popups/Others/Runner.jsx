import React, { useState } from 'react'
import run from '../../../images/micro/play.png'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from './Loader'
export default function Runner({ code, cname, clanguage }) {

    const [generatingOutput, setgeneratingOutput] = useState(false)
    const [error, setError] = useState(false)
    const [resp, setResponse] = useState([])
    const [input, setInput] = useState('')

    const handleInputChange = (e) => {
        setInput(e.target.value.replace(/ /g, '\n'))
    }

    const executeCode = async () => {
        if (!cname || !code || !clanguage) {
            toast.error("Mention all fields")
            return
        }
        setgeneratingOutput(true)
        await axios.post('http://localhost:3001/execute', {
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
            toast.error(err.message)
            setgeneratingOutput(false)
            setResponse("Filed to execute the code")
            setError(true)
        })
    }

    return (
        <div className='w-full'>
            <textarea name="inputs" id="inputs" className='w-full text-sm font-semibold outline-none border border-slate-200 rounded-md px-4 py-2' placeholder='Enter your inputs if there are and give space between them for identification, remember to place an extra space at end' onChange={handleInputChange}></textarea>

            <div className={`outputarea overflow-auto w-full h-72 flex justify-start items-start py-2 px-6 border border-slate-100 rounded-md shadow shadow-slate-200 mt-1 font-semibold ${error ? 'text-red-600' : 'text-slate-600 '}`}>
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
