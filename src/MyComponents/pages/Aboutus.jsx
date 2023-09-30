import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'

import Lottie from 'lottie-react'
import skills from '../../images/micro/codeskills.png'
import exe from '../../images/micro/execute.png'
import share from '../../images/micro/share.png'
import animationData from '../../images/lottie/about.json'

export default function Aboutus() {

    const { setauthLoad } = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setauthLoad(30)
        setTimeout(() => {
            setLoaded(true)
            setauthLoad(100)
        }, 1000)
    }, [setauthLoad])
    return (
        <div className={`fade-slide-in container h-[85vh] flex justify-center items-center ${loaded ? 'loaded' : ''}`}>
            <div className="wrap">
                <div className="abbout_us flex justify-center items-center gap-3 p-3 rounded-xl shadow-md">
                    <div className='w-[40%] pl-10'>
                        <div className="heading text-5xl text-slate-800 font-bold tracking-tighter ">Just two friends trying to provide all coding features to everyone
                        </div>
                        <div className="us mt-3 flex justify-start gap-2 items-center">
                            <div className="creator flex justify-center items-center gap-2 bg-gray-100 w-fit px-2 py-2 rounded-full">
                                <div className='initials background-grad font-semibold text-white w-10 h-10 flex items-center justify-center rounded-full'>SC</div>
                                <span className='font-semibold text-slate-500 text-base pr-2'>Sahil Chavan</span>
                            </div>
                            <div className="creator flex justify-center items-center gap-2 bg-gray-100 w-fit px-2 py-2 rounded-full">
                                <div className='initials background-grad font-semibold text-white w-10 h-10 flex items-center justify-center rounded-full'>OD</div>
                                <span className='font-semibold text-slate-500 text-base pr-2'>Onkar Dhotarkar</span>
                            </div>
                        </div>
                    </div>
                    <div className="content text-slate-600 text-base px-6 w-[55%] font-semibold">
                        <Lottie animationData={animationData} className='-z-10 w-[60%] m-auto rounded-2xl drop-shadow-2xl' />

                    </div>

                </div>
                <div className="features flex justify-center items-center gap-3 mt-5">
                    <div className="container bg-gray-100 text-slate-600 px-4 py-3 rounded-md shadow-md">
                        <div className="heading flex items-center gap-3 ">
                            <div className='w-6 h-6'>
                                <img src={skills} alt="" /></div><span className=' font-semibold '>Write code in a multiple langages</span>
                        </div>
                        <div className="content text-slate-500 text-sm w-3/4 mt-2 font-semibold">
                            Write your codes over our app itself, and get a similar experience as coding IDEs.
                        </div>
                    </div>
                    <div className="container bg-gray-100 text-slate-600 px-4 py-3 rounded-md shadow-md">
                        <div className="heading flex items-center gap-3 ">
                            <div className='w-5 h-5'>
                                <img src={exe} alt="" /></div><span className=' font-semibold '>Compile and execute your codes</span>
                        </div>
                        <div className="content text-sm text-slate-500 w-3/4 mt-2 font-semibold">
                            Run your codes over the web app, there is no need to install any external compiler
                        </div>
                    </div>
                    <div className="container bg-gray-100 text-slate-600 px-4 py-3 rounded-md shadow-md">
                        <div className="heading flex items-center gap-3 ">
                            <div className='w-5 h-5'>
                                <img src={share} alt="" /></div><span className=' font-semibold '>Share your codespace with others</span>
                        </div>
                        <div className="content text-sm text-slate-500 w-3/4 mt-2 font-semibold">
                            Share the codespace to make coding fun and easy, collab and learn with your friends
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
