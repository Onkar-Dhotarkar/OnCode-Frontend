import countryList from 'react-select-country-list'
import React, { useState } from 'react'
import { db } from '../../Firebase/Firebase'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'

export default function ChangeName() {
    const [country, setCountry] = useState('')
    const [oneliner, setOneliner] = useState('')
    const { user, setauthLoad } = useContext(AuthContext)
    const navigate = useNavigate("")

    async function setOthers() {
        setauthLoad(30)
        let docRef = doc(db, user.useruid, user.useruid + "_userdata");
        if (!country || !oneliner) {
            toast.error("Mention the new username")
            setauthLoad(100)
            return
        }
        let code = countryList().getValue(country)
        if (code !== undefined) {
            await updateDoc(docRef, {
                country: code,
                oneliner: oneliner
            })
        } else {
            toast.error("Enter a valid country name")
            setauthLoad(100)
            return
        }
        // toast.success(getDocs(collectionRef)[0].email);
        toast.success("Other details changed successfully")
        setauthLoad(100)
        navigate("/")
    }

    return (
        <div className='mx-auto w-full py-2 px-3'>
            <label className='text-sm font-semibold text-slate-600'>Enter country name</label>
            <input className='mt-1 block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2' type="text" placeholder='Country' onChange={(e) => { setCountry(e.target.value) }} />
            <label className='text-sm font-semibold text-slate-600 mt-3'>Add one liner about yourself</label>
            <input type="text" className='block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2' placeholder='One liner' onChange={(e) => { setOneliner(e.target.value) }} />
            <div className='text-center'>
                <button className='background-grad text-white text-sm w-[15.75rem] py-2 rounded-md mt-4 font-semibold' onClick={setOthers}>Save changes</button>
            </div>
        </div>
    )
}
