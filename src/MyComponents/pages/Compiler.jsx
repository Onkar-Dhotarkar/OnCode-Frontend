import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import right from '../../images/micro/right-arrow.png'
import down from '../../images/micro/down.png'
import up from '../../images/micro/up.png'
import play from '../../images/micro/play.png'
import save from '../../images/micro/upload.png'
import copy from '../../images/micro/copy-white.png'
import theme from '../../images/micro/light.png'
import moon from '../../images/micro/moon.png'
import c from '../../images/bgs/c.png'
import cpp from '../../images/bgs/cpp.png'
import c_sharp from '../../images/bgs/c_sharp.png'
import java from '../../images/bgs/java.png'
import py from '../../images/bgs/python.png'
import js from '../../images/bgs/js.png'
import failure from '../../images/micro/failure.png'
import tick from '../../images/micro/success.png'

import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools"

import toast from 'react-hot-toast'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import Runner from '../Popups/Others/Runner'
import { initSocket } from '../../socket'
import { v4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import UserNotFoound from '../UserNotFound'
import Avatar from 'react-avatar'

export default function Compiler() {

    //CONTEXTS 
    const { user, authenticated } = useContext(AuthContext)
    //variables and states 
    const langs = ['c', 'java', 'cpp', 'python', 'csharp', 'javascript']
    const langImages = [c, java, cpp, py, c_sharp, js]
    const [loaded, setLoded] = useState(false)
    const [execute, isExecuting] = useState(false) // state to toggle the execution popup
    const [find, setFind] = useState('') //state for to be find value
    const [replace, setReplace] = useState('') //state for to be replace value
    const [fontsize, setFontsize] = useState(14) //state for font size
    const [editor_theme, setTheme] = useState(true) //state for theme
    const [codeInfo, setcodeInfo] = useState({ //state for handling code and code data
        code: '',
        codename: '',
        codelang: ''
    })
    const navigate = useNavigate("/")
    const [languageBtnSetOpen, setLangBtn] = useState(false)

    //all states for room related scenarios
    const socketRef = useRef(null)
    const [room, isRoom] = useState(false) //informs whether room created or not
    const [createRoom, setCreateRoom] = useState(false)
    const [roomId, setRoomId] = useState('')
    const [usersInRoom, setUsersinRoom] = useState([])
    const [seeall, setSeeAll] = useState(false)

    //local function 
    const handleEditorChange = (value) => {
        setcodeInfo(previous => ({ ...previous, code: value }))
        if (room) {
            socketRef.current.emit('code-change', {
                roomId,
                code: value,
            })
        }
    }

    //functions for room handling // room related local functions 
    const createNewRoomId = () => {
        const id = v4()
        setRoomId(id)
        toast.success("Created new room")
    }


    const joinRoom = () => {
        if (!roomId) {
            toast.error("Mention Room ID")
            return
        }
        socketRef.current.emit('join', {
            roomId,
            username: user.username
        });
        isRoom(true)
        setCreateRoom(false)
    }


    useEffect(() => {
        const loaded_timeout = setTimeout(() => {
            setLoded(true)
        }, 1100)
        const init = async () => {
            socketRef.current = await initSocket()

            //after initiating the socket check for error in connection 
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                toast.error(e.message)
                navigate('/')
            }

            //listening for the joined event 
            socketRef.current.on(
                'joined',
                ({ usersPresentInRoom, username, socketId }) => {
                    if (username !== user.username) {
                        // toast.success(username + user.username)
                        toast.success(`${username} joined the room.`);
                    } else {
                        toast.success("You joined the room")
                    }
                    setUsersinRoom(usersPresentInRoom);
                }
            );

            //listening for code change event 
            socketRef.current.on('code-change', ({ code }) => {
                setcodeInfo(previous => ({ ...previous, code: code }))
            })

            //listening for disconnected event
            socketRef.current.on(
                'disconnected',
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setUsersinRoom((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );

            //listening for end of room
            socketRef.current.on('room-ended', () => {
                navigate("/")
                toast.success("Host ended the room for everyone")
            })
        }
        init()
        return () => {
            clearTimeout(loaded_timeout)
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    }, [navigate, user.username])


    //other ide functions 
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

    return (
        <div>
            {/* //popup modals */}
            <Modal isOpen={execute} toggle={() => { isExecuting(!execute) }} size='lg'>
                <ModalHeader toggle={() => { isExecuting(!execute) }}>
                    Execute {codeInfo.codename}
                </ModalHeader>
                <ModalBody className='flex justify-center items-center'>
                    <Runner code={codeInfo.code} cname={codeInfo.codename} clanguage={codeInfo.codelang} />
                </ModalBody>
            </Modal>

            <Modal isOpen={seeall} toggle={() => { setSeeAll(!seeall) }}>
                <ModalHeader toggle={() => { setSeeAll(!seeall) }}>
                    Users connected in room
                </ModalHeader>
                <ModalBody>
                    <span className='text-sm font-semibold text-slate-700 w-[90%] text-start mx-auto px-4 py-2'>Members in room</span>
                    <div className='w-full flex items-center gap-2 flex-col mt-2'>
                        {usersInRoom.map((u, i) => {
                            return (
                                <div key={u.socketId} className='w-[90%] mx-auto form-shadow flex justify-between px-3 py-2 text-sm font-semibold text-slate-700 items-center'>
                                    <div className='flex justify-start gap-2 items-center'>
                                        <Avatar name={u.username} size={29} round="4px" style={{ fontsize: "12px" }} />
                                    </div>
                                    {u.username}
                                    {i === 0 ? <label>H</label> : usersInRoom.at(0).username === user.username ? <span><img src={failure} alt="" className='w-3 h-3' /></span> : <img src={tick} className='w-3 h-3'></img>}
                                </div>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>


            <Modal isOpen={createRoom} toggle={() => { setCreateRoom(!createRoom) }}>
                <ModalHeader toggle={() => { setCreateRoom(!createRoom) }}>
                    Create a new room or join one
                </ModalHeader>
                <ModalBody className='text-center'>
                    <div>
                        <div className='text-slate-500 w-full font-semibold text-sm text-start ml-10'>
                            Paste invitation ROOM ID
                        </div>
                        <input type="text" placeholder='ROOM ID' className='mt-2 rounded-md font-normal shadow-sm text-slate-500 w-[85%] text-sm py-2 px-2' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} />
                        <button className='bg-[#fb6976] mt-3 text-sm font-semibold flex justify-center items-center gap-2 text-white w-[84%] py-2 rounded-md mx-auto' onClick={joinRoom}>Enter the Room
                            <img className='w-3 h-3' src={right} alt="" />
                        </button>
                        <label className='text-slate-600 text-sm mt-2 py-2' htmlFor="">Don't have a room id ? <span className='text-[#fb6976] underline underline-offset-2 cursor-pointer' onClick={createNewRoomId}>new room</span></label>
                    </div>
                </ModalBody>
            </Modal>


            {authenticated ?
                <div className={`parent-wrapper h-[100vh] flex fade-slide-in ${loaded ? 'loaded' : ''}`}>
                    <div className="room-handler bg-gray-100 h-full w-[12%] text-center">
                        <div className="user flex flex-col items-center py-3">
                            <img className='w-9 h-9 rounded-full' src={user.userprofile} alt="" />
                        </div >
                        <label className='ml-2 text-sm font-semibold'>Name of program</label> <br />
                        <input type="text" placeholder='Name' className='rounded-md font-normal shadow-sm text-slate-500 w-[85%] mt-1 text-sm py-2 px-2' onChange={(e) => {
                            setcodeInfo(previous => ({ ...previous, codename: e.target.value }))
                        }} />

                        <div className="room-content text-center">
                            <button className='bg-[#fb6976] mt-3 text-sm font-semibold text-white w-[84%] py-2 rounded-md' onClick={() => {
                                setCreateRoom(true)
                            }}>
                                {!room ? 'Create room + ' : usersInRoom.length >= 1 && usersInRoom.at(0).username.split(" ")[0] + "'s room"}
                            </button>

                            {room && <div className="room-members text-slate-900 font-semibold text-sm mt-3">
                                Room members
                                <div className="members flex flex-wrap justify-center w-[75%] mx-auto gap-2 mt-3">
                                    {
                                        usersInRoom.map((roomuser) => {
                                            return (
                                                <div key={roomuser}>
                                                    <Avatar name={roomuser.username} size={31.5} round="4px" />
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='font-semibold text-lg text-slate-600 cursor-pointer' onClick={() => setSeeAll(true)}>...</div>
                                </div>
                                <button className="leave mt-4 mx-auto bg-gray-300 text-sm text-white font-semibold w-[84%] py-2 rounded-md" onClick={() => {
                                    navigate("/")
                                    toast.success("You left the room")
                                }}>
                                    Leave room
                                </button>
                                {usersInRoom.length > 1 && usersInRoom.at(0).username === user.username && <button className="leave mt-1 bg-gray-300 text-sm text-white font-semibold w-[84%] py-2 rounded-md" onClick={() => {
                                    socketRef.current.emit('end-room', {
                                        roomId
                                    })
                                    navigate("/")
                                    toast.success("Room ended")
                                }}>
                                    End room
                                </button>}
                            </div>}
                        </div>

                        {room && <button className="bg-[#fb6976] mt-1 text-sm text-white font-semibold w-[84%] py-2 rounded-md flex justify-center items-center gap-2 mx-auto" onClick={() => {
                            navigator.clipboard.writeText(roomId).then(() => {
                                toast.success("Room ID copid")
                            }).catch(() => {
                                toast.success("Failed to copy Room ID")
                            })
                        }}>
                            <img className='w-3 h-3' src={copy} alt="" />
                            Room ID
                        </button>}
                    </div >
                    <div className="editor w-[70%] pt-2 px-2">
                        {


                            <AceEditor
                                className={`${!editor_theme ? 'form-shadow' : ''}`}
                                placeholder="Coding, once in never out"
                                style={{ height: "calc(100%)", width: "calc(100%)", borderRadius: "5px", padding: "calc(12px)" }}
                                mode={codeInfo.codelang !== "c" && codeInfo.codelang !== "cpp" ? codeInfo.codelang : "c_cpp"}
                                theme={editor_theme ? 'dracula' : 'xcode'}
                                fontSize={fontsize}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                wrapEnabled={true}
                                value={codeInfo.code}
                                setOptions={{
                                    useWorker: false,
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
                                onChange={handleEditorChange}
                            />}
                    </div>
                    <div className="features">
                        <div className="basic-controls flex justify-start gap-2 mt-[0.62rem] ml-2">
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => {
                                isExecuting(true)
                            }}>
                                <img className='w-[0.82rem] h-[0.82rem]' src={play} alt="" />
                            </button>
                            <button className='bg-gray-200 p-2 rounded-full'>
                                <img className='w-[0.82rem] h-[0.82rem]' src={save} alt="" />
                            </button>
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => {
                                if (codeInfo.code) {
                                    navigator.clipboard.writeText(codeInfo.code).then(() => {
                                        toast.success('Code copied to clipboard')
                                    }).catch(() => {
                                        toast.error("Failed to copy code")
                                    })
                                    return
                                }
                                toast.error("Write code to copy")
                            }}>
                                <img className='w-[0.82rem] h-[0.82rem]' src={copy} alt="" />
                            </button>
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => {
                                setTheme(!editor_theme)
                                toast.success(editor_theme ? 'switched to light mode' : 'switched to dark mode')
                            }} >
                                <img className='w-[0.82rem] h-[0.82rem]' src={editor_theme ? theme : moon} alt="" />
                            </button>
                        </div>
                        <div className="tools text-sm font-semibold text-slate-900 mt-2 ml-1">

                            <label className='ml-2'>Find</label> <br />
                            <input type="text" placeholder='Find next' className='rounded-md font-normal shadow-sm text-slate-500 w-[85%] text-sm py-2 px-2' onChange={(e) => { setFind(e.target.value) }} /> <br />

                            <label className='ml-2 mt-2'>Replace</label> <br />
                            <input type="text" placeholder='Replace with ' className='rounded-md font-normal shadow-sm text-slate-500 w-[85%] text-sm py-2 px-2' onChange={(e) => { setReplace(e.target.value) }} />

                            <button className='bg-[#fb6976] text-sm mt-3 text-white font-semibold w-[84%] py-2 rounded-md' onClick={replaceValues}>Replace</button>

                            <div className="customizations mt-3">
                                <label htmlFor="Preferences" className='ml-2 text-md text-slate-600'>Other preferences</label>
                                <div className="font-size">
                                    <label className='ml-2 mt-2'>Set font size</label> <br />
                                    <input type="text" placeholder='Font size ' value={(fontsize && fontsize) || 14} className='rounded-md font-normal shadow-sm text-slate-500 w-[85%] text-sm py-2 px-2' onChange={(e) => {
                                        setFontsize(parseInt(e.target.value))
                                    }} />
                                </div>
                                <div className='mode-lang mt-2'>
                                    <label className='ml-2 mt-1 text-slate-900 text-sm font-semibold' htmlFor="">Set language</label>
                                    <button className='bg-[#fb6976] w-[84%] py-2 mt-2 text-sm text-white font-semibold rounded-md capitalize flex justify-center items-center gap-2' onClick={() => {
                                        document.getElementById("list").classList.toggle('hidden')
                                        setLangBtn(!languageBtnSetOpen)
                                    }}>
                                        {(codeInfo.codelang && codeInfo.codelang) || 'Select a language'}
                                        <img src={!languageBtnSetOpen ? down : up} className='w-3 h-3 mt-[0.1rem]' alt='' />
                                    </button>
                                    <div id='list' className="w-[74%] ml-3 hidden form-shadow mt-2 z-50 transition-all">
                                        {langs.map((lang, i) => {
                                            return (
                                                <button className='py-[0.46rem] mx-auto w-full rounded-md flex justify-center items-center gap-2 hover:bg-gray-100' onClick={() => {
                                                    document.getElementById("list").classList.toggle('hidden')
                                                    setcodeInfo(previous => ({ ...previous, codelang: lang }))
                                                    setLangBtn(!languageBtnSetOpen)
                                                }}>
                                                    <img className='w-6 h-6 rounded-full' src={langImages[i]} alt="" />
                                                    <label className='w-10 text-start capitalize'>
                                                        {lang}
                                                    </label>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div > : <div className='flex justify-center items-center h-[70vh]'><UserNotFoound /></div>}
        </div>
    )
}
