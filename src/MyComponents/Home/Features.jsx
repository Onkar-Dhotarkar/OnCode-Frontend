import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import profile from '../../images/micro/user.png'

export default function Features() {
    const { user } = useContext(AuthContext)
    return (
        <div className='mb-5 mt-5'>
            <div className='flex justify-center gap-2'>
                <div className="left flex flex-col gap-2 w-2/5">
                    <div className="container bg-gray-100 text-slate-600 px-4 py-3 rounded-md shadow shadow-slate-200">
                        <div className="heading flex items-center gap-3 ">
                            <div className='w-4 h-4 rounded-full background-grad'></div><span className='text-xl font-semibold '>Get your codes in a click</span>
                        </div>
                        <div className="content text-sm font-semibold w-3/4 mt-2">
                            Get easy and quick acces to all your codes in a convinient manner, no more mess of codes
                        </div>
                    </div>
                    <div className="container text-slate-600 bg-gray-100 px-4 py-3 rounded-md shadow shadow-slate-200">
                        <div className="heading flex items-center gap-3">
                            <div className='w-4 h-4 rounded-full bg-[#fb6976]'></div><span className='text-xl font-semibold'>Try our code editor</span>
                        </div>
                        <div className="content text-sm font-semibold w-3/4 mt-2">
                            Write, compile and execute your all codes on site itself, no need to install any environment in your system
                        </div>
                    </div>

                </div>

                <div className="right background-grad text-white px-4 py-3 rounded-md w-[25%]">
                    <div className="user flex items-center gap-3">
                        <img className='w-20 h-20 object-cover rounded-full' src={user.userprofile ? user.userprofile : profile} alt="" />
                        <div className="username text-xl font-semibold capitalize">
                            {user.username ? user.username : "User123"}
                            <div className='lowercase text-sm font-normal'>{user ? user.usermail : null}</div>
                        </div>
                    </div>
                    <div className='text-sm font-semibold w-3/4 px-2 mt-3'>
                        Add more details to your profile ,customize it and show your areas of interest. Happy Coding
                    </div>
                </div>
            </div>
        </div>
    )
}
