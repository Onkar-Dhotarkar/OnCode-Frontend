import React, { useEffect, useState } from 'react'
import add from '../../images/micro/plus.png'
import refresh_img from '../../images/micro/refresh.png'
import not from '../../images/micro/not_found.png'
import del from '../../images/micro/delete_white.png'
import eye from '../../images/micro/eye_white.png'
import c from '../../images/bgs/c.png'
import cpp from '../../images/bgs/cpp.png'
import java from '../../images/bgs/java.png'
import python from '../../images/bgs/python.png'
import js from '../../images/bgs/js.png'
import assembly from '../../images/bgs/assembly.png'
import clojure from '../../images/bgs/clojure.png'
import cobol from '../../images/bgs/cobol.png'
import csharp from '../../images/bgs/c_sharp.png'
import erlang from '../../images/bgs/erlang.png'
import dart from '../../images/bgs/dart.png'
import go from '../../images/bgs/go.png'
import julia from '../../images/bgs/julia.png'
import kotlin from '../../images/bgs/kotlin.png'
import lua from '../../images/bgs/lua.png'
import php from '../../images/bgs/php.png'
import rust from '../../images/bgs/rust.png'
import scala from '../../images/bgs/scala.png'
import swift from '../../images/bgs/swift.png'
import typescript from '../../images/bgs/typescript.png'


