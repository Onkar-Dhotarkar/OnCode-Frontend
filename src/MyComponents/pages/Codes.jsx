import React, { useState } from 'react'
import add from '../../images/micro/plus.png'
import refresh_img from '../../images/micro/refresh.png'
import del from '../../images/micro/delete.png'
import c from '../../images/bgs/c.png'
import cpp from '../../images/bgs/cpp.png'
import java from '../../images/bgs/java.png'
import py from '../../images/bgs/python.png'
import js from '../../images/bgs/js.png'
import view from '../../images/micro/view.png'
import failure from '../../images/micro/failure.png'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
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
import PopMessage from '../Popups/Others/PopMessage'
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
    const navigate = useNavigate("")

    async function refreshData() {
        setRefresh(true)
        setauthLoad(30)
        const docRef = doc(db, user.useruid, user.useruid + "_usercodes")
        await getDoc(docRef).then((doc) => {
            setdbdata(doc.data().codes)
            setRefresh(false)
            setauthLoad(100)
        })
    }

    async function deleteCode() {
        setauthLoad(30)
        isdeleting(true)
        try {
            console.log(viewid.name + viewid.lang)
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

    function setLanguage(lang) {
        setlangDetails(lang)
        refreshData()
    }

    function viewcode() {
        navigate('/codeview')
    }

    return (
        <>
            <Modal isOpen={modal} toggle={() => { setModal(!modal) }} size={addordelete === 'add' ? 'lg' : 'md'}>
                <ModalHeader className='text-gray-600' toggle={() => { setModal(!modal) }}>{addordelete === 'add' ? `Append a new ${langDetails} code to your collection` : 'Do you want to proceed deletion ?'}</ModalHeader>
                <ModalBody className='flex justify-center items-center'>{addordelete === 'add' ? <AddPopup language={langDetails} /> : deleting ? <div className='h-[49vh] flex justify-center items-center'><Loader title={"Deleting code " + viewid.name} /> </div> : <PopMessage src={failure} content="Delete Code" clickFunction={deleteCode} main='Delete Code' sub="Sure, then hit the delete button" description='The code will be removed and will not be further accessible' />}</ModalBody>
            </Modal>

            <div className='flex mx-auto gap-2 justify-between items-start'>
                <div className="sidebar text-md font-semibold capitalize text-slate-600 min-h-[100vh] shadow shadow-slate-100 px-[0.95rem]">
                    <div onClick={() => {
                        setLanguage('c')
                    }} className="lang cursor-pointer my-8 px-[0.95rem] py-3 rounded-md border-b border-slate-200 flex gap-2 items-center hover:bg-gray-100">
                        <img className='w-7 h-7 rounded-full' src={c} alt="" />c
                    </div>

                    <div onClick={() => {
                        setLanguage('c++')
                    }} className="lang cursor-pointer my-8 px-[0.95rem] py-3 rounded-md border-b border-slate-200 flex gap-2 items-center hover:bg-gray-100">
                        <img className='w-6 h-6 rounded-full' src={cpp} alt="" /> c++
                    </div>

                    <div onClick={() => {
                        setLanguage('java')
                    }} className="lang cursor-pointer my-8 px-[0.95rem] py-3 rounded-md border-b border-slate-200 flex gap-2 items-center hover:bg-gray-100">
                        <img className='w-6 h-6 rounded-full' src={java} alt="" /> java
                    </div>

                    <div onClick={() => {
                        setLanguage('python')
                    }} className="lang cursor-pointer my-8 px-[0.95rem] py-3 rounded-md border-b border-slate-200 flex gap-2 items-center hover:bg-gray-100">
                        <img className='w-6 h-6 rounded-full' src={py} alt="" /> python
                    </div>

                    <div onClick={() => {
                        setLanguage('javascript')
                    }} className="lang  cursor-pointermy-8 px-[0.95rem] py-3 rounded-md border-b border-slate-200 flex gap-2 items-center hover:bg-gray-100">
                        <img className='w-6 h-6 rounded-full' src={js} alt="" /> javascript
                    </div>
                </div>

                {authenticated ?
                    <div className='mx-auto'>
                        <div className="topbar flex justify-between w-[82vw] items-center px-[0.95rem] py-4 mx-auto shadow-md rounded-2xl bg-gray-100 mt-3 capitalize">
                            <div className='flex text-base text-slate-600 font-semibold tracking-tight justify-center items-center gap-3 '>
                                <img className='w-11 h-11 object-cover rounded-full p-1' src={user.userprofile} alt="" />
                                Hey {user.username.split(" ")[0]}! get your {langDetails} codes at one glance...
                            </div>
                            <div className="btns flex gap-4">
                                <button className="getpopup" onClick={() => {
                                    setaddordelete('add')
                                    setModal(true)
                                }}>
                                    <img src={add} className='w-6 h-6' alt="" />
                                </button>
                                <button className="refresh" onClick={refreshData}>
                                    <img src={refresh_img} className='w-6 h-6 p-[0.12rem] bg-[#fb6976] rounded-full' alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="myAllCodes w-[82vw] mx-auto">
                            {
                                dbdata.length === 0 ? <div className='flex flex-col items-center gap-3 text-base font-semibold text-slate-600 w-[100%] shadow-md py-10 rounded-xl'>
                                    <img className='w-12 h-12' src={failure} alt="" />
                                    Oops ! No {langDetails} codes added yet, Add by pressing the plus button
                                </div> :
                                    refresh ? <div className='mt-3 w-[100%] shadow-md py-10 rounded-xl'><Loader title='Refreshing data' /></div> :
                                        dbdata.map((element) => {
                                            if (element.language === langDetails && !refresh) return (<div key={element.id} className="c1 flex justify-between px-[0.95rem] py-[0.75rem] rounded-xl shadow-md items-center text-slate-600 font-semibold text-base mt-2 hover:bg-slate-50">
                                                <img className='w-8 h-8 rounded-full' src={element.language === "c" ? c : element.language === "c++" ? cpp : element.language === "java" ? java : element.language === "python" ? py : js} alt="" />
                                                <span className="name w-36 text-center">{element.codename}</span>
                                                <span className="cr-date w- text-center">{element.date}</span>
                                                <span className="action flex flex-wrap gap-4">
                                                    <img className='w-5 h-5 cursor-pointer' src={del} alt="" onClick={() => {
                                                        setviewid({
                                                            name: element.codename,
                                                            lang: element.language
                                                        })
                                                        setaddordelete('del')
                                                        setModal(true)
                                                    }
                                                    } />
                                                    <img className='w-6 h-6 cursor-pointer' onClick={() => {
                                                        setviewid({
                                                            name: element.codename,
                                                            lang: element.language
                                                        })
                                                        viewcode()
                                                    }} src={view} alt="" />
                                                </span>
                                            </div>
                                            ); return null
                                        })

                            }
                        </div>
                    </div > : <div className='h-[70vh] flex justify-center items-center mx-auto'><UserNotFound /></div>}
            </div>
        </>
    )
}


