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
                <div className="hometop mt-12 text-center pt-4 pb-8">
                    <div className="w-[500px] relative mx-auto">
                        <img className='w-[92%] absolute left-[400px] bottom-[-298px] -z-10 opacity-40' src={a1} alt="" />
                        <img className='w-full absolute left-[-340px] bottom-[-500px] -z-10 opacity-60' src={a2} alt="" />
                    </div>
                    <div className='max-w-4xl text-center mx-auto max-[500px]:max-w-sm'>
                        <h1 className="text-slate-800 font-bold tracking-tight text-6xl leading-[3.9rem] max-[500px]:text-5xl"> Code Quickly, Easily and Rapidly, also Learn to Code with Folks</h1>
                    </div>
                    <div className="text-animated text-3xl font-semibold mt-4 max-[500px]:text-xl">
                        <span className='text-[#fb6976]'>Stay</span> <Typing />
                    </div>
                    <div className="description-text mx-auto font-semibold max-w-3xl text-slate-500 mt-6 text-base z-50 max-[500px]:text-xs text-center">
                        "Welcome to our Web-Based programming application 🚀, where you can seamlessly write and store codes in one place 📄. If you crave a simple, convenient, and shareable coding experience, you've found your coding haven! 🌐✨ Elevate your coding journey with excellence and Happy Coding! 💻🎉"
                    </div>
                    <div className="flex max-w-[45rem] mx-auto justify-center items-center mt-4 max-[700px]:flex-col gap-3">
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

                <div className='mt-5 bg-gray-100 py-4'>
                    <Features />
                </div>

                <PlayDemo />
                <PlayWebDemo />
                <Extras />

                <div className="user-testimonials mt-24 ">
                    <h2 className="text-center text-gray-900">Testimonials</h2>
                    <div className="testimonial-content  mt-8 flex justify-center mx-auto space-x-14 w-[80%]">
                        <div className="testimonial_1 bg-gray-100 flex flex-col justify-start space-y-8 px-5 py-4 rounded-lg">
                            <div className="attribute-mark">
                                <img src={quotation} alt="" />
                            </div>
                            <div className="user-review text-slate-600 text-xs font-semibold">
                                Discovering this app has been a revelation for my coding journey. The community engagement is unparalleled, creating an environment that fosters collaboration and learning. Connecting with fellow coders has never been this seamless, and the "Doubt Resolution" feature is a lifesaver. Whether you're a novice seeking guidance or a seasoned coder looking to share expertise, this app has it all. The intuitive interface makes navigation a joy, and the wealth of learning opportunities is unmatched. While the absence of a "remove friend" feature is a minor drawback, the overall experience makes this app a must-have for anyone serious about coding. It's become my daily go-to for inspiration, collaboration, and skill enhancement. Kudos to the developers for creating a hub of coding brilliance. 👏👨‍💻 #CodingCommunity #AppExcellence
                            </div>
                            <div className="user-name text-xl font-semibold text-slate-700">
                                Shivraj Gadekar - school friend of us
                            </div>
                        </div>

                        <div className="testimonial_2 bg-gray-100 flex flex-col justify-start space-y-8 px-5 py-4 rounded-lg">
                            <div className="attribute-mark">
                                <img src={quotation} alt="" />
                            </div>
                            <div className="user-review text-slate-600 text-xs font-semibold">
                                This app is a social network tailored for those immersed in the world of code. The platform excels in fostering a sense of community among users, allowing for the exchange of ideas and solutions. The "Doubt Resolution" feature is a standout, providing a space for users to seek and provide assistance. The app's interface is user-friendly, making it easy to navigate and participate in discussions. While it's a fantastic space for connecting with like-minded individuals, the absence of a "remove friend" feature is a notable limitation. Managing connections could be more intuitive. Nevertheless, the app stands out as a valuable resource for networking, collaboration, and continuous learning in the coding realm
                            </div>
                            <div className="user-name text-xl font-semibold text-slate-700">
                                Rugved Nage - school friend, now studying cs
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

