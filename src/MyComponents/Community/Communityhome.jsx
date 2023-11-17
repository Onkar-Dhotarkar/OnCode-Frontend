import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import mail from '../../images/micro/mail.png'
import friends from '../../images/micro/friends_theme.png'
import sharepost from '../../images/micro/sharepost.png'
import share from '../../images/micro/share.png'
import toast from 'react-hot-toast'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark'
import like from '../../images/micro/like.png'
import failure from '../../images/micro/failure.png'
import comment from '../../images/micro/comment.png'
import right_arrow from '../../images/micro/right-arrow.png'
import UserNotFound from '../UserNotFound'
import Loader from '../Popups/Others/Loader'
import not from '../../images/micro/not_found.png'
import success from '../../images/micro/success.png'
import bin from '../../images/micro/delete_white.png'
import { useNavigate } from 'react-router-dom'
// import error

export default function Communityhome() {
    const { user, authenticated, setauthLoad } = useContext(AuthContext)
    const [searchVal, setSearchVal] = useState("")
    const [allUsers, getAllUsers] = useState([])
    const [searching, isSearching] = useState(false)
    const [loaded, setLoaded] = useState(false)

    //states for holding community related data
    const [frndreq, setFriendRequests] = useState([])
    const [friendlist, setFriendList] = useState([])
    const [self_questions, set_self_questions] = useState([])
    const [friend_questions, set_friend_questions] = useState([])
    const [tobemapped, setobemapped] = useState([])
    const [tapped, setTapped] = useState(false)
    const navigate = useNavigate("/")

    const fetchMyQuestions = useCallback(async (friendl) => {
        const selfquestionDoc = doc(db, user.useruid, user.useruid + "_userquestions")
        const data = (await (getDoc(selfquestionDoc))).data()
        set_self_questions(data.self_questions)
        setobemapped(self_questions)

        let i = 0
        console.log(friendl.length);
        while (i < friendl.length) {
            const frndDoc = doc(db, friendl[i].id, friendl[i].id + "_userquestions")
            const data = (await getDoc(frndDoc)).data()
            set_friend_questions(prev => [...prev, ...data.self_questions])
            i += 1
        }

    }, [user.useruid, self_questions])

    const checkForFriendRequests = useCallback(async () => {
        const selfDoc = doc(db, user.useruid, user.useruid + "_userdata")
        const data = (await (getDoc(selfDoc))).data()
        setFriendRequests(data.received)
        setFriendList(data.friendlist)
        fetchMyQuestions(data.friendlist)
    }, [setFriendList, setFriendRequests, user.useruid, fetchMyQuestions])

    const accept = async (req) => {
        setauthLoad(30)
        const selfDoc = doc(db, user.useruid, user.useruid + "_userdata")
        const requesterDoc = doc(db, req.requesterId, req.requesterId + "_userdata")
        await updateDoc(selfDoc, {
            friendlist: arrayUnion({
                name: req.requesterName,
                id: req.requesterId,
                profile: req.requesterProfile
            }),
            received: arrayRemove(req)
        }).catch(() => {
            toast.error("Failed to add as friend")
            return
        })

        await updateDoc(requesterDoc, {
            friendlist: arrayUnion({
                name: user.username,
                id: user.useruid,
                profile: user.userprofile
            }),
        }).catch(() => {
            toast.error("Failed to add as friend")
            return
        })

        toast.success(req.requesterName + "is now your friend")
        setauthLoad(100)
    }

    const reject = async (req) => {
        setauthLoad(30)
        const selfDoc = doc(db, user.useruid, user.useruid + "_userdata")
        await updateDoc(selfDoc, {
            received: arrayRemove(req)
        }).catch(() => {
            toast.error("Failed to remove")
            return
        })
        toast.success("Removed the request")
        checkForFriendRequests()
        setauthLoad(100)
    }

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
        checkForFriendRequests()
        setLoaded(true)
        setauthLoad(100)
    }, [])

    return (
        <>
            {!authenticated ? <div className='h-[70vh] flex justify-center items-center'><UserNotFound /></div> : !loaded ? <div className='h-[80vh] flex justify-center items-center'><Loader title={"Waiting for the community"} /></div> : <div className={`maincontainer fade-slide-in flex ${loaded ? "loaded" : ""}`}>

                <div className="left w-[15%] p-4 relative">

                    <div id='notify-sidebar' className="sidebar form-shadow rounded-2xl h- community-notification z-20 absolute top-3 bg-white">
                        <img src={failure} className='w-4 h-4 absolute right-4 top-4 cursor-pointer hover:opacity-50' onClick={() => { document.getElementById("notify-sidebar").classList.toggle("active") }} alt="" />
                        {
                            frndreq.map((req, i) => {
                                return (
                                    <div key={i} className={`flex justify-start items-center gap-2 ${i === 0 ? "mt-10" : "mt-2"}`}>
                                        <div className='w-10 h-10 rounded-full p-[1.2px] border-2 border-[#fb6976]'>
                                            <img src={req.requesterProfile} className='w-full h-full rounded-full object-cover' alt="" />
                                        </div>
                                        <div className="otherdata text-sm font-semibold text-slate-600">
                                            <span className='capitalize'>{req.requesterName}</span> sent you a friend request
                                            <div className="actions text-sm font-semibold text-white flex justify-start items-center gap-2 mt-1">
                                                <button className='bg-[#fb6976] px-3 py-1 rounded-md flex justify-center items-center gap-2' onClick={() => accept(req)}>Accept <img src={success} className="w-4 h-4" alt="" /></button>
                                                <button onClick={() => reject(req)} className='bg-gray-300 px-3 py-1 rounded-md flex justify-center items-center gap-2'>Remove <img src={bin} className='w-4 h-4' alt="" /></button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            frndreq.length === 0 && <div className='text-2xl p-4 h-full text-center flex items-center text-slate-600 font-bold tracking-tight'>No friend requests received 📥</div>
                        }
                    </div>

                    <div className='flex flex-col items-center'>
                        <div className='w-16 h-16 p-[2px] rounded-full border-2 border-[#fb6976]'>
                            <img src={user.userprofile} className='w-full h-full rounded-full object-cover' alt="" />
                        </div>
                        <div className="username text-slate-600 font-semibold capitalize">{user.username}</div>
                        <div className="usermail text-slate-400 text-xs">{user.usermail}</div>
                    </div>
                    <div className="separator bg-gray-100 h-[1px] mt-4"></div>
                    <div className="control text-sm text-slate-600 font-semibold flex flex-col items-center mt-4 gap-1">
                        <button className='flex justify-start items-center gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => {
                            document.getElementById("notify-sidebar").classList.toggle("active")
                        }}>
                            <div className='flex justify-start items-center gap-2'>
                                <img src={friends} className='w-4 h-4' alt="" />
                                Friend requests
                            </div>
                            {frndreq.length > 0 && <div className='mt-[1.5px] text-[#fb6976]'>
                                {frndreq.length}
                            </div>}
                        </button>

                        <button className='flex items-center justify-start gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => { document.getElementById("notify-sidebar").classList.toggle("active") }}>
                            <img src={mail} className='w-4 h-4' alt="" />
                            Notifications
                        </button>
                        <button className='flex items-center justify-start gap-2 w-44 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => navigate("/add-question-to-community")}>
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
                                    if (u.id === user.useruid) {
                                        navigate("/profile")
                                        toast.success("Viewing self profile")
                                        return
                                    }
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
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500' onClick={() => {
                                setobemapped(self_questions)
                                setTapped(true)
                            }}>
                                By You🧑‍💻
                            </span>
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500' onClick={() => {
                                setobemapped(friend_questions)
                                setTapped(true)
                            }}>
                                By your Friends🧑‍🤝‍🧑
                            </span>
                        </div>
                    </div>

                    <div className="timeline mt-3">
                        {tobemapped.map((q) => {
                            return (
                                <div className={`questions bg-[#eee] p-5 rounded-xl mt-2 shadow-sm fade-slide-in ${tapped ? "loaded" : ""}`} >
                                    <div className="about-asker flex justify-start items-center gap-2">
                                        <img src={q.posted_by.profile} className='w-9 h-9 rounded-full object-cover' alt="" />
                                        <div className="other-info text-slate-600 font-bold text-sm">
                                            By {q.posted_by.name.split(" ")[0]}
                                            <div className="time text-xs text-slate-400">
                                                {q.date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="question text-slate-600 font-semibold mt-2">
                                        {q.question_title}
                                    </div>

                                    <div className="uploaded-code-and-issues mt-3">
                                        <SyntaxHighlighter style={atomOneDark} language={q.language} wrapLongLines={true} className="rounded-md p-4">
                                            {q.question_code}
                                        </SyntaxHighlighter>

                                        <div className="error text-sm text-slate-600 font-semibold">
                                            Error / Issue
                                        </div>
                                        <SyntaxHighlighter wrapLongLines={true} language={q.language} className="rounded-md p-4 text-red-400 shadow-md mt-2">
                                            {q.question_error}
                                        </SyntaxHighlighter>
                                    </div>

                                    <div className='flex justify-between items-center px-1'>
                                        <div className="friend_responses text-slate-600 text-sm font-semibold flex justify-start items-center gap-6 px-1">
                                            <button className="like flex justify-start items-center gap-1">
                                                <img src={like} className='w-4 h-4' alt="" />
                                                {q.likes.length} Likes
                                            </button>
                                            <button className="comments flex justify-start items-center gap-1">
                                                <img src={comment} className='w-4 h-4' alt="" />
                                                {q.comments.length} Comments
                                            </button>
                                            <button className="solutions flex justify-start items-center gap-1">
                                                <div>{q.responses.length}</div>
                                                Responses
                                            </button>
                                        </div>
                                        <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 flex justify-center items-center gap-2'>
                                            Add answer<img src={right_arrow} className='w-3 h-3' alt="" /></button>
                                    </div>
                                </div>
                            )
                        })}
                        {
                            tobemapped !== undefined && tobemapped.length === 0 && <div className='w-[97%] text-2xl text-slate-600 font-bold tracking-tight h-[30vh] flex justify-center items-center'>No questions added yet 🥲</div>
                        }
                    </div>
                </div>

                <div className="right text-2xl w-[20%] font-bold tracking-tight text-slate-600 py-4 px-3">
                    Community🧑‍🤝‍🧑
                    <div className="friend-list text-sm font-semibold flex flex-col items-start space-y-2 mt-2 shadow-sm  rounded-xl text-slate-600 mb-3 p-4">
                        {friendlist.map((friend) => {
                            return (
                                <div className='flex justify-start items-center gap-2 cursor-pointer capitalize'><img src={friend.profile} className='w-8 h-8 rounded-full' alt="" />{friend.name}</div>
                            )
                        })}
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
