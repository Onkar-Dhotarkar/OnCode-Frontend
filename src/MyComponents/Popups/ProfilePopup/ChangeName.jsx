import { updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from '../../Firebase/Firebase'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'

export default function ChangeName() {
    const [fname, setFName] = useState('')
    const [lname, setLName] = useState('')
    const { user, setauthLoad } = useContext(AuthContext)
    const navigate = useNavigate("")

    async function setUsername() {
        setauthLoad(30)
        let docRef = doc(db, user.useruid, user.useruid + "_userdata");
        if (!fname || !lname) {
            toast.error("Mention the new username")
            setauthLoad(100)
            return
        }
        await updateProfile(auth.currentUser, {
            displayName: fname + " " + lname
        })
        updateDoc(docRef, {
            username: fname + " " + lname
        })
        // toast.success(getDocs(collectionRef)[0].email);
        toast.success("Username changed successfully")
        setauthLoad(100)
        navigate("/")
    }

    return (
        <div className='mx-auto w-full py-2 px-3'>
            <label className='text-sm font-semibold text-slate-600'>First name</label>
            <input className='mt-1 block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2' type="text" placeholder='First name' onChange={(e) => { setFName(e.target.value) }} />
            <label className='text-sm font-semibold text-slate-600 mt-3'>Last name</label>
            <input type="text" className='block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2' placeholder='Last name' onChange={(e) => { setLName(e.target.value) }} />
            <div className='text-center'>
                <button className='background-grad text-white text-sm w-[15.75rem] py-2 rounded-md mt-4 font-semibold' onClick={setUsername}>Change username</button>
            </div>
        </div>
    )
}
