import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import mail from '../../images/micro/mail.png'
import friends from '../../images/micro/friends_theme.png'
import sharepost from '../../images/micro/sharepost.png'
import share from '../../images/micro/share.png'
import toast from 'react-hot-toast'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark'
import like from '../../images/micro/like.png'
import heart from '../../images/micro/heart.png'
import failure from '../../images/micro/failure.png'
import comment from '../../images/micro/comment.png'
import right_arrow from '../../images/micro/right-arrow.png'
import user_demo_prof from '../../images/micro/user.png'
import UserNotFound from '../UserNotFound'
import Loader from '../Popups/Others/Loader'
import not from '../../images/micro/not_found.png'
import { useNavigate } from 'react-router-dom'
// import error

export default function Communityhome() {
    const { user, authenticated, setauthLoad } = useContext(AuthContext)
    const [searchVal, setSearchVal] = useState("")
    const [allUsers, getAllUsers] = useState([])
    const [searching, isSearching] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate("/")


    const demoCode = `// Intentional error: accessing a property of an undefined variable
let undefinedVariable;
let propertyValue = undefinedVariable.property; // This line will throw a ReferenceError

// The following line will not be executed due to the error above
console.log("This line will not be reached.");
`
    const demoError = `Uncaught ReferenceError: undefinedVariable is not defined
    at <filename>:2:30
`

    const userSearch = async () => {
        getAllUsers([])
        setauthLoad(30)
        isSearching(true)
        const usersCollectionRef = collection(db, "users_id")
        const user_docs = await getDocs(usersCollectionRef)
        user_docs.docs.forEach((doc) => {
            if (doc.data().username.includes(searchVal)) {
                if (!allUsers.includes(doc)) {
                    getAllUsers(prev => ([...prev, { name: doc.data().username, id: doc.data().uid }]))
                }
            }
        })
        setauthLoad(100)
        isSearching(false)
    }

    useEffect(() => {
        setauthLoad(30)
        setTimeout(() => {
            setLoaded(true)
        }, 800);
        setauthLoad(100)
    }, [])

    return (
        <>
            {!authenticated ? <div className='h-[70vh] flex justify-center items-center'><UserNotFound /></div> : !loaded ? <div className='h-[80vh] flex justify-center items-center'><Loader title={"Waiting for the community"} /></div> : <div className={`maincontainer fade-slide-in flex ${loaded ? "loaded" : ""}`}>
                <div className="left w-[15%] p-4">
                    <div className='flex flex-col items-center'>
                        <div className='w-16 h-16 p-[2px] rounded-full border-2 border-[#fb6976]'>
                            <img src={user.userprofile} className='w-full h-full rounded-full object-cover' alt="" />
                        </div>
                        <div className="username text-slate-600 font-semibold capitalize">{user.username}</div>
                        <div className="usermail text-slate-400 text-xs">{user.usermail}</div>
                    </div>
                    <div className="separator bg-gray-100 h-[1px] mt-4"></div>
                    <div className="control text-sm text-slate-600 font-semibold flex flex-col items-center mt-4 gap-1">
                        <button className='flex justify-start items-center gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md'>
                            <img src={friends} className='w-4 h-4' alt="" />
                            Friend requests</button>
                        <button className='flex items-center justify-start gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md'>
                            <img src={mail} className='w-4 h-4' alt="" />
                            Notifications
                        </button>
                        <button className='flex items-center justify-start gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md'>
                            <img src={share} className='w-4 h-4' alt="" />
                            New question
                        </button>
                        <button className='flex items-center justify-start gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md'>
                            <img src={sharepost} className='w-4 h-4' alt="" />
                            Share something
                        </button>
                    </div>
                </div>

                <div className="main p-4 w-[65%]">
                    <input type="text" placeholder='Search for more code mates 🧑‍💻' className='px-2 py-2 rounded-md border-1 border-slate-100 text-sm text-slate-600 w-60' onChange={(e) => {
                        setSearchVal(e.target.value)
                    }} />
                    <button onClick={async () => {
                        const sbtn = document.getElementById('search-btn')
                        if (!searchVal && sbtn.textContent === "Search") {
                            toast.error("Mention name to search")
                            return
                        }
                        // else{}
                        userSearch()
                        document.getElementById("results").classList.add("loaded")
                        document.getElementById("results").classList.remove("pointer-events-none")
                    }}
                        id='search-btn' className='bg-[#fb6976] text-white text-sm font-semibold px-3 py-2 rounded-3xl ml-3'>Search</button>

                    <div id="results" className="searchResults z-30 fade-slide-in form-shadow fixed top-28 bg-white rounded-md mt-2 p-4 h-80 w-[50%] cursor-pointer pointer-events-none">
                        <button className='absolute right-5' onClick={() => {
                            document.getElementById("results").classList.remove("loaded")
                            document.getElementById("results").classList.add("pointer-events-none")
                        }}>
                            <img src={failure} className='w-4 h-4' alt="" />
                        </button>
                        <div className='text-2xl text-slate-600 font-bold mb-2'>
                            Search results for "{searchVal}" 🔎
                        </div>
                        {
                            allUsers.map((u) => {
                                return <div className='wrapper_main capitalize text-slate-600 font-semibold text-base flex justify-start items-center gap-2 transition-all duration-500 hover:bg-gray-100 px-3 py-2 rounded-md border-b border-b-slate-100' onClick={() => {
                                    localStorage.setItem("currentUserToView", u.id)
                                    navigate("/userview")
                                }}>
                                    <div className='w-3 h-3 rounded-full bg-[#fb6976]'></div>
                                    {u.name}
                                </div>
                            })
                        }

                        {
                            allUsers.length === 0 && !searching && <div className='text-xl text-slate-600 font-bold mb-3 flex justify-center items-center gap-2 h-[85%]'>
                                <img src={not} alt="" />
                                No results found ❌
                            </div>
                        }

                        {
                            searching && <div className='h-[85%] flex justify-center items-center'><Loader title={`Searching for ${searchVal}`} /></div>
                        }
                    </div>

                    <div className="mt-3 heading text-2xl font-bold tracking-tight text-slate-600 flex justify-between items-center">
                        Question Feeds➡️
                        <div className="search-question">
                            <input type="text" placeholder='Search for questions in your timeline🔎' className='px-2 py-2 rounded-md border-1 border-slate-100 text-sm w-80 font-normal' />
                        </div>
                        <div className="options text-slate-400 text-sm flex justify-center items-center gap-3 tracking-normal font-semibold">
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500'>
                                By You🧑‍💻
                            </span>
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500'>
                                By your Friends🧑‍🤝‍🧑
                            </span>
                        </div>
                    </div>

                    <div className="timeline mt-3">
                        <div className="questions bg-[#dfebff] p-5 rounded-xl mt-2 shadow-sm">
                            <div className="about-asker flex justify-start items-center gap-2">
                                <img src={user.userprofile} className='w-9 h-9 rounded-full object-cover' alt="" />
                                <div className="other-info text-slate-600 font-bold text-sm">
                                    By you
                                    <div className="time text-xs text-slate-400">
                                        2 days ago
                                    </div>
                                </div>
                            </div>

                            <div className="question text-slate-600 font-semibold mt-2">
                                Hey friends🧑‍🤝‍🧑, I am getting an error in the following program in javascript can someone help with this.I am new at coding so i'm not getting the issue can someone help me with this❓
                            </div>

                            <div className="uploaded-code-and-issues mt-3">
                                <SyntaxHighlighter style={atomOneDark} language="javascript" wrapLongLines={true} className="rounded-md p-4">
                                    {demoCode}
                                </SyntaxHighlighter>

                                <SyntaxHighlighter language="javascript" wrapLongLines={true} className="rounded-md p-4 text-red-400">
                                    {demoError}
                                </SyntaxHighlighter>
                            </div>

                            <div className='flex justify-between items-center px-1'>
                                <div className="friend_responses text-slate-600 text-sm font-semibold flex justify-start items-center gap-6 px-1">
                                    <button className="like flex justify-start items-center gap-1">
                                        <img src={like} className='w-4 h-4' alt="" />
                                        {32} Likes
                                    </button>
                                    <button className="comments flex justify-start items-center gap-1">
                                        <img src={comment} className='w-4 h-4' alt="" />
                                        {23} Comments
                                    </button>
                                    <button className="solutions flex justify-start items-center gap-1">
                                        <div>11</div>
                                        Responses
                                    </button>
                                </div>
                                <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 flex justify-center items-center gap-2'>
                                    Add answer<img src={right_arrow} className='w-3 h-3' alt="" /></button>
                            </div>

                        </div>
                        <div className="questions bg-[#fddada] p-5 rounded-xl mt-2 shadow-sm">
                            <div className="about-asker flex justify-start items-center gap-2">
                                <img src={user.userprofile} className='w-9 h-9 rounded-full object-cover' alt="" />
                                <div className="other-info text-slate-600 font-bold text-sm">
                                    By you
                                    <div className="time text-xs text-slate-400">
                                        2 days ago
                                    </div>
                                </div>
                            </div>

                            <div className="question text-slate-600 font-semibold mt-2">
                                Hey friends🧑‍🤝‍🧑, I am getting an error in the following program in javascript can someone help with this.I am new at coding so i'm not getting the issue can someone help me with this❓
                            </div>

                            <div className="uploaded-code-and-issues mt-3">
                                <SyntaxHighlighter style={atomOneDark} language="javascript" wrapLongLines={true} className="rounded-md p-4">
                                    {demoCode}
                                </SyntaxHighlighter>

                                <SyntaxHighlighter language="javascript" wrapLongLines={true} className="rounded-md p-4 text-red-400">
                                    {demoError}
                                </SyntaxHighlighter>
                            </div>

                            <div className='flex justify-between items-center px-1'>
                                <div className="friend_responses text-slate-600 text-sm font-semibold flex justify-start items-center gap-6 px-1">
                                    <button className="like flex justify-start items-center gap-1">
                                        <img src={like} className='w-4 h-4' alt="" />
                                        {32} Likes
                                    </button>
                                    <button className="comments flex justify-start items-center gap-1">
                                        <img src={comment} className='w-4 h-4' alt="" />
                                        {23} Comments
                                    </button>
                                    <button className="solutions flex justify-start items-center gap-1">
                                        <div>11</div>
                                        Responses
                                    </button>
                                </div>
                                <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 flex justify-center items-center gap-2'>
                                    Add answer<img src={right_arrow} className='w-3 h-3' alt="" /></button>
                            </div>
                        </div>

                        <div className="questions bg-gray-100 p-5 rounded-xl mt-2 shadow-sm">
                            <div className="about-asker flex justify-start items-center gap-2">
                                <img src={user.userprofile} className='w-9 h-9 rounded-full object-cover' alt="" />
                                <div className="other-info text-slate-600 font-bold text-sm">
                                    By you
                                    <div className="time text-xs text-slate-400">
                                        2 days ago
                                    </div>
                                </div>
                            </div>

                            <div className="question text-slate-600 font-semibold mt-2">
                                Hey friends🧑‍🤝‍🧑, I am getting an error in the following program in javascript can someone help with this.I am new at coding so i'm not getting the issue can someone help me with this❓
                            </div>

                            <div className="uploaded-code-and-issues mt-3">
                                <SyntaxHighlighter style={atomOneDark} language="javascript" wrapLongLines={true} className="rounded-md p-4">
                                    {demoCode}
                                </SyntaxHighlighter>

                                <SyntaxHighlighter language="javascript" wrapLongLines={true} className="rounded-md p-4 text-red-400">
                                    {demoError}
                                </SyntaxHighlighter>
                            </div>

                            <div className='flex justify-between items-center px-1'>
                                <div className="friend_responses text-slate-600 text-sm font-semibold flex justify-start items-center gap-6 px-1">
                                    <button className="like flex justify-start items-center gap-1">
                                        <img src={like} className='w-4 h-4' alt="" />
                                        {32} Likes
                                    </button>
                                    <button className="comments flex justify-start items-center gap-1">
                                        <img src={comment} className='w-4 h-4' alt="" />
                                        {23} Comments
                                    </button>
                                    <button className="solutions flex justify-start items-center gap-1">
                                        <div>11</div>
                                        Responses
                                    </button>
                                </div>
                                <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 flex justify-center items-center gap-2'>
                                    Add answer<img src={right_arrow} className='w-3 h-3' alt="" /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right text-2xl w-[20%] font-bold tracking-tight text-slate-600 py-4 px-3">
                    Community🧑‍🤝‍🧑
                    <div className="friend-list text-sm font-semibold flex flex-col items-start space-y-2 mt-2 shadow-sm  rounded-xl text-slate-500 mb-3 p-4">
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Onkar Dhotarkar</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Dnyandeep Gaonkar</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Yash Pawar</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Shivraj Gadekar</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Swayam Verma</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Justin Fernandes</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Atharva Manjrekar</div>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'><img src={user_demo_prof} className='w-7 h-7' alt="" />Sarvesh Kilje</div>
                    </div>
                    Future Plans🚀
                    <div className="text-sm text-gray-500">
                        <div className="groups mt-2 font-semibold text-center p-4 rounded-xl bg-[#fddada]">
                            Adding groups and group interaction features soon🤍
                        </div>
                        <div className="groups mt-2 font-semibold text-center p-4 rounded-xl bg-[#dfebff]">
                            Chat individually with your friends❣️
                        </div>
                    </div>
                </div>
            </div >}
        </>
    )
}
