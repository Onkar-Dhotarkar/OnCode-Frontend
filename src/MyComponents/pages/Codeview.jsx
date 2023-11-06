import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CodeContext } from '../contexts/CodeContext'
import { getDoc, doc } from 'firebase/firestore'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { db } from '../Firebase/Firebase'
import copy from '../../images/micro/copy.png'
import download from '../../images/micro/download.png'
import save from '../../images/micro/save.png'
import run from '../../images/micro/play.png'
import light from '../../images/micro/light.png'
import dark from '../../images/micro/moon.png'
import copied from '../../images/micro/correct.png'
import { AuthContext } from '../contexts/AuthContext'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Loader from '../Popups/Others/Loader'
import PopMessage from '../Popups/Others/PopMessage'
import UserNotFound from '../UserNotFound'
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
const FileSaver = require('file-saver')

export default function Codeview(props) {

    const [viewTheme, setviewTheme] = useState('dark')
    const { viewid } = useContext(CodeContext)
    const { authenticated, user, setauthLoad } = useContext(AuthContext)
    const [code, setCode] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [modal, setModal] = useState(false)

    const getCode = useCallback(async () => {
        setauthLoad(30)
        const docRef = doc(db, user.useruid, user.useruid + "_usercodes")
        let docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const totalDocs = (await getDoc(doc(db, user.useruid, user.useruid + "_usercodes"))).data().codes
            Array.from(totalDocs).forEach(async (document) => {
                if (document.codename === viewid.name && document.language === viewid.lang) {
                    setCode(document)
                    return
                }
            })
        }
        else {
            setCode("Code selected is not accessible")
        }
        setauthLoad(100)
    }, [user.useruid, viewid, setauthLoad])

    function copyCode() {
        if (code) {
            navigator.clipboard.writeText(code.currentcode).then(() => {
                document.getElementById('copy').textContent = 'Copied!'
                document.getElementById('copyimg').src = copied
            }).catch(() => {
                document.getElementById('copy').textContent = 'Failed!'
            })

            const timeout = setTimeout(() => {
                document.getElementById('copy').textContent = 'Copy'
                document.getElementById('copyimg').src = copy
            }, 2500)

            return () => {
                clearTimeout(timeout)
            }
        }
    }

    function changeTheme() {
        const img = document.getElementById('themeimg')
        if (viewTheme === 'dark') {
            setviewTheme('light')
            img.src = dark
            return
        }
        setviewTheme('dark')
        img.src = light
    }

    async function saveCode() {
        const blob = new Blob([code.currentcode], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, `${code.codename}.${code.language.length > 4 && code.language !== 'javascript' ? code.language.substring(0, 2) : code.language === 'javascript' ? code.language = 'js' : code.language}`)
    }
    useEffect(() => {
        setLoaded(true)
        if (authenticated) {
            getCode()
        }
    }, [authenticated, getCode])

    return (
        <>
            <Modal isOpen={modal} toggle={() => { setModal(!modal) }} size='md'>
                <ModalHeader toggle={() => { setModal(!modal) }}>Do you want to download the code ? </ModalHeader>
                <ModalBody className='flex justify-center items-center' ><PopMessage src={download} main="Download Code" sub="Sure, then hit the button" description="By pressing the download button the code will be downloaded in your system" content="Download" clickFunction={saveCode} /></ModalBody>
            </Modal>
            {authenticated ? !code ? <div className='w-[70vw] h-[85vh] mx-auto flex items-center'><Loader title="Fetching code" /></div> :
                <div className={`w-[70vw] h-[100vh] mx-auto  fade-slide-in ${loaded ? 'loaded' : ''}`} >
                    <div className='flex flex-col w-[100%] justify-start gap-3 mt-4'>
                        <div className="codename text-3xl font-semibold text-slate-600 px-2">
                            <span className='text-[#fb6976]'>{code.codename}</span>.{code.language}
                        </div>
                        <div className='flex justify-start items-center gap-3 px-2'>
                            <button className="run background-grad text-white font-semibold text-sm px-4 py-2 rounded-md flex items-center gap-2 justify-center">
                                <img className='w-3 h-3 ' src={run} alt="" />
                                Edit code over editor
                            </button>
                            <button onClick={() => {
                                setModal(true)
                            }} className={`save bg-gray-300 text-white font-semibold text-sm px-8 py-2 rounded-md flex items-center gap-1 justify-center`}>
                                <img className='w-5 h-5 ' src={save} alt="" />
                                Save code in system
                            </button>
                        </div>
                    </div>
                    <div className="codedesc flex flex-col gap-2 px-2 py-3 mt-1 text-sm font-semibold text-slate-500 w-[70vw] mx-auto text-start">
                        <span className='text-3xl text-slate-600 tracking-tight font-semibold capitalize flex items-center justify-between'>
                            Description
                        </span>
                        <span className={`capitalize `}>
                            {code.description ? code.description : 'No description provided'}
                        </span>
                    </div>
                    <div className='text-3xl font-semibold px-2 mt-[0.65rem]'>Code</div>
                    <div className="codecontent bg-neutral-600 mt-2 w-[70vw] mx-auto relative" style={{ borderRadius: "6.5px" }}>
                        <div className="operations flex justify-end py-2">
                            <div className='flex items-center justify-end mx-4 w-16'>
                                <img id='copyimg' className='w-5 h-5 mr-2' src={copy} alt="" />
                                <button id='copy' className="text-sm text-white font-semibold" onClick={copyCode}>
                                    Copy
                                </button>
                            </div>
                            <div className='flex absolute top-12 items-center justify-center w-16 m-2 cursor-pointer'>
                                <img id='themeimg' className='w-7' src={light} onClick={changeTheme} alt="" />
                            </div>
                        </div>
                        <div className='outline-none border-gray-100'>
                            <SyntaxHighlighter className='px-5 py-3 mb-2 min-h-[40vh] rounded-b-[6.6px]' customStyle={{ width: "100%" }} language={code.language} style={viewTheme === 'dark' ? atomOneDark : github} wrapLongLines={true}>
                                {code.currentcode}
                            </SyntaxHighlighter>6
                        </div>
                    </div >
                    <label className='text-slate-600 font-semibold text-sm px-1 my-2'>
                        Code added with ❤️ on {code.date}
                    </label>

                </div> : <div className='h-[70vh] flex items-center'>
                <UserNotFound />
            </div>}
        </>
    )
}