import options from '../../images/micro/options.png'
import { Modal, ModalBody } from 'reactstrap'
import AddPopup from '../Popups/Others/AddPopup'
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import Loader from '../Popups/Others/Loader'
import { useContext } from 'react'
import { DbContext } from '../contexts/DbContext'
import { db } from '../Firebase/Firebase'
import { AuthContext } from '../contexts/AuthContext'
import { LangContext } from '../contexts/LangContext'
import UserNotFound from '../UserNotFound'
import { CodeContext } from '../contexts/CodeContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Codetable(props) {

    const [addordelete, setaddordelete] = useState('')
    const [modal, setModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [deleting, isdeleting] = useState(false)
    const { dbdata, setdbdata } = useContext(DbContext)
    const { authenticated, user, setauthLoad } = useContext(AuthContext)
    const { viewid, setviewid } = useContext(CodeContext)
    const { langDetails, setlangDetails } = useContext(LangContext)
    const [filter, setFilter] = useState(false)
    const [category, isCategory] = useState(false)
    const navigate = useNavigate("")

    const image_lang_map = {
        "assembly": assembly,
        "c": c,
        "cpp": cpp,
        "clojure": clojure,
        "cobol": cobol,
        "csharp": csharp,
        "dart": dart,
        "erlang": erlang,
        "go": go,
        "java": java,
        "javascript": js,
        "julia": julia,
        "kotlin": kotlin,
        "lua": lua,
        "php": php,
        "python": python,
        "rust": rust,
        "scala": scala,
        "swift": swift,
        "typescript": typescript
    }

    const refreshData = async () => {
        setRefresh(true)
        setauthLoad(30)
        const docRef = doc(db, user.useruid, user.useruid + "_usercodes")
        await getDoc(docRef).then((doc) => {
            try {
                setdbdata(doc.data().codes)
            } catch (e) {
                toast.error(e.message)
            }
            setRefresh(false)
            setauthLoad(100)
        })
    }

    const deleteCode = async () => {
        setauthLoad(30)
        isdeleting(true)
        try {
            const totalDocs = (await getDoc(doc(db, user.useruid, user.useruid + "_usercodes"))).data().codes
            Array.from(totalDocs).forEach(async (document) => {
                if (document.codename === viewid.name && document.language === viewid.lang) {
                    await updateDoc(doc(db, user.useruid, user.useruid + "_usercodes"), {
                        codes: arrayRemove(document)
                    }).then(() => {
                        toast.success("Code deleted successfully")
                        setModal(false)
                        return
                    })
                }
            })
        } catch (e) {
            toast.success(e.message)
        }
        isdeleting(false)
        setauthLoad(100)
    }

    const setLanguage = (lang) => {
        setlangDetails(lang)
        refreshData()
    }

    const viewcode = () => {
        navigate('/codeview')
    }

    useEffect(() => {
        const fetchData = async () => {
            setRefresh(true)
            setauthLoad(30)
            const docRef = doc(db, user.useruid, user.useruid + "_usercodes")
            await getDoc(docRef).then((doc) => {
                try {
                    setdbdata(doc.data().codes)
                } catch (e) {
                    toast.error(e.message)
                }
                setRefresh(false)
                setauthLoad(100)
            })
            isCategory(false)
            dbdata.forEach((code) => {
                if (code.language === langDetails) {
                    isCategory(true)
                }
            })
        }
        fetchData()
    }, [setauthLoad, setdbdata, user.useruid, langDetails])

    return (
        <>
            <Modal isOpen={modal} toggle={() => { setModal(!modal) }} size={addordelete === 'add' ? 'lg' : 'md'}>
                <ModalBody className='flex justify-center items-center'>{addordelete === 'add' ? <AddPopup language={langDetails} /> : deleting ? <div className='h-[49vh] flex justify-center items-center'><Loader title={"Deleting code " + viewid.name} /> </div> : <div className='text-center px-5 py-4'>
                    <div className="heading text-2xl text-slate-600 font-semibold">
                        Are you sure to delete the code ❓
                    </div>
                    <div className='text-sm text-slate-600 mt-3'>
                        Deleting the code will remove 🥺 it from your code collection, you will not be able to access or edit it anymore, click delete if you want to proceed the deletion.
                    </div>
                    <div className='flex gap-3 justify-center'>
                        <button className='bg-[#fb6976] text-sm font-semibold px-4 py-2 rounded-md mt-4 text-white' onClick={deleteCode}>
                            Delete Code
                        </button>
                        <button className='bg-gray-300 text-sm font-semibold px-3 py-2 rounded-md mt-4 text-white' onClick={() => {
                            setModal(false)
                        }}>
                            Cancel Deletion
                        </button>
                    </div>

                </div>}</ModalBody>
            </Modal>

            {authenticated ? <div className="main-wrapper">
                <div className="head mt-2 px-5">
                    <div className="heading text-3xl font-bold tracking-tight text-slate-700 flex justify-start items-center gap-4">
                        🚀 Codes
                        <div className='flex justify-start items-center gap-2 mt-2 text-white text-sm font-semibold'>
                            <button className='px-4 py-2 rounded-md flex justify-center items-center gap-1 bg-[#fb6976]' onClick={() => {
                                setaddordelete('add')
                                setModal(true)
                            }}>New
                                <img src={add} className='w-5 h-5' alt="" />
                            </button>
                            <button className='px-3 py-2 rounded-md flex justify-center items-center gap-1 bg-gray-300' onClick={refreshData}>Refresh
                                <img src={refresh_img} className='w-5 h-5' alt="" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="codeTable">
                    <div className="tablehead text-sm text-slate-600 flex justify-between items-center gap-2 px-5 mt-3">
                        <input type="text" className='w-[30%] px-3 ml-1 py-2 rounded-md shadow-sm border-slate-200' placeholder='Search for your codes 🫡' />

                        <button className='border border-slate-200 w-32 px-3 py-2 rounded-2xl flex justify-center items-center gap-2' onClick={() => {
                            setFilter(!filter)
                        }}>
                            {!langDetails && <img src={options} className='h-5' alt="" />}
                            {langDetails ? <div className='flex justify-center items-center gap-2'>
                                <img src={image_lang_map[langDetails]} className='w-4' alt="" />
                                {langDetails}
                            </div> : "Filters"}
                        </button>
                    </div>
                    <div className={`fade-slide-in absolute right-12 w-[28rem] flex-wrap ${filter ? "loaded" : "pointer-events-none"} bg-white form-shadow rounded-md p-4 flex justify-center items-center gap-2 text-sm font-semibold text-slate-600`}>
                        <div className="head-filter text-2xl text-center mb-3">
                            View language specific codes 😗
                        </div>
                        {
                            Object.keys(image_lang_map).map((key, i) => {
                                return (
                                    <div className='px-4 py-2 rounded-xl border border-slate-200 flex justify-center items-center gap-2' key={i} onClick={() => {
                                        setLanguage(key)
                                        setFilter(false)
                                    }}>
                                        <img className="w-4" src={image_lang_map[key]} alt="" />
                                        {key}
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="head-row bg-[#eee] rounded-md flex justify-between px-3 items-center text-slate-600 text-sm font-semibold py-2 w-[92.5%] mx-auto mt-3 ">
                        <div className='w-1/4 text-center' >Name</div>
                        <div className='w-1/4 text-center'>Language</div>
                        <div className='w-1/4 text-center'>Date</div>
                        <div className='w-1/4 text-center'>Actions</div>
                    </div>

                    {
                        !category && !refresh && <div className='text-2xl text-slate-600 font-bold tracking-tight w-full flex flex-col justify-center items-center h-60'>
                            <div><img src={not} className='mb-3 drop-shadow-xl' alt="" /></div>
                            {langDetails ? <div className='flex justify-center items-center gap-2'>
                                Add <span className='capitalize'> {langDetails} </span> langugage Codes to access them 😖
                            </div> : "Add a langauge filter 🖖"}
                        </div>
                    }
                    <div id='main-content-of-table' className="main-content-of-table w-[92%] mx-auto text-sm text-slate-600 font-semibold form-shadow">
                        {!refresh ?
                            <div>
                                {dbdata.map((code, i) => {
                                    return (
                                        code.language === langDetails && <div className={`user-code-wrapper flex items-center justify-between py-2 ${i % 2 !== 0 ? 'bg-[#eee]' : "bg-white"}`}>
                                            <div className="codename w-1/4 text-center ml-2">{code.codename}</div>
                                            <div className="language text-center w-1/4 flex justify-center items-center gap-2 capitalize">
                                                <img src={image_lang_map[code.language]} className='w-5' alt="" />
                                                {code.language}</div>
                                            <div className="date w-1/4 text-center">{code.date}</div>
                                            <div className="actions text-white font-semibold flex justify-center items-center gap-2 text-sm w-1/4 text-center mr-2">
                                                <button className='bg-[#fb6976] p-2 rounded-full flex justify-center items-center gap-1' onClick={() => {
                                                    setviewid({
                                                        name: code.codename,
                                                        lang: code.language
                                                    })
                                                    setaddordelete('del')
                                                    setModal(true)
                                                }}>
                                                    <img src={del} className='w-3 h-3' alt="" />
                                                </button>
                                                <button className='bg-gray-300 p-2 rounded-full flex justify-center items-center gap-1' onClick={() => {
                                                    setviewid({
                                                        name: code.codename,
                                                        lang: code.language
                                                    })
                                                    viewcode()
                                                }}>
                                                    <img src={eye} className='w-3 h-3' alt="" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                            :
                            <div className='h-60 flex justify-center items-center'>
                                <Loader title={"Refreshing"} />
                            </div>
                        }
                    </div>
                </div>
            </div> : <div className='h-[70vh] flex justify-center items-center'>
                <UserNotFound />
            </div>}
        </>
    )
}


