import React from 'react'
import plus from '../../../images/micro/plus.png'
import tick from '../../../images/micro/checked.png'
import codeskills from '../../../images/micro/codeskills.png'
import { useState } from 'react'
import { db } from '../../Firebase/Firebase'
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../Others/Loader'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import failure from '../../../images/micro/failure.png'

export default function ChangeSkills({ processongoing, setprocessongoing }) {
    const [typed, setTyped] = useState('')
    const [current, setCurrent] = useState([])
    const [setting, setSetting] = useState(false)
    const { user, setauthLoad } = useContext(AuthContext)
    const navigate = useNavigate("/")

    useEffect(() => {
        async function getData() {
            const docRef = doc(db, user.useruid, user.useruid + "_userdata")
            const docs = await getDoc(docRef)
            setCurrent(docs.data().skills)
        }
        getData()
    }, [user.useruid])

    async function setUserSkills() {
        setSetting(true)
        setauthLoad(30)
        const docRef = doc(db, user.useruid, user.useruid + "_userdata")
        await setDoc(docRef, { skills: current }, { merge: true })
        setSetting(false)
        setauthLoad(100)
        toast.success("Skills added successfully")
        navigate("/")
    }

    return (
        <div className='w-full'>
            {setting ? <div className='h-[40vh] flex items-center'><Loader title="Adding skills" /></div> : <div className='w-full' >
                <div className="head flex flex-col items-center text-sm mx-auto w-full text-slate-600">
                    <div className='flex w-full justify-center items-center gap-2'>
                        <input type="text" className='w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2' placeholder='Coding and other skills' value={typed} onChange={(e) => {
                            setTyped(e.target.value)
                        }} />
                        <button className='bg-[#fb6976] text-white font-semibold text-sm px-3 py-2 rounded-md' onClick={() => {
                            if (typed) {
                                setCurrent(prev => [...prev, typed])
                                setTyped('')
                            }
                        }}>Add+</button>
                    </div>
                    <div id='suggestion' className='mt-3 flex flex-wrap gap-2 justify-start'>
                        {current.map(curr => {
                            return (
                                <div className='text-slate-600 border border-slate-100 font-semibold px-3 py-2 text-sm rounded-3xl cursor-pointer flex items-center justify-center gap-2 capitalize'>
                                    {curr}
                                    <button>
                                        <img src={failure} className='w-3 h-3' alt="" onClick={() => {
                                            setCurrent((prev) => {
                                                return prev.filter(
                                                    (skill) => skill !== curr
                                                );
                                            });
                                            toast.success("Skill removed")
                                        }} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <button className={`button  bg-[#fb6976] text-white font-semibold text-sm px-3 py-2 ml-1 rounded-md ${current.length === 0 ? '' : 'mt-4'}`} onClick={setUserSkills}>
                    Set your skills
                </button>
            </div >}
        </div>

    )
}
