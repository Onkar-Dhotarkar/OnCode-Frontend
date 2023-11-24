import React, { useContext, useEffect, useState } from 'react'
import google from '../../images/micro/google.png'
import facebook from '../../images/micro/facebook.png'
import signup from '../../images/micro/signup.png'
import eye from '../../images/micro/eye.png'
import { AuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { auth, db } from '../Firebase/Firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { collection, doc, setDoc } from 'firebase/firestore'

export default function SignUp() {
    const [loaded, setLoaded] = useState(false)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate('')
    const { setauthLoad, user } = useContext(AuthContext)
    const [signupState, setsignupState] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirm: ""
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
        if (!signupState.email || !signupState.password || !signupState.password_confirm || !signupState.firstname || !signupState.lastname) {
            toast.error("Mention all required fields!")
            return false
        } else if (signupState.password.length < 6) {
            toast.error("Password should be atleat 6 characters!")
            return false
        } else if (signupState.password !== signupState.password_confirm) {
            toast.error("Passwords do not match!")
            return false
        }
        return true
    }

    async function createUserDbStructure() {
        let collectionRef = collection(db, auth.currentUser.uid)
        let userRef = collection(db, "users_id")
        let docsToAddonSignup = [{
            username: signupState.firstname + " " + signupState.lastname,
            email: signupState.email,
            country: "",
            oneliner: "",
            description: "",
            profile_pic: "",
            skills: [],
            friendlist: [],
            received: [],
            sent: []
        }, {
            codes: [],
            commands: [],
            webpages: []
        }, {
            self_questions: [],
        }]

        let docNames = [auth.currentUser.uid + "_userdata", auth.currentUser.uid + "_usercodes", auth.currentUser.uid + "_userquestions"]
        let i = 0;
        docsToAddonSignup.forEach((document) => {
            const docRef = doc(collectionRef, docNames[i])
            setDoc(docRef, document)
            i += 1
        })

        //creating entry into the users collection for iterating later
        const userDocRef = doc(userRef, auth.currentUser.uid)
        setDoc(userDocRef, {
            username: signupState.firstname + " " + signupState.lastname,
            uid: auth.currentUser.uid,
            profile: auth.currentUser.photoURL
        })
    }

    async function createUserAccount() {
        if (finalValidation()) {
            try {
                setCreating(true)
                await createUserWithEmailAndPassword(auth, signupState.email, signupState.password)
                sendEmailVerification(auth.currentUser).then(async () => {
                    toast.success("Email validated")
                    await updateProfile(auth.currentUser, {
                        displayName: signupState.firstname + " " + signupState.lastname
                    })
                })
                await createUserDbStructure()
                setCreating(false)
                toast.success("Begin your coding journey " + user.username)
                navigate("/")
            } catch (e) {
                toast.error(e.message.split("/")[1].split(")")[0])
                setCreating(false)
            }
        }
    }

    return (
        <div className={`${loaded ? 'loaded' : ''} flex justify-center min-h-[95vh] items-center fade-slide-in `}>
            <div className='container_main px-5 pt-2 pb-8 rounded-xl my-4'>
                <div className="heading text-2xl font-semibold text-slate-700 tracking-tight flex flex-col justify-start mt items-center gap-2 px-20">
                    <img src={signup} className='w-8 h-8 mt-1' alt="" />
                    Sign up and Create your Account
                </div>
                <div className="message text-center text-slate-400 px-1 mt-2 mb-4 text-sm">
                    Embark on a coding journey with us, where learning and practice lead to endless possibilities in the world  <br />  of coding and learning
                </div>
                <div className='form-shadow px-5 pt-1 pb-10 rounded-lg mt-4'>
                    <div onChange={validateInput}>
                        <div class="mt-8 mb-4 flex gap-2">
                            <div className='w-full'>
                                <label for="fname" class="block text-sm font-medium text-slate-700">First Name</label>
                                <input type="text" id="fname" class="mt-1 block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='First name' onChange={(e) => {
                                    setsignupState({ ...signupState, firstname: e.target.value })
                                }} />
                            </div>
                            <div className='w-full'>
                                <label for="lname" class="block text-sm font-medium text-slate-700">Last Name</label>
                                <input type="text" id="lname" class="mt-1 block w-full rounded-md shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='Last name' onChange={(e) => {
                                    setsignupState({ ...signupState, lastname: e.target.value })
                                }} />
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
                            <input type="email" id="email" class="mt-1 block w-full rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='Email address' onChange={(e) => {
                                setsignupState({ ...signupState, email: e.target.value })
                            }} />
                        </div>
                        <div class="mb-4 relative">
                            <label for="password" class="block text-sm font-medium text-slate-700">Create password</label>
                            <input type="password" id="password" class="mt-1 block w-full rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2" placeholder='Must be 6 characters' onChange={(e) => {
                                setsignupState({ ...signupState, password: e.target.value })
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
                        <div class="mb-4 relative">
                            <label for="password_confirm" class="block text-sm font-medium text-slate-700">Confirm password</label>
                            <input type="password" id="password_confirm" class="mt-1 block w-full rounded-md shadow-sm  text-slate-500 text-sm py-2 px-2" placeholder='Must be 6 characters' onChange={(e) => {
                                setsignupState({ ...signupState, password_confirm: e.target.value })
                            }} />
                            <i><img className='w-4 h-4 absolute right-4 top-9 cursor-pointer' src={eye} alt="" onClick={() => {
                                let password_confirm = document.getElementById("password_confirm");
                                if (password_confirm.type === "password") {
                                    password_confirm.type = "text"
                                    return
                                }
                                password_confirm.type = "password"

                            }} /></i>
                        </div>
                    </div>

                    <button className={`w-full text-white py-[0.62rem] rounded-md text-sm font-semibold mt-2 ${creating ? 'bg-gray-300 cursor-not-allowed' : 'background-grad'}`} onClick={createUserAccount}>{creating ? 'Creating Account' : 'Create Account'}</button>
                    <div className="separator flex text-slate-500 text-sm items-center gap-3 justify-center mt-4">
                        <div className='w-32 h-[0.6px] bg-slate-200'></div>
                        or countinue with
                        <div className='w-32 h-[0.6px] bg-slate-200'></div>
                    </div>
                    <div className='flex gap-2'>
                        <button class="w-full border border-slate-200 text-slate-800 py-[0.62rem] rounded-md text-sm font-semibold flex justify-center items-center gap-2 mt-4">
                            <img src={google} className='w-4 h-4' alt="" />
                            Sign up with google
                        </button>
                        <button class="w-full border border-slate-200 text-slate-800 py-[0.62rem] rounded-md text-sm font-semibold flex justify-center items-center gap-2 mt-4">
                            <img src={facebook} className='w-4 h-4' alt="" />
                            Sign up with facebook
                        </button>
                    </div>
                </div>
                <div className='mt-3 text-sm text-center text-slate-400'>
                    Already have an account ? <Link to="/log-into-account" className='text-[#fb6976] no-underline'>Login</Link>
                </div>
            </div>

        </div>
    )
}
