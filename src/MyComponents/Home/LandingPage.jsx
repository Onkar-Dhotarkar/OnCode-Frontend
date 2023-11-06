import React, { useEffect, useState } from "react"
import Typing from './Typing'
import a1 from '../../images/bgs/abs1.svg'
import a2 from '../../images/bgs/abs4.svg'
import quotation from '../../images/micro/quotation-mark.png'
import link_facebook from '../../images/micro/facebook_link.png'
import link_instagram from '../../images/micro/instagram_link.png'
import link_twitter from '../../images/micro/twitter_link.png'
import right from '../../images/micro/right-arrow.png'
import Features from './Features'
import { Link } from "react-router-dom"
import PlayDemo from "./PlayDemo"
import PlayWebDemo from "./PlayWebDemo"
import Extras from "./Extras"

export default function LandingPage(props) {

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <div className={`${loaded ? 'loaded' : ''} fade-slide-in flex overflow-x-hidden`}>
            <div className={`homeWrapper pt-4 min-h-[516px] mx-auto`}>
                <div className="hometop mt-12 text-center pt-4 pb-8 px-3">
                    <div className="w-[500px] relative mx-auto">
                        <img className='w-[92%] absolute left-[400px] bottom-[-298px] -z-10 opacity-40' src={a1} alt="" />
                        <img className='w-full absolute left-[-340px] bottom-[-500px] -z-10 opacity-60' src={a2} alt="" />
                    </div>
                    <div className='max-w-4xl mx-auto'>
                        <h1 className="text-slate-800 font-bold tracking-tight text-6xl leading-[3.9rem]"> Code Quickly, Easily and Rapidly, also Learn to Code with Folks</h1>
                    </div>
                    <div className="text-animated text-3xl font-semibold mt-4">
                        <span className='text-[#fb6976]'>Stay</span> <Typing />
                    </div>
                    <div className="description-text mx-auto max-w-3xl text-slate-500 mt-6 text-lg font-semibold z-50">
                        "Welcome to our Web-Based programming application 🚀, where you can seamlessly write and store codes in one place 📄. If you crave a simple, convenient, and shareable coding experience, you've found your coding haven! 🌐✨ Elevate your coding journey with excellence and Happy Coding! 💻🎉"
                    </div>
                    <div className="flex max-w-[45rem] mx-auto justify-center items-center mt-4 space-x-5">
                        <Link to='/access-your-work' className="no-underline">
                            <button className="z-50 get-started w-[20rem] py-3 font-semibold background-grad text-white rounded-md flex justify-center items-center gap-2 no-underline">Get Started <img className="w-3 h-3" src={right} alt="" />
                            </button>
                        </Link>

                        <Link to="/create-account" className="no-underline">
                            <button id="sign-up-from-landing-page" className="create-account w-[20rem] py-3 font-semibold text-white bg-gray-300 rounded-md flex justify-center items-center gap-2">Create account
                                <img className="w-3 h-3" src={right} alt="" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className='min-w-[100vw] mt-5 bg-gray-100 px-3 py-4 '>
                    <Features />
                </div>

                <PlayDemo />
                <PlayWebDemo />
                <Extras />

                <div className="user-testimonials mt-24 ">
                    <h2 className="text-center text-gray-900">Testimonials</h2>
                    <div className="testimonial-content max-w-[1200px] mt-8 flex justify-center mx-auto space-x-14 w-[70%]">
                        <div className="testimonial_1 max-w-[55%] bg-gray-100 flex flex-col justify-start space-y-8 px-5 py-4 rounded-lg">
                            <div className="attribute-mark">
                                <img src={quotation} alt="" />
                            </div>
                            <div className="user-review text-slate-900 text-base">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae sint veniam amet quas fugiat nobis, iste mollitia perferendis. Alias facere perspiciatis voluptatem molestiae quaerat veritatis non voluptates? Eum, iure? Omnis.
                            </div>
                            <div className="user-name text-xl font-semibold text-slate-950">
                                User123
                            </div>
                        </div>

                        <div className="testimonial_2 max-w-[55%] bg-gray-100 flex flex-col justify-start space-y-8 px-5 py-4 rounded-lg">
                            <div className="attribute-mark">
                                <img src={quotation} alt="" />
                            </div>
                            <div className="user-review text-slate-900 text-base">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae sint veniam amet quas fugiat nobis, iste mollitia perferendis. Alias facere perspiciatis voluptatem molestiae quaerat veritatis non voluptates? Eum, iure? Omnis.
                            </div>
                            <div className="user-name text-xl font-semibold text-slate-950">
                                User456
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footerpart w-[70%] flex justify-between items-baseline mx-auto mt-14">
                    <div className="footer-name-copyright flex items-center text-gray-400">
                        <h4 className="text-slate
                        -600">OnCode</h4>
                        <hr className="border border-none w-[0.2rem] h-11 bg-gray-400 mx-4" />
                        &copy; Copyright 2023 OnCode
                    </div>
                    <div className="flex items-center space-x-3">
                        <a href="prof1" target="blank"><img className="w-5" src={link_facebook} alt="" /></a>
                        <a href="prof2"><img className="w-5" src={link_instagram} alt="" /></a>
                        <a href="prof3"><img className="w-5" src={link_twitter} alt="" /></a>
                    </div>
                </div>
            </div >
        </div>
    )
}

