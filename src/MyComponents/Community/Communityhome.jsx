import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import friends from '../../images/micro/friends_theme.png'
import sharepost from '../../images/micro/sharepost.png'
import share from '../../images/micro/share.png'
import toast from 'react-hot-toast'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark'
import failure from '../../images/micro/failure.png'
import right_arrow from '../../images/micro/right-arrow.png'
import { Modal, ModalBody } from 'reactstrap'
import UserNotFound from '../UserNotFound'
import Loader from '../Popups/Others/Loader'
import not from '../../images/micro/not_found.png'
import success from '../../images/micro/success.png'
import bin from '../../images/micro/delete_white.png'
import user_img from '../../images/micro/user-profile.png'
import nores from '../../images/micro/nores.jpg'
import view from '../../images/micro/view.png'
import { useNavigate } from 'react-router-dom'
import community_loader from '../../images/bgs/community_loader.png'
import AceEditor from 'react-ace'
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
    const [responsePopup, setResponsePopup] = useState(false)
    const [answer, setAnswer] = useState("")
    const [answerCode, setAnswerCode] = useState("")
    const [adding, setAdding] = useState(false)
    const [responses, showResponses] = useState(false)
    const [responsesToMap, setResponsesToMap] = useState([])
    const [shareSomething, setShareSomething] = useState(false)
    const [communityPosts, setCommunityPostMsg] = useState('')
    const [posts, seePosts] = useState(false)

    const [selfpost, setselfpost] = useState([])
    const [friendpost, setfriendpost] = useState([])
    const [frndsPopup, seeFriendsPopup] = useState(false)
    const navigate = useNavigate("/")

    const fetchMyQuestions = useCallback(async (friendl) => {
        const selfquestionDoc = doc(db, user.useruid, user.useruid + "_userquestions")
        const data = (await (getDoc(selfquestionDoc))).data()
        set_self_questions(data.self_questions)
        setobemapped(data.self_questions)
        setselfpost(data.posts)

        let i = 0
        while (i < friendl.length) {
            const frndDoc = doc(db, friendl[i].id, friendl[i].id + "_userquestions")
            const data = (await getDoc(frndDoc)).data()
            set_friend_questions(prev => [...prev, ...data.self_questions])
            setfriendpost(prev => [...prev, ...data.posts])
            i += 1
        }

    }, [user.useruid])

    const checkForFriendRequests = useCallback(async () => {
        try {
            const selfDoc = doc(db, user.useruid, user.useruid + "_userdata")
            const data = (await (getDoc(selfDoc))).data()
            setFriendRequests(data.received)
            setFriendList(data.friendlist)
            await fetchMyQuestions(data.friendlist)
        } catch (e) {
            // console.log(e);
        }
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
                    getAllUsers(prev => ([...prev, { name: doc.data().username, id: doc.data().uid, profile: doc.data().profile }]))
                }
            }
        })
        setauthLoad(100)
        isSearching(false)
    }

    const addResponse = async () => {
        setauthLoad(30)
        setAdding(true)
        const docToUpdate = doc(db, localStorage.getItem("poster_id"), localStorage.getItem("poster_id") + "_userquestions")
        friend_questions[parseInt(localStorage.getItem("answer_sr"))].responses.push({
            responder: {
                name: user.username,
                id: user.useruid,
                profile: user.userprofile
            },
            answerDescription: answer,
            answerCode: answerCode,
            date: new Date().toDateString()
        })
        await updateDoc(docToUpdate, {
            self_questions: friend_questions
        }).then(() => {
            toast.success("Response added successfully")
            setauthLoad(100)
        }).catch(() => {
            toast.error("Response failed")
            setauthLoad(100)
        })
        setAdding(false)
        setResponsePopup(false)
    }

    useEffect(() => {
        setauthLoad(30)
        checkForFriendRequests()
        const timeout = setTimeout(() => {
            setLoaded(true)
        }, 900)
        const timeout2 = setTimeout(() => {
            setTapped(true)
        }, 1000)
        setauthLoad(100)

        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout2)
        }
    }, [])

    return (
        <>
            <Modal isOpen={responsePopup} toggle={() => setResponsePopup(!responsePopup)} size='lg'>
                <ModalBody className='p-5 text-slate-600 text-center'>
                    {!adding ? <div>
                        <div className="heading text-2xl font-bold tracking-tight text-center">
                            Add response to this question ➡️
                        </div>
                        <div className="response w-full">
                            <div className="answer-title flex flex-col items-start px-2 text-start gap-2 text-slate-600 font-semibold">
                                <span className='mx-2 mt-3'>Add your answer in a clear and understandable way 👍</span>
                                <textarea onChange={(e) => { setAnswer(e.target.value) }} placeholder='Write your explanantion here in a understandable way' className="resize-y border-1 border-slate-100 outline-none p-3 rounded-2xl shadow-sm text-sm w-full" />
                            </div>
                            <div className="question-answer flex flex-col  items-start px-2 text-start gap-2 text-slate-600 font-semibold mt-4">
                                <span className='mx-2'>Add your solution for this problem</span>
                                <AceEditor
                                    className='scrollbar scrollbar-thumb-[#fb6976] shadow-sm'
                                    placeholder="Solution here"
                                    fontSize={14}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    mode={localStorage.getItem("response_lang")}
                                    theme='dracula'
                                    style={{ height: "10rem", width: "calc(100%)", borderRadius: "10.5px" }}
                                    wrapEnabled={true}
                                    setOptions={{
                                        useWorker: false,
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        wrap: true
                                    }}
                                    onChange={(value) => { setAnswerCode(value) }}
                                    onPaste={(value) => { setAnswerCode(value) }}
                                />
                            </div>
                            <button className='bg-[#fb6976] text-white px-4 py-2 rounded-md mt-4 text-sm font-semibold' onClick={addResponse}>
                                Add response
                            </button>
                        </div>
                    </div> : <div className='w-full h-[50vh] flex justify-center items-center'><Loader title={"Adding response"} /></div>}
                </ModalBody>
            </Modal>

            <Modal isOpen={responses} toggle={() => showResponses(!responses)} size='lg'>
                <ModalBody className='p-5 text-slate-600 overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-[#e2e0e0] scrollbar-track-slate-100  max-h-[36rem]'>
                    <div className="heading text-2xl font-bold tracking-tight text-center">
                        Solutions for your doubts ✅
                    </div>
                    {responsesToMap.map((response) => {
                        return (
                            <div className='about-responder mt-3'>
                                <div className='user flex justify-start items-center gap-2 text-sm font-semibold capitalize'>
                                    <img src={response.responder.profile} className='w-8 h-8 rounded-full' alt="" />
                                    {response.responder.name}
                                </div>
                                <div className='text-xs text-slate-500 mt-2'>{response.date}</div>
                                <div className="solution text-sm font-semibold mt-2">
                                    {response.answerDescription}
                                    <SyntaxHighlighter customStyle={{ fontWeight: "normal", borderRadius: "6px", marginTop: "15px" }} style={atomOneDark}>{response.answerCode}</SyntaxHighlighter>
                                </div>
                                <div className="separator h-[2px] w-full bg-[#eee] mt-3">

                                </div>
                            </div>
                        )
                    })}
                </ModalBody>
            </Modal>

            <Modal isOpen={shareSomething} toggle={() => setShareSomething(!shareSomething)}>
                <ModalBody className='p-5 text-slate-600'>
                    <div className="heading text-2xl font-bold tracking-tight text-center">
                        Add a community post and share something ⬆️
                    </div>
                    <div className='text-center'>
                        <textarea className='resize-y border-1 border-slate-100 outline-none p-3 rounded-2xl shadow-sm text-sm w-full mt-2' placeholder='Share what you want to share with others' onChange={(e) => setCommunityPostMsg(e.target.value)} />
                        <button onClick={async () => {
                            setauthLoad(30)
                            if (!communityPosts) {
                                toast.error("Add a messgae to share with community")
                                setauthLoad(100)
                                return
                            }
                            const selfdoc = doc(db, user.useruid, user.useruid + "_userquestions")
                            const postStructure = {
                                posted_by: {
                                    id: user.useruid,
                                    name: user.username,
                                    profile: user.userprofile
                                },
                                post_content: communityPosts,
                                date: new Date().toDateString()
                            }
                            await updateDoc(selfdoc, {
                                posts: arrayUnion(postStructure)
                            }).then(() => {
                                toast.success("Post added successfully")
                            }).catch(() => {
                                toast.error("Failed to add post")
                            })
                            setauthLoad(100)
                            setShareSomething(false)
                        }} className='bg-[#fb6976] text-sm font-semibold px-4 py-2 rounded-md mt-2 text-white'>Share with others +</button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={posts} toggle={() => seePosts(!posts)} size='lg'>
                <ModalBody className='p-5 text-slate-600 overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-[#e2e0e0] scrollbar-track-slate-100 max-h-[36rem]'>
                    <div className="heading text-2xl font-bold tracking-tight text-center">
                        View posts in your community 📬
                    </div>
                    <div className="posts">
                        <div className="text-sm font-semibold mt-5 text-center">
                            Posted by you in community ➡️
                            {
                                selfpost && selfpost.map((post) => {
                                    return (<div className='about-responder mt-3 text-center'>
                                        <div className='user flex justify-center items-center gap-2 text-sm font-semibold capitalize'>
                                            <img src={post.posted_by.profile} className='w-8 h-8 rounded-full object-cover' alt="" />
                                            {post.posted_by.name}
                                            <div className="date text-xs text-slate-500 mt-1">
                                                {post.date}
                                            </div>
                                        </div>

                                        <div className="post-content text-sm mt-2 font-semibold">
                                            {post.post_content}
                                        </div>
                                    </div>)
                                })
                            }
                            {selfpost.length === 0 && <div className='text-slate-500 text-xs mt-1'>No posts added by you</div>}
                            <div className='mt-3'>
                                Posted by your friends ✌️
                                {

                                    friendpost.map((post) => {
                                        return (<div className='about-responder mt-5 text-center'>
                                            <div className='user flex justify-center items-center gap-2 text-sm font-semibold capitalize'>
                                                <img src={post.posted_by.profile} className='w-8 h-8 rounded-full object-cover' alt="" />
                                                {post.posted_by.name}
                                                <div className="date text-xs text-slate-500 mt-1">
                                                    {post.date}
                                                </div>
                                            </div>

                                            <div className="post-content text-sm mt-2 font-semibold">
                                                {post.post_content}
                                            </div>
                                        </div>)
                                    })
                                }
                                {friendpost.length === 0 && <div className='text-slate-500 text-xs mt-1'>No posts added by your friends</div>}
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={frndsPopup} toggle={() => seeFriendsPopup(!frndsPopup)}>
                <ModalBody className='p-5'>
                    <div className="head text-2xl font-bold tracking-tight text-slate-600">
                        See your all friends ✅
                    </div>
                    <div className="map-friends mt-4">
                        {friendlist.map((frnd) => {
                            return (
                                <div className='flex justify-between mx-2 items-center'>
                                    <div className='flex justify-start items-center text-sm font-semibold text-slate-600 gap-3 cursor-pointer capitalize'><img src={frnd.profile} className='w-8 h-8 rounded-full object-cover' alt="" />{frnd.name}</div>
                                    <button className="see bg-[#fb6976] text-xs font-semibold text-white px-3 py-[0.37rem] rounded-md flex justify-center gap-2 items-center" onClick={() => {
                                        localStorage.setItem("currentUserToView", frnd.id)
                                        if (frnd.id === user.useruid) {
                                            navigate("/profile")
                                            toast.success("Viewing self profile")
                                            return
                                        }
                                        navigate("/userview")
                                    }}>
                                        Go to profile
                                        <img src={right_arrow} className='w-3 h-3' alt="" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>

            {!authenticated ? <div className='h-[70vh] flex justify-center items-center '><UserNotFound /></div> : !loaded ? <div className={`h-[80vh] flex flex-col justify-center items-center fade-slide-in ${loaded ? "" : "loaded"}`}>
                <img src={community_loader} className='w-44' alt="" />
                <div className='text-center text-xl mt-3 font-semibold text-slate-600'>Waiting for the resources ⏸️</div>
            </div> : <div className={`maincontainer fade-slide-in flex ${loaded ? "loaded" : ""} overflow-hidden`}>
                <div className="left h-[calc(100vh-100px)] w-[18%] p-4 relative">
                    <div id='notify-sidebar' className="sidebar form-shadow community-notification top-0 left-0 z-20 absolute bg-white">
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
                        <button className='flex justify-start items-center gap-2 w-52 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => {
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
                        <button className='flex items-center justify-start gap-2 w-52 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => navigate("/add-question-to-community")}>
                            <img src={share} className='w-4 h-4' alt="" />
                            New question
                        </button>

                        <button className='flex items-center justify-start gap-2 w-52 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => setShareSomething(true)}>
                            <img src={sharepost} className='w-4 h-4' alt="" />
                            Share something
                        </button>

                        <button className='flex items-center justify-start gap-2 w-52 hover:bg-[#eee] transition-all duration-500 px-3 py-2 rounded-md' onClick={() => seePosts(true)}>
                            <img src={view} className='w-4 h-4' alt="" />
                            View community posts
                        </button>
                    </div>
                </div>

                <div className="main pt-4 w-[65%] h-[calc(100vh-50px)] overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-[#e2e0e0] scrollbar-track-slate-100">
                    <input type="text" placeholder='Search for more code mates 🧑‍💻' className='px-2 py-2 rounded-md border-1 border-slate-100 text-sm text-slate-600 w-60 shadow-sm' onKeyDown={(e) => {
                        if (e.key === "Enter" && searchVal !== null) {
                            userSearch()
                            document.getElementById("results").classList.add("loaded")
                            document.getElementById("results").classList.remove("pointer-events-none")
                        }
                    }} onChange={(e) => {
                        setSearchVal(e.target.value)
                    }} />
                    <button onClick={async () => {
                        if (!searchVal) {
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
                            <img src={failure} className='w-4 h-4 transition-all duration-300 hover:opacity-50' alt="" />
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
                                    <img src={u.profile !== null ? u.profile : user_img} className='w-8 h-8 rounded-full' alt="" />
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

                    <div className="mt-3 heading text-2xl font-bold tracking-tight text-slate-600 flex justify-start gap-4 items-center">
                        Question Feeds➡️
                        <div className="options text-slate-400 text-sm flex justify-center items-center gap-3 tracking-normal font-semibold">
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500' onClick={() => {
                                setobemapped(self_questions)
                            }}>
                                By You🧑‍💻
                            </span>
                            <span className='cursor-pointer hover:text-slate-700 transition-all duration-500' onClick={() => {
                                setobemapped(friend_questions)
                            }}>
                                By your Friends🧑‍🤝‍🧑
                            </span>
                        </div>
                    </div>

                    <div className="timeline mt-3 rounded-xl ">
                        {tobemapped.map((q, i) => {
                            return (
                                <div className={`questions bg-[#eee] p-5 mb-2 rounded-sm shadow-sm fade-slide-in ${tapped ? "loaded" : ""}`} >
                                    <div className="about-asker flex justify-start items-center gap-2">
                                        <img src={q.posted_by.profile} className='w-9 h-9 rounded-full object-cover' alt="" />
                                        <div className="other-info text-slate-600 font-bold text-sm">
                                            By {q.posted_by.name.split(" ")[0]}
                                            <div className="time text-xs font-normal text-slate-400">
                                                {q.date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="question text-slate-600 font-semibold mt-2 capitalize">
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
                                            <button className="solutions flex justify-start items-center gap-1" >
                                                <div>{q.responses.length}</div>
                                                Responses
                                            </button>
                                        </div>
                                        {q.posted_by.id !== user.useruid ? <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 flex justify-center items-center gap-2' onClick={() => {
                                            setResponsePopup(true)
                                            localStorage.setItem("response_lang", q.question_language)
                                            localStorage.setItem("poster_id", q.posted_by.id)
                                            localStorage.setItem("answer_sr", i)
                                        }}>
                                            Add response<img src={right_arrow} className='w-3 h-3' alt="" />
                                        </button> : <button className='text-white font-semibold text-sm bg-[#fb6976] rounded-md px-3 py-2 ' onClick={() => {
                                            if (q.responses.length === 0) {
                                                toast.success("No responses yet to show")
                                                return
                                            }
                                            setResponsesToMap(q.responses)
                                            showResponses(true)
                                        }}>Show responses</button>}
                                    </div>
                                </div>
                            )
                        })}
                        {
                            tobemapped !== undefined && tobemapped.length === 0 && <div className='w-[97%] mt-10 text-2xl text-slate-600 font-bold tracking-tight h-[30vh] flex flex-col justify-center items-center'><div><img src={nores} className='w-44' alt='' /></div>No questions found 🔍</div>
                        }
                    </div>
                </div>

                <div className="right text-2xl text-center w-[20%] font-bold tracking-tight text-slate-600 py-4 px-3">
                    Community🧑‍🤝‍🧑
                    <div className="friend-list text-sm font-semibold flex flex-col justify-center items-center gap-2 mt-4 rounded-xl text-slate-600 mb-3">
                        {friendlist.map((friend, i) => {
                            return (
                                i < 5 && <div className='flex justify-start items-center gap-2 cursor-pointer capitalize'><img src={friend.profile} className='w-8 h-8 rounded-full object-cover' alt="" />{friend.name}</div>
                            )
                        })}
                        {
                            friendlist.length === 0 ? <div className='text-slate-600 font-semibold text-sm tracking-normal ml-1'>No friends added yet</div> : <button onClick={() => { seeFriendsPopup(true) }} className=' text-[#fb6976] py-2 rounded-md mt-2'>
                                See all friends
                            </button>
                        }
                    </div>
                </div>
            </div >}
        </>
    )
}
