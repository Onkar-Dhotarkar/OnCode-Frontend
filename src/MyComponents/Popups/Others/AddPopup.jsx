import React from 'react'
import { auth } from '../../Firebase/Firebase'
import profile from '../../../images/micro/user-profile.png'
import { useState } from 'react'
import Loader from './Loader'
import { db } from '../../Firebase/Firebase'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { LangContext } from '../../contexts/LangContext'
import toast from 'react-hot-toast'
import { Editor } from '@monaco-editor/react'

export default function AddPopup(props) {
    const [added, setAdded] = useState(true)
    const { langDetails } = useContext(LangContext)
    const [codes, setCodes] = useState([])

    const [dataToAdd, setDataToAdd] = useState({
        codename: '',
        language: langDetails,
        description: '',
        currentcode: '',
        date: new Date().toDateString()
    })
    const { user } = useContext(AuthContext)

    function validateInput() {
        Array.from(document.getElementsByTagName('input')).forEach((element) => {
            if (!element.value) {
                element.style.backgroundColor = '#f8d7da'
            } else {
                element.style.backgroundColor = '#d1e7dd'
            }
        })
    }

    const handleEditorChange = (value) => {
        setDataToAdd(previous => ({ ...previous, currentcode: value }))
    }

    const handleAddData = async () => {
        if (!dataToAdd.codename || !dataToAdd.language || !dataToAdd.currentcode || !dataToAdd.description || !dataToAdd.date) {
            toast.error("Mention all fields")
            return
        }
        let dup = false;
        const docCodeRef = doc(db, user.useruid, user.useruid + "_usercodes")
        setCodes((await getDoc(docCodeRef)).data().codes)
        codes.forEach((code) => {
            if (code.codename === dataToAdd.codename) {
                dup = true
            }
        })
        if (!dup) {
            await updateDoc(docCodeRef, {
                codes: arrayUnion(dataToAdd)
            })
            toast.success("Code added to collection")
        } else {
            toast.error("Existing code with same name")
        }
    }

    return (
        <>
            {added ? <div div className='w-[100%] mx-auto rounded-xl' >
                <div className="main text-2xl font-bold text-slate-600 mx-auto justify-center gap-7 flex py-3 items-center">
                    <img className='w-12 h-12 rounded-full object-cover' src={auth.currentUser ? auth.currentUser.photoURL : profile} alt="" />
                    <span>
                        Code more and preserve your codes forever
                    </span>

                </div>
                <div className="data flex flex-col justify-center mx-auto w-[88%] gap-3 px-1 pb-3" onChange={validateInput} spellCheck={false}>
                    <input id='codename' type="text" className='mt-1 block w-[85%] rounded-md mx-auto shadow-sm text-slate-500 text-sm py-2 px-2' placeholder='Codename' onChange={(event, regex = /\./) => {
                        setDataToAdd(previous => ({ ...previous, codename: event.target.value }))
                    }} />
                    <input type="text" id="description" placeholder='Language ' className='w-[85%] mt-1 mx-auto rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2' value={props.language} />
                    <input type="text" id="description" placeholder='Description' className='mt-1 mx-auto w-[85%] rounded-md  shadow-sm text-slate-500 text-sm py-2 px-2' onChange={(event) => {
                        setDataToAdd(previous => ({ ...previous, description: event.target.value }))
                    }} />
                    <div className='relative overflow-hidden w-[85%] bg-[#1e1e1e] h-[30vh] mx-auto rounded-lg'>
                        <Editor
                            className={'shadow shadow-slate-200 py-3 border border-slate-100'}
                            onChange={handleEditorChange}
                            language={dataToAdd.language}
                            theme='vs-dark'
                        />
                        <div id="custom-scrollbar" className="custom-scrollbar w-[6px] opacity-60 h-[95%] absolute right-4 my-2 top-0 bg-white rounded-xl transition-all resize-none overflow-auto"></div>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <button id='append-btn' className='w-40 background-grad text-white text-sm font-semibold rounded-md py-2 px-3' onClick={() => {
                        if (!dataToAdd.codename || !dataToAdd.currentcode) {
                            return
                        }
                        else {
                            setAdded(false)
                            handleAddData().then(() => {
                                setAdded(true)
                                setTimeout(() => {
                                }, 900)
                                setDataToAdd({
                                    codename: '',
                                    language: langDetails,
                                    description: '',
                                    currentcode: '',
                                    date: new Date().toDateString()
                                })
                            })
                        }
                    }}>
                        Append +
                    </button>
                </div>
            </div > : <div className='flex justify-center items-center h-[75vh]'><Loader title="Adding your code" /></div>}
        </>
    )
}
