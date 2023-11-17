import React, { useContext, useEffect, useState } from 'react'
import bin from '../../images/micro/delete.png'
import view from '../../images/micro/view.png'
import { Modal, ModalBody } from 'reactstrap'
import Addcommand from '../Popups/Others/Addcommand'
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { AuthContext } from '../contexts/AuthContext'
import Loader from '../Popups/Others/Loader'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Commads() {

    const { user, setauthLoad } = useContext(AuthContext)
    const [add, setAdd] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [commands, setCommands] = useState([])
    const [deletecmd, setDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [cmdToDelete, setCmdToDelete] = useState(null)

    const navigate = useNavigate("/")

    const deleteCommand = async (cmd) => {
        setauthLoad(30)
        setDeleting(true)
        const selfDoc = doc(db, user.useruid, user.useruid + "_usercodes")
        await updateDoc(selfDoc, {
            commands: arrayRemove(cmd)
        }).catch(() => {
            toast.error("Failed to delete command")
            setDeleting(false)
            setauthLoad(100)
            return
        })
        toast.error("Successfully deleted command")
        setDeleting(false)
        setauthLoad(100)
    }

    const fetchCommands = async () => {
        setFetching(true)
        setauthLoad(30)
        const selfDoc = doc(db, user.useruid, user.useruid + "_usercodes")
        const data = (await getDoc(selfDoc)).data()
        setCommands(data.commands)
        setauthLoad(100)
        setFetching(false)
    }

    useEffect(() => {
        setLoaded(true)

        fetchCommands()
    }, [setauthLoad, user.useruid])

    return (
        <>
            <Modal isOpen={add} toggle={() => setAdd(!add)} size='lg'>
                <ModalBody className='p-5'>
                    <Addcommand />
                </ModalBody>
            </Modal>

            <Modal isOpen={deletecmd} toggle={() => setDelete(!deletecmd)}>
                <ModalBody className='p-5'>
                    {deleting ? <div className='h-[35vh] flex justify-center items-center'> <Loader title={"Deleting command"} /></div> : <div>
                        <div className="head text-2xl font-bold tracking-tight text-center text-slate-600">
                            Are you sure to delete the saved command😓
                        </div>
                        <div className="main mt-4 text-slate-600 font-semibold text-sm text-center">
                            Deleting the command will remove it ❌ from your command collection and you will not be able to view 👁️ and use it anymore ⚙️ <br />
                            <button className='bg-[#fb5976] mt-4 px-4 py-2 rounded-md text-white font-semibold text-sm' onClick={() => deleteCommand(cmdToDelete)}>Delete command</button>
                        </div>
                    </div>}
                </ModalBody>
            </Modal>

            <div className={`p-5 fade-slide-in ${loaded ? "loaded" : ""}`}>
                <div className="heading text-4xl font-bold text-slate-600 tracking-tight">
                    Get the necessary commands in a single click <br /> and setup projects seamlessly ✅
                </div>
                <div className="actions text-sm text-white font-semibold mt-3 flex justify-start gap-2">
                    <button className='bg-[#fb6976] px-4 py-2 rounded-2xl' onClick={() => setAdd(true)}>New command setup</button>
                    <button className='bg-gray-300 px-4 py-2 rounded-2xl' onClick={fetchCommands}>Refresh commands</button>
                </div>

                <div className="commands_timeline mt-5 flex justify-start gap-3">
                    {fetching ? <div className='w-full h-[40vh] flex justify-center items-center'>
                        <Loader title={"Fetching your commands"} />
                    </div> : <div className='flex justify-start gap-3 mx-2'>
                        {commands.map(cmd => {
                            return (
                                <div className="cmd w-72 p-4 rounded-2xl form-shadow cursor-pointer">
                                    <div className="actions flex justify-end mx-3">
                                        <button className='w-4 h-4' onClick={() => {
                                            setCmdToDelete(cmd)
                                            setDelete(true)
                                        }}>
                                            <img src={bin} alt="" />
                                        </button>
                                    </div>
                                    <div className="command-name text-2xl text-slate-500 text-center mt-3 font-semibold tracking-tight h-20 capitalize transition-all duration-300 hover:text-gray-600" onClick={() => {
                                        localStorage.setItem("commandName", cmd.commandName)
                                        localStorage.setItem("command", cmd.command)
                                        navigate("/commandview")
                                    }}>
                                        {cmd.commandName.substring(0, 19) + "..."}
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </div>
        </>
    )
}
