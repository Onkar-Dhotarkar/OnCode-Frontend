import React from 'react'
import extra from "../../images/bgs/figma_3.png"
export default function Extras() {
    return (
        <>
            <div className='w-full flex flex-col items-center mt-28'>

                <div className='text-3xl font-semibold text-slate-700 flex items-center'><div className='w-4 h-4 rounded-full bg-[#fb6976] mr-3'></div> What's the actual purpose of <span className='text-[#fb6976]'>O</span>n<span className='text-[#fb6976]'>C</span>ode?</div>
                <div className='w-[60%] gap-4 mt-8'>
                    <p className='text-slate-600 font-semibold text-center'>
                        <div className='text-2xl text-slate-700 mb-2 '>I <span className='text-slate-400 line-through'>can't</span> will do Code.</div>
                        We are just two friends same as you all coders. This platform is for everyone who is related to coding.We offer services to write ans store code at the same location, a dynamic code editor able to code in 6 languages and web tool for practicing compact web designs.Explore our community to show your skills and coding abilities to others, raise questions to solve coding issues and doubts in code or other concepts.So travel your coding journey alongside us.Hoping this will help a lot of folks who are in 💕 with code.Happy Coding!
                    </p>
                </div>
                <img src={extra} className='w-[45%] mx-auto' alt="" />
            </div>
            <div className='w-full flex flex-col items-center mt-28'>
                <div className='text-3xl font-semibold text-slate-700 flex items-center gap-2'>
                    <div>Any doubt in coding, discuss with other Folks</div>
                    <div className='w-4 h-4 rounded-full bg-[#fb6976] mt-2'></div></div>
                <div className='w-[60%] gap-4 mt-8'>
                    <p className='text-slate-600 font-semibold text-center'>
                        <div className='text-2xl text-slate-700 mb-2 '>I <span className='text-slate-400 line-through'> have</span>    don't have any doubts</div>
                        Welcome to our coding community, where questions find answers and knowledge blossoms. Dive into the world of programming, share your coding queries, and let the collective wisdom of our friendly members guide you. Whether you're a coding novice or an experienced developer, here, we're united by passion to learn, grow together. Join this collaborative journey, where every question sparks a conversation and every answer fuels the love for coding. Welcome to a space where curiosity meets camaraderie. Happy coding! 🚀💻🌐
                    </p>
                </div>
                <div className='flex justify-center items-center gap-2'>

                    <button className='bg-[#fb6976] text-white font-semibold px-6 py-3 rounded-md mt-2'>
                        Community
                    </button>
                    <button className='bg-gray-200 text-white font-semibold px-6 py-3 rounded-md mt-2'>
                        Learn more
                    </button>
                </div>
            </div>
        </>
    )
}
