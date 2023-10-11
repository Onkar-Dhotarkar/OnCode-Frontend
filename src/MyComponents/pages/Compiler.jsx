import React, { useEffect, useState, useRef, useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import AceEditor from 'react-ace'
import exit from '../../images/micro/roomexit.png'
import endcall from '../../images/micro/endcall.png'
import chat from '../../images/micro/chat.png'
import right from '../../images/micro/right-arrow.png'
import hamburger from '../../images/micro/hamburger.png'
import copy from '../../images/micro/copy-white.png'
import play from '../../images/micro/play.png'
import play_dark from '../../images/micro/play_dark.png'
import sun from '../../images/micro/light.png'
import sun_dark from '../../images/micro/sun-dark.png'
import save from '../../images/micro/upload.png'
import save_dark from '../../images/micro/upload_dark.png'
import down from '../../images/micro/down.png'
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

function Compiler() {

    const { user } = useContext(AuthContext)
    const reactNavigator = useNavigate("/")

    //states for room only 
    const [newRoom, setNewRoom] = useState(false)
    const [roomId, setRoomId] = useState('')
    const [room, isRoom] = useState(false)
    const [usersInRoom, setUsersInRoom] = useState([])
    const socketRef = useRef(null)
    const [find, setFind] = useState('') //state for to be find value
    const [replace, setReplace] = useState('') //state for to be replace value
    const [fontsize, setSize] = useState(14) //state for fontsize
    const [codeInfo, setcodeInfo] = useState({ //state for handling code and code data
        code: '',
        codename: '',
        codelang: ''
    })
    const [exeWindow, setExeWindow] = useState(false)
    const [theme, setTheme] = useState(true)
    let modes = ["c", "python", "cpp", "java", "javascript"]
    let modesImg = [c, python, cpp, java, js]
    const [mode, setMode] = useState()

    //functions for room handling // room related local functions 
    const createNewRoomId = () => {
        const id = v4()
        setRoomId(id)
        toast.success("Created new room")
    }

    const handleEditorChange = (value) => {
        setcodeInfo(previous => ({ ...previous, code: value }))
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

    useEffect(() => {
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
                    setUsersInRoom(usersPresentInRoom);
                }
            )

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
        init()
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    }, [reactNavigator, user.username])


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

            <div className='w-full h-[calc(100vh-50px)] flex gap-1'>
                <div className="left w-[20%] h-full bg-[#eee] flex flex-col items-center">
                    <div className="room-controls flex flex-col items-center gap-3 my-4">
                        <button id="room-creation" onClick={() => { setNewRoom(true) }} className=' bg-[#fb6976] text-white font-semibold text-sm py-2 px-3 rounded-md'>
                            Create codespace+
                        </button>
                        {room &&
                            <div>
                                <div id="room-members" className='flex justify-center items-center'>
                                    <AvatarGroup max={4}>
                                        {
                                            usersInRoom.map(member => {
                                                return (
                                                    <Avatar alt="Remy Sharp" src={member.userprofile} />
                                                )
                                            })
                                        }
                                    </AvatarGroup>
                                </div>
                                <div className='flex mt-3 gap-2 text-sm font-semibold text-slate-500 justify-center'>
                                    <div className='flex flex-col items-center'>
                                        <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={() => {
                                            reactNavigator("/")
                                        }}>
                                            <img src={exit} className='w-4 h-4' alt="" />
                                        </button>
                                        Leave
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center' onClick={() => {
                                            socketRef.current.emit('end-room', {
                                                roomId
                                            })
                                            reactNavigator("/")
                                            toast.success("Room ended")
                                        }}>
                                            <img src={endcall} className='w-4 h-4' alt="" />
                                        </button>
                                        End
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <button className='bg-[#fb6976] px-2 py-2 rounded-2xl flex justify-center items-center'>
                                            <img src={chat} className='w-4 h-4' alt="" />
                                        </button>
                                        Chat
                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className='w-[62%] h-[1.2px] bg-[#c5c4c4] mx-auto'></div>
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
                                if (fontsize > 16) {
                                    setSize(fontsize - 2)
                                    return
                                } setSize(15)
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
                    <div className='w-[62%] h-[1.2px] bg-[#c5c4c4] mx-auto mt-4'></div>
                    {room && <button className='bg-gray-400 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-3xl mt-3 px-3 py-2 mx-auto ' onClick={() => {
                        navigator.clipboard.writeText(roomId).then(() => {
                            toast.success("Copied room ID")
                        }).catch(() => {
                            toast.success("Failed to copy Room ID")
                        })
                    }}>
                        <img src={copy} className='w-4 h-4' alt="" />
                        Copy Room ID
                    </button>}
                </div>
                <div className="right w-[80%] relative">
                    <div className='other-controls flex items-center gap-3 absolute top-3 right-5 z-10'>
                        <button className='w-3 h-3' onClick={() => setExeWindow(true)}>
                            <img src={theme ? play : play_dark} alt="" />
                        </button>
                        <button className='w-4 h-4' onClick={() => setTheme(!theme)}>
                            <img src={theme ? sun : sun_dark} alt="" />
                        </button>
                        <button className='w-4 h-4'>
                            <img src={theme ? save : save_dark} alt="" />
                        </button>
                        <button className='flex justify-center items-center gap-2 bg-[#fb6976] text-white font-semibold text-sm px-3 py-1 rounded-md capitalize w-24' onClick={() => {
                            document.getElementById('selectLang').classList.toggle('loaded')
                        }}>
                            {(codeInfo.codelang && codeInfo.codelang) || "Set mode"}
                        </button>
                    </div>
                    <div id='selectLang' className="langs absolute top-12 px-3 py-3 rounded-md right-5 z-10 bg-white fade-slide-in">
                        {
                            modes.map((mode, i) => {
                                return (
                                    <div className='my-2 hover:bg-gray-100 text-slate-600 font-semibold text-sm rounded-md' ><button className='flex justify-center items-center gap-2 capitalize p-1' onClick={() => {
                                        setcodeInfo(prev => ({ ...prev, codelang: mode }))
                                        document.getElementById('selectLang').classList.toggle('loaded')
                                        toast.success("Switched mode")
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
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                        onChange={handleEditorChange} />
                </div>
            </div>
        </>
    )
}

export default Compiler
