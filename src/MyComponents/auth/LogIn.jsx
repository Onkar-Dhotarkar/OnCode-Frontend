import React, { useContext, useEffect, useState } from 'react'
import google from '../../images/micro/google.png'
import facebook from '../../images/micro/facebook.png'
import eye from '../../images/micro/eye.png'
import { AuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { auth } from '../Firebase/Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import login from '../../images/micro/login.png'

export default function Login() {
    const [loaded, setLoaded] = useState(false)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate('')
    const { setauthLoad, user } = useContext(AuthContext)
    const [signInState, setSignInState] = useState({
        email: "",
        password: "",
    })

    useEffect(() => {
        setauthLoad(30)
        setTimeout(() => {
            setLoaded(true)
            setauthLoad(100)
        }, 1000)
    }, [setauthLoad])

    function validateInput() {
        Array.from(document.getElementsByTagName('input')).forEach((element) => {
            if (!element.value) {
                element.style.backgroundColor = '#f8d7da'
            } else {
                element.style.backgroundColor = '#d1e7dd'
            }
        })
    }

    function finalValidation() {
        if (!signInState.email || !signInState.password) {
            toast.error("Mention all required fields!")
            return false
        } else if (signInState.password.length < 6) {
            toast.error("Password should be atleat 6 characters!")
            return false
        }
        return true
    }

    async function signInAccount() {
        if (finalValidation()) {
            try {
                setCreating(true)
                await signInWithEmailAndPassword(auth, signInState.email, signInState.password)
                setCreating(false)
                toast.success("Resume your coding journey")
                navigate("/")
            } catch (e) {
                toast.error(e.message.split("/")[1].split(")")[0])
                setCreating(false)
            }
        }
    }

    return (
        <div className={`${loaded ? 'loaded' : ''} flex justify-center min-h-[82vh] my-4 items-center fade-slide-in `}>
            <div className='container_main w-[39%]'>
                <div className="heading text-2xl font-semibold text-slate-700 tracking-tight flex flex-col justify-start items-center gap-2">
                    <img src={login} className='w-8 h-8 mt-1' alt="" />
                    Sign into your account
                </div>
                <div className="message text-center text-slate-400 mt-2 mb-4 text-sm">
                    Welcome back coding enthusiast, hope you will take this  journey of coding to your desired destination
                </div>


                <div className='form-shadow shadow-slate-50 w-full px-5 py-5 rounded-lg mt-4'>
                    <div onChange={validateInput}>
                        <div class="mb-4">
                            <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
                            <input type="email" id="email" class="mt-1 block w-full rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='Email address' onChange={(e) => {
                                setSignInState({ ...signInState, email: e.target.value })
                            }} />
                        </div>
                        <div class="mb-4 relative">
                            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" id="password" class="mt-1 block w-full rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='Must be 6 characters' onChange={(e) => {
                                setSignInState({ ...signInState, password: e.target.value })
                            }} />
                            <i><img className='w-4 h-4 absolute right-4 top-9 cursor-pointer' src={eye} alt="" onClick={() => {
                                let password = document.getElementById("password");
                                if (password.type === "password") {
                                    password.type = "text"
                                    return
                                }
                                password.type = "password"

                            }} /></i>
                        </div>
                    </div>

                    <button className={`w-full text-white py-[0.62rem] rounded-md text-sm font-semibold mt-2 ${creating ? 'bg-gray-300 cursor-not-allowed' : 'background-grad'}`} onClick={signInAccount}>{creating ? 'Signing in' : 'Sign into Account'}</button>
                    <div className="separator flex text-slate-600 text-sm items-center gap-3 justify-center mt-4">
                        <div className='w-32 h-[0.6px] bg-slate-200'></div>
                        or countinue with
                        <div className='w-32 h-[0.6px] bg-slate-200'></div>
                    </div>
                    <div className='flex gap-2'>
                        <button class="w-full border border-slate-200 text-slate-800 py-[0.62rem] rounded-md text-sm font-semibold flex justify-center items-center gap-2 mt-4">
                            <img src={google} className='w-4 h-4' alt="" />
                            Sign in with google
                        </button>
                        <button class="w-full border border-slate-200 text-slate-800 py-[0.62rem] rounded-md text-sm font-semibold flex justify-center items-center gap-2 mt-4">
                            <img src={facebook} className='w-4 h-4' alt="" />
                            Sign in with facebook
                        </button>
                    </div>
                </div>

                <div className='mt-3 text-sm text-center text-slate-400'>
                    Didn't have an account ? <Link to="/create-account" className='text-[#fb6976] no-underline'>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

