import React, { useState } from 'react'
import { db } from '../../Firebase/Firebase'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import Loader from '../Others/Loader'

export default function ChangeDescription() {
    const [desc, setDesc] = useState('')
    const { user, setauthLoad } = useContext(AuthContext)
    const [setting, setsetting] = useState(false)
    const navigate = useNavigate("")

    async function setDescription() {
        setauthLoad(30)
        setsetting(true)
        let docRef = doc(db, user.useruid, user.useruid + "_userdata");
        if (!desc) {
            toast.error("Mention the description")
            setsetting(false)
            setauthLoad(100)
            return
        }
        updateDoc(docRef, {
            description: desc
        })
        // toast.success(getDocs(collectionRef)[0].email);
        toast.success("description set successfully")
        setauthLoad(100)
        setsetting(false)
        navigate("/")
    }

    return (
        <div className='w-full'>
            {
                setting ? <div className='h-[35vh] flex items-center'><Loader title="Adding description" /></div> :
                    <div className='w-full pt-1 pb-2 px-3 text-center'>
                        <div className='text-start'>
                            <label className='text-sm font-semibold text-slate-600'>Set a little description</label>
                        </div>
                        <textarea className='mt-1 block w-full rounded-md shadow-sm text-slate-600 text-sm font-semibold py-2 px-2 outline-none border border-slate-200' type="text" placeholder='Add a little description' rows={12} onChange={(e) => { setDesc(e.target.value) }} />
                        <button className='background-grad text-white text-sm w-[15.75rem] py-2 rounded-md mt-4 font-semibold' onClick={setDescription}>Set description</button>
                    </div>
            }
        </div>
    )
}
