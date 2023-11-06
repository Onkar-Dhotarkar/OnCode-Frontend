import React from 'react'
import extra from "../../images/bgs/figma_3.png"
import community_bg from "../../images/bgs/community_bg 1.png"
import right_arrow from "../../images/micro/right-arrow.png"
import { useNavigate } from 'react-router-dom'
export default function Extras() {

    const navigate = useNavigate("/")

    return (
        <>
            <div className='w-full flex flex-col items-center mt-28'>
                <div className='text-3xl font-bold text-slate-600 flex items-center gap-2'>
                    <div className='w-4 h-4 rounded-full bg-[#fb6976] mt-1'></div>
                    <div>Any doubt in coding 🧑‍💻, discuss with other Folks</div>
                    <div className='w-4 h-4 rounded-full bg-[#fb6976] mt-2'></div>
                </div>

                <div className='flex justify-center items-center w-[68%] mr-14'>
                    <div className="community_bg">
                        <img src={community_bg} alt="" />
                    </div>
                    <div className='text-4xl font-bold w-80 text-slate-600'>
                        Let your friends help you with your doubts 😊<br />
                        <button className='bg-[#fb6976] text-white flex justify-center items-center gap-2 text-sm font-semibold px-6 py-3 rounded-md mt-3' onClick={() => {
                            navigate("/community")
                        }}>
                            Community
                            <img className='w-3' src={right_arrow} alt="" />
                        </button>
                    </div>
                </div>

            </div>
            <div className='w-full flex flex-col items-center mt-28'>

                <div className='text-3xl font-bold text-slate-600 flex items-center'><div className='w-4 h-4 rounded-full bg-[#fb6976] mr-3 mt-1'></div> What's the actual purpose of <span className='text-[#fb6976] ml-2'>O</span>n<span className='text-[#fb6976]'>C</span>ode?<div className='w-4 h-4 ml-2 mt-1 rounded-full bg-[#fb6976] mr-3'></div></div>
                <div className='w-[60%] gap-4 mt-4'>
                    <p className='text-slate-600 font-semibold text-center'>
                        <div className='text-2xl text-slate-700 mb-4'>I <span className='text-slate-400 line-through'>can't</span> will do Code.</div>
                        We're two friends who love coding, just like you! 🤝💻 Our platform is for everyone in the coding community. Write and store code effortlessly, use our dynamic editor for six languages, and practice web design with our web tool. 🚀✨ Join our community to showcase your skills, ask questions, and collaborate. Let's make coding a delightful journey together. Happy Coding! 💻🚀👫🌟
                    </p>
                </div>
                <img src={extra} className='h-[30rem] mx-auto' alt="" />
            </div>

        </>
    )
}
