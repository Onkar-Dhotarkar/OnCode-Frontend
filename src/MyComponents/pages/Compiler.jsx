import React, { useEffect, useState, useRef, useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import AceEditor from 'react-ace'
import exit from '../../images/micro/roomexit.png'
import endcall from '../../images/micro/endcall.png'
import chat from '../../images/micro/chat.png'
import failure from '../../images/micro/failure.png'
import mail from '../../images/micro/mail.png'
import right from '../../images/micro/right-arrow.png'
import hamburger from '../../images/micro/hamburger.png'
import copy from '../../images/micro/copy-white.png'
import play from '../../images/micro/play.png'
import play_dark from '../../images/micro/play_dark.png'
import sun from '../../images/micro/light.png'
import sun_dark from '../../images/micro/sun-dark.png'
import save from '../../images/micro/upload.png'
import save_dark from '../../images/micro/upload_dark.png'
import { Modal, ModalBody } from 'reactstrap'
import { v4 } from 'uuid'
import toast from 'react-hot-toast';
import { initSocket } from '../../socket'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Runner from '../Popups/Others/Runner'
import c from '../../images/bgs/c.png'
import python from '../../images/bgs/python.png'
import cpp from '../../images/bgs/cpp.png'
import java from '../../images/bgs/java.png'
import js from '../../images/bgs/js.png'

import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/theme-xcode"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-csharp"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-python"

import UserNotFound from '../UserNotFound'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import Loader from '../Popups/Others/Loader';

function Compiler() {

    const { user, authenticated, setauthLoad } = useContext(AuthContext)
    const reactNavigator = useNavigate("/")

    //states for room only 

    const [newRoom, setNewRoom] = useState(false)
    const [roomId, setRoomId] = useState('')
    const [room, isRoom] = useState(false)
    const [usersInRoom, setUsersInRoom] = useState([])
    const [leave, setLeave] = useState(false)
    const [end, setEnd] = useState(false)
    const [host, setHost] = useState(false)
    const [msg, setMsg] = useState("")
    const [msgList, setmsgList] = useState([])
    const socketRef = useRef(null)


    const [find, setFind] = useState('') //state for to be find value
    const [replace, setReplace] = useState('') //state for to be replace value
    const [fontsize, setSize] = useState(14) //state for fontsize
    const [codeInfo, setcodeInfo] = useState({ //state for handling code and code data
        code: localStorage.getItem("previousCode") ? localStorage.getItem("previousCode") : "",
        codelang: localStorage.getItem("previousMode") ? localStorage.getItem("previousMode") : "",
        description: ""
    })
    const [exeWindow, setExeWindow] = useState(false)
    const [theme, setTheme] = useState(true)
    let modes = ["c", "python", "cpp", "java", "javascript"]
    let modesImg = [c, python, cpp, java, js]
    const [loaded, setLoaded] = useState(false)
    const [loadWelcome, setLoadWelcome] = useState(false)
    const [savePopup, setsavePopup] = useState(false)
    const [saving, setSaving] = useState(false)

    //functions for room handling // room related local functions 
    const createNewRoomId = () => {
        const id = v4()
        setRoomId(id)
        toast.success("Created new room")
    }

    const handleEditorChange = (value) => {
        if (!codeInfo.codelang) {
            setTimeout(() => {
                setcodeInfo(prev => ({ ...prev, code: "" }))
                toast.error("Select a mode to code")
            }, 200)
        } else {
            setcodeInfo(previous => ({ ...previous, code: value }))
            localStorage.setItem("previousCode", codeInfo.code)
        }
        if (room) {
            socketRef.current.emit('code-change', {
                roomId,
                code: value,
            })
        }

    }

    const joinRoom = () => {
        if (!roomId) {
            toast.error("Mention Room ID")
            return
        }
        socketRef.current.emit('join', {
            roomId,
            username: user.username,
            userprofile: user.userprofile
        });
        isRoom(true)
        setNewRoom(false)
    }

    const replaceValues = () => {
        let newFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const tobeFind = new RegExp(newFind, 'g')
        if (codeInfo.code.includes(find)) {
            setcodeInfo(previous => ({ ...previous, code: codeInfo.code.replace(tobeFind, replace) }))
            toast.success("Value replaced")
        } else {
            toast.error("No value to replace")
        }
    }

    const addCode = async () => {
        if (!codeInfo.code || !codeInfo.codelang || !localStorage.getItem("cname") || !codeInfo.description) {
            toast.error("Mention all fields")
            return
        }
        const docCodeRef = doc(db, user.useruid, user.useruid + "_usercodes")
        setSaving(true)
        setauthLoad(30)
        await updateDoc(docCodeRef, {
            codes: arrayUnion({
                codename: localStorage.getItem("cname"),
                currentcode: codeInfo.code,
                date: new Date().toLocaleDateString(),
                description: codeInfo.description,
                language: codeInfo.codelang === "cpp" ? "c++" : codeInfo.codelang
            })
        }).catch(() => {
            toast.error("Failed to save code")
        })
        toast.success("Code added to collection")
        setSaving(false)
        setauthLoad(100)
        setsavePopup(false)
    }

    useEffect(() => {
        setLoaded(true)
        authenticated ? setLoadWelcome(true) : setLoadWelcome(false)
        const init = async () => {
            socketRef.current = await initSocket()
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                toast.error(e.message)
                reactNavigator('/')
            }

            socketRef.current.on(
                'joined',
                ({ usersPresentInRoom, username }) => {
                    if (username !== user.username) {
                        // toast.success(username + user.username)
                        toast.success(`${username} joined the room.`);
                    } else {
                        toast.success("You joined the room")
                    }
                    usersPresentInRoom.forEach(roomuser => {
                        if (roomuser.username === user.username && roomuser.isHost === true) {
                            setHost(true)
                        }
                    })
                    setUsersInRoom(usersPresentInRoom)
                }
            )

            socketRef.current.on('receive_msg', ({ userprofile, username, msg }) => {
                console.log("hello");
                setmsgList(prev => ([...prev, { userprofile, username, msg }]))
            })

            socketRef.current.on('code-change', ({ code }) => {
                setcodeInfo(previous => ({ ...previous, code: code }))
            })

            socketRef.current.on(
                'disconnected',
                ({ socketId, username }) => {
                    console.log("hrnb");
                    toast.success(`${username.username} left the room.`);
                    setUsersInRoom((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );

            socketRef.current.on('room-ended', () => {
                reactNavigator("/")
                toast.success("Host ended the room for everyone")
            })
        }

        if(authenticated){
         init()
        }
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    }, [reactNavigator, user.username, authenticated])


    return (
        <>
            <Modal isOpen={newRoom} toggle={() => setNewRoom(!newRoom)}>
                <ModalBody>
                    <div className='flex flex-col items-center p-4'>
                        <div className='flex justify-center items-center gap-3'><span className='w-3 h-3 bg-[#fb6976] rounded'></span><label htmlFor="" className='text-slate-600 font-semibold '>Paste or Create your ROOM ID</label></div>
                        <input type="text" value={roomId} placeholder='Room ID' onChange={(e) => { setRoomId(e.target.value) }} className='form-shadow text-sm text-slate-600 font-semibold px-3 py-2 rounded-md w-[70%] mt-3' />
                        <button className='bg-[#fb6976] text-sm text-white font-semibold px-3 py-2 rounded-md flex justify-center items-center gap-2 mt-3 w-[70%]' onClick={joinRoom}>Enter room <img src={right} className='w-3 h-3' alt="" /> </button>
                        <span className='text-slate-400 text-sm mt-3'>Don't have a room id <span className='text-[#fb6976] cursor-pointer underline' onClick={createNewRoomId}>Create one</span> </span>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={exeWindow} toggle={() => setExeWindow(!exeWindow)} size='lg'>
                <ModalBody>
                    <Runner code={codeInfo.code} clanguage={codeInfo.codelang} />
                </ModalBody>
            </Modal>

            <Modal isOpen={leave} toggle={() => setLeave(!leave)} >
                <ModalBody className='p-5'>
                    <div className='text-2xl font-semibold text-slate-600 text-center'>
                        Are you sure to leave the Codespace
                        <div className='text-sm text-slate-500 mt-4 font-normal'>
                            Leaving the codespace unables to code along friends, stops your interaction with others, do you still want to leave 🥺
                        </div>
                    </div>
                    <div className="buttons text-white font-semibold text-sm flex justify-center items-center gap-4 mt-4">
                        <button className='bg-[#fb6976] px-4 py-2 rounded-md' onClick={() => {
                            reactNavigator("/")
                            toast.success("You left the room")
                        }}>Leave</button>
                        <button className='bg-gray-300 px-4 py-2 rounded-md' onClick={() => {
                            setLeave(false)
                        }}>Cancel</button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={end} toggle={() => setEnd(!end)} >
                <ModalBody className='p-5'>
                    <div className='text-2xl font-semibold text-slate-600 text-center'>
                        End the codespace for everyone
                        <div className='text-sm text-slate-500 mt-4 font-normal'>
                            Ending the room for everyone will remove all from the coding area and current session will get disbanded ❌
                        </div>
                    </div>
                    <div className="buttons text-white font-semibold text-sm flex justify-center items-center gap-4 mt-4">
                        <button className='bg-[#fb6976] px-4 py-2 rounded-md' onClick={() => {
                            socketRef.current.emit('end-room', {
                                roomId
                            })
                            reactNavigator("/")
                            toast.success("Room ended")
                        }}>End Call</button>
                        <button className='bg-gray-300 px-[1.5rem] py-2 rounded-md' onClick={() => {
                            setLeave(false)
                        }}>Cancel</button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={loadWelcome} toggle={() => setLoadWelcome(!loadWelcome)} >
                <ModalBody className='p-5 text-center'>
                    <div className="head font-semibold text-slate-600 text-2xl text-center">
                        <span className='text-[#fb6976] '>Oncode welcomes you</span> {user.username.split(" ")[0]} 😊
                    </div>
                    <div className='text-sm text-slate-600 text-center mt-4'>
                        Introducing the dynamic compiler by Oncode.Easy to write and execute your codes.👍 A sharable codespace that you can use to code with your friends 🫡 just by sharing a single roomid.We store your progress, no need to worry if tab gets closed du to any reason just keep doing.Happy Coding!🚀
                    </div>
                    <button className='bg-[#fb6976] px-4 py-2 rounded-md text-sm text-white font-semibold mt-4' onClick={() => {
                        setLoadWelcome(false)
                    }}>
                        Start coding 🚀
                    </button>
                </ModalBody>
            </Modal>

            <Modal isOpen={savePopup} toggle={() => setsavePopup(!savePopup)} >
                <ModalBody className='py-4 px-5 text-center flex justify-center items-center'>
                    {
                        saving ? <div className='h-[40vh] flex justify-center items-center'>
                            <Loader title={"Saving code"} />
                        </div> : <div>
                            <div className="head font-semibold text-slate-600 text-2xl text-center">
                                Save your codes securely and get easy access to them 😁
                            </div>
                            <div className='text-sm text-slate-600 text-center mt-4'>
                                Saving the code ➡️ from here will make a new entry ,if you want to update a previous one open code from your console or click on get started 🚀.Hoping you are enjoying coding.
                            </div>
                            <textarea className='form-shadow w-full max-h-36 mt-4 outline-none text-sm text-slate-600 px-3 py-3' placeholder='Short description about your code ✒️' onChange={(e) => {
                                setcodeInfo(prev => ({ ...prev, description: e.target.value }))
                            }} />
                            <button className='bg-[#fb6976] px-4 py-2 rounded-md text-sm text-white font-semibold mt-4' onClick={addCode}>
                                Save code
                            </button>
                        </div>
                    }
                </ModalBody>
            </Modal>

            {
                authenticated ? <div>
                    <div id='chat' className='chatbox z-20 bg-white h-[72%] rounded-md relative'>
                        <div className="head text-lg text-slate-600 font-semibold bg-[#eee] px-4 py-2 rounded-md flex justify-between items-center gap-2">
                            <div className='flex justify-start items-center gap-2'>
                                Chat within the codespace
                                <img src={mail} className='w-4 mt-1' alt="" />
                            </div>
                            <img className='w-4 mt-1 cursor-pointer' src={failure} onClick={() => {
                                document.getElementById('chat').classList.toggle('active')
                            }} alt="" />
                        </div>
                        <div className="messages w-full h-[90%] overflow-x-hidden overflow-y-scroll px-4 py-3">
                            {
                                msgList.map((message) => {
                                    return (
                                        <div className={`flex items-center gap-2 ${message.username === user.username ? "justify-end" : "justify-start"} my-3 min-w-[30%]`}>
                                            <div className='w-9 h-9 border-2 border-[#fb6976] rounded-full p-[0.12rem]'>
                                                <img className='w-full h-full rounded-full object-cover' src={message.userprofile} alt="" />
                                            </div>
                                            <div className={`flex flex-col text-xs text-slate-500 justify-center ${message.username === user.username ? "items-end" : "items-start"}`}>
                                                {message.username}
                                                <div className={` px-3 py-1 text-white text-sm font-semibold mt-[0.12rem] ${message.username === user.username ? "bg-[#fb6976] rounded-lg rounded-tr-none" : "bg-gray-300 rounded-lg rounded-tl-none"}`}>
                                                    {message.msg}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='absolute flex bottom-0 justify-center items-center gap-[2px] py-3 w-full text-sm text-slate-600 backdrop-blur-xl rounded-md'>
                            <input id='input_msg' type="text" placeholder="Message" className="w-[80%] form-shadow px-2 py-2 rounded-md" onChange={(e) => {
                                setMsg(e.target.value)
                            }} />
                            <button className='bg-[#fb6976] text-white font-semibold px-4 py-2 rounded-md' onClick={() => {
                                if (!msg) {
                                    toast.error("Message can't be empty")
                                    return
                                }
                                socketRef.current.emit('sent_msg', {
                                    userprofile: user.userprofile,
                                    username: user.username,
                                    msg,
                                    roomId
                                })
                                setmsgList(prev => ([...prev, { userprofile: user.userprofile, username: user.username, msg }]))
                                document.getElementById('input_msg').value = ""
                            }}>Send</button>
                        </div>
                    </div>


                    <div className={`w-full h-[calc(100vh-50px)] flex gap-[0.1rem] fade-slide-in ${loaded ? 'loaded' : ''}`}>
                        <div className="left w-[20%] h-full bg-[#eee] flex flex-col items-center justify-start ">
                            <div className="room-controls flex flex-col items-center gap-3 my-4 mt-10">
                                <div className='font-semibold text-slate-600 flex justify-center items-center gap-2'>
                                    <div className='w-12 h-12 border-2 border-[#fb6976] p-1 rounded-full'>
                                        <img src={user.userprofile} className='object-cover rounded-full w-full h-full' alt="" />
                                    </div>
                                    {user.username}
                                </div>
                                <button id="room-creation" onClick={() => { setNewRoom(true) }} className=' bg-[#fb6976] text-white font-semibold text-sm py-2 px-3 rounded-md'>
                                    {room && usersInRoom.length > 0 ? "In " + usersInRoom[0].username.split(" ")[0] + "'s Room" : 'Create codespace+'}
                                </button>
                                {room &&
                                    <div>
                                        <div id="room-members" className='flex justify-center items-center'>
                                            <AvatarGroup max={4}>
                                                {
                                                    usersInRoom.map(member => {
                                                        return (
                                                            <Avatar alt={member.username} src={member.userprofile} />
                                                        )
                                                    })
                                                }
                                            </AvatarGroup>
                                        </div>
                                        <div className='flex mt-3 gap-2 text-sm font-semibold text-slate-500 justify-center'>
                                            <div className='flex flex-col items-center'>
                                                <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={() => {
                                                    setLeave(true)
                                                }}>
                                                    <img src={exit} className='w-4 h-4' alt="" />
                                                </button>
                                                Leave
                                            </div>
                                            {host && <div className='flex flex-col items-center'>
                                                <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={() => {
                                                    setEnd(true)
                                                }}>
                                                    <img src={endcall} className='w-4 h-4' alt="" />
                                                </button>
                                                End
                                            </div>}
                                            <div className='flex flex-col items-center'>
                                                <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={() => {
                                                    document.getElementById('chat').classList.toggle('active')
                                                }}>
                                                    <img src={chat} className='w-4 h-4' alt="" />
                                                </button>
                                                Chat
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={(e) => {
                                                    navigator.clipboard.writeText(roomId).then(() => {
                                                        toast.success("Copied Room ID")
                                                    }).catch(() => {
                                                        toast.error("Failed to copy Room ID")
                                                    })
                                                }}>
                                                    <img src={copy} className='w-4 h-4' alt="" />
                                                </button>
                                                Room
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                            <div className='w-[62%] h-[1.2px] bg-[#e2e2e2] mx-auto'></div>
                            <div className="code-tools mt-3">
                                <label htmlFor="" className='flex justify-center items-center gap-2 text-slate-600 font-semibold'>Tools <img src={hamburger} className='w-6 h-6' alt="" /></label>
                                <div className='find-replace text-center'>
                                    <label htmlFor="" className='w-[80%] mt-3 font-semibold text-slate-600 text-sm'>Find & Replace</label>
                                    <input type="text" value={find} placeholder='Find value' className='px-3 mt-1 w-[80%] mx-auto py-2 rounded-md text-slate-600 font-semibold text-sm form-shadow' onChange={(e) => setFind(e.target.value)} />
                                    <input type="text" value={replace} placeholder='Replace value' className='px-3 mt-1 w-[80%] mx-auto py-2 rounded-md text-slate-600 font-semibold text-sm form-shadow' onChange={(e) => setReplace(e.target.value)} />
                                    <button className='bg-[#fb6976] text-white font-semibold text-sm px-3 py-2 rounded-md mt-1 w-[80%]' onClick={replaceValues}>
                                        Replace
                                    </button>
                                </div>

                                <label htmlFor="" className='w-full text-center mt-4 font-semibold text-slate-600 text-sm'>Set font size</label>
                                <div className="ctrls flex justify-between w-[60%] mx-auto mt-2 text-slate-600 font-semibold bg-white py-1 px-2 rounded-xl">
                                    <button className='text-xl ml-2' onClick={() => {
                                        if (fontsize > 15) {
                                            setSize(fontsize - 2)
                                            return
                                        } setSize(14)
                                    }}>-</button>
                                    {fontsize}
                                    <button className='mr-2' onClick={() => {
                                        if (fontsize < 99) {
                                            setSize(fontsize + 2)
                                            return
                                        } setSize(100)
                                    }}>+
                                    </button>
                                </div>
                            </div>
                            <div className='w-[62%] h-[1.2px] bg-[#e2e2e2] mx-auto mt-4'></div>
                        </div>
                        <div className="right w-[80%] relative">
                            <div className='other-controls flex items-center gap-3 absolute top-5 right-5 z-10'>
                                <input type="text" placeholder='Codename' className='text-sm font-semibold px-3 rounded-sm outline-none text-slate-600 py-[0.15rem] border-none form-shadow' onChange={(e) => {
                                    localStorage.setItem("cname", e.target.value)
                                }} />
                                <button className='w-3 h-3' onClick={() => setExeWindow(true)}>
                                    <img src={theme ? play : play_dark} alt="" />
                                </button>
                                <button className='w-4 h-4' onClick={() => setTheme(!theme)}>
                                    <img src={theme ? sun : sun_dark} alt="" />
                                </button>
                                <button className='w-4 h-4' onClick={() => {
                                    setsavePopup(true)
                                }}>
                                    <img src={theme ? save : save_dark} alt="" />
                                </button>
                                <button className='flex justify-center items-center gap-2 bg-[#fb6976] text-white font-semibold text-sm px-3 py-1 rounded-md capitalize w-24' onClick={() => {
                                    document.getElementById('selectLang').classList.toggle('loaded')
                                }}>
                                    {(codeInfo.codelang && codeInfo.codelang) || "Set mode"}
                                </button>
                            </div>
                            <div id='selectLang' className="langs absolute top-12 px-3 py-3 rounded-md right-5 z-10 bg-white fade-slide-in form-shadow">
                                {
                                    modes.map((mode, i) => {
                                        return (
                                            <div className='my-2 hover:bg-gray-100 text-slate-600 font-semibold text-sm rounded-md' ><button className='flex justify-center items-center gap-2 capitalize p-1' onClick={() => {
                                                setcodeInfo(prev => ({ ...prev, codelang: mode }))
                                                document.getElementById('selectLang').classList.toggle('loaded')
                                                toast.success("Switched mode")
                                                localStorage.setItem("previousMode", mode)
                                            }}><img src={modesImg[i]} className='w-7 h-7' alt="" />{mode}</button></div>
                                        )
                                    })
                                }
                            </div>
                            <AceEditor
                                placeholder="Coding, Once in Never out"
                                mode={codeInfo.codelang === "c" || codeInfo.codelang === "cpp" ? "c_cpp" : codeInfo.codelang}
                                theme={!theme ? 'xcode' : 'dracula'}
                                name="blah2"
                                fontSize={fontsize}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={codeInfo.code}
                                style={{ height: "calc(100%)", width: "calc(100%)" }}
                                setOptions={{
                                    useWorker: false,
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
                                onChange={handleEditorChange} />
                        </div>
                    </div >
                </div> : <div className='w-full h-[70vh] flex justify-center items-center'><UserNotFound /></div>
            }
        </>
    )
}

export default Compiler
