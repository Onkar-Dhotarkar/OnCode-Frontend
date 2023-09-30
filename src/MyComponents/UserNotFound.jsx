import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confused from '../images/micro/confused.png'
import right from '../images/micro/right-arrow.png'
export default function UserNotFound() {
    const navigate = useNavigate("")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])
    function navigateUserToLogin() {
        navigate('/log-into-account')
    }
    return (
        <div className={`fade-slide-in ${loaded ? 'loaded' : ''} flex flex-col justify-center px-5 py-11 text-center mx-auto form-shadow w-fit mt-20 rounded-xl`}>
            <img className='w-32 h-32 mx-auto' src={confused} alt="" />
            <div className="main text-4xl font-bold text-center mt-1">
                Oops!
            </div>
            <div className="main mt-3 text-lg text-slate-600 font-semibold text-center">
                Sign in to proceed
            </div>
            <div className="btn-continue">
                <button className="background-grad py-3 w-80 text-white text-base font-semibold rounded-md mt-4 flex justify-center gap-2 items-center" onClick={navigateUserToLogin}>
                    Sign In
                    <img src={right} className='w-3 h-3' alt="" />
                </button>
            </div>
        </div >
    )
}
