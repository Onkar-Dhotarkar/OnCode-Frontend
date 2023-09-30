import { useContext, useEffect, useState } from 'react'
import html from '../../images/bgs/html.png'
import css from '../../images/bgs/css.png'
import js from '../../images/bgs/js-web.png'
import moon from '../../images/micro/moon.png'
import copy from '../../images/micro/copy.png'
import upload from '../../images/micro/upload.png'
import right from '../../images/micro/right-arrow.png'
import sun from '../../images/micro/light.png'

import AceEditor from 'react-ace'
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-jsx";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools"
import toast from 'react-hot-toast'
import { AuthContext } from '../contexts/AuthContext'
import UserNotFound from '../UserNotFound'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import Loader from '../Popups/Others/Loader'


export default function Webeditor() {

    const [htmlcode, setHtml] = useState(`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
  <div class="wrapper">
    <div class="main-line">
     On<span class="code">Code</span>.
    </div>
    <div class="sub-line">Hey coder,welcome to On<span>Code</span>.We provide with a lot of coding features one of which is our online web tool for practicing html,css and js.We are improving our editor day by day,surely u will get an enhanced version of this in upcoming future.Create your own code by deleting this starter template
    </div>
 </div>
 
</body>

</html>`)
    const [csscode, setCss] = useState(`@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Gabarito&display=swap');
body{
    background: #eeeeee;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper{
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: white;
    padding: 25px 0px;
    border-radius: 20px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 10px 0px;
}

.main-line{
    font-size: 40px;
    font-family: 'Archivo Black', Verdana;
}

.code{
    color: #fb6976;
}

.sub-line{
    width: 85%;
    margin-top: 7px;
    font-family: 'Gabarito';
    color: grey;
    line-height: 20px;
    text-align: center;
} `)
    const [jscode, setJs] = useState('//Write your script here')
    const [currentLang, setCurrentLang] = useState('html')
    const [currentTheme, setCurrentTheme] = useState('light')
    const [sourceDoc, setSourceDoc] = useState('')
    const { authenticated, setauthLoad, user } = useContext(AuthContext)
    const [dataToAdd, setDataToAdd] = useState({
        structure: '',
        styles: '',
        logic: '',
        filename: ''
    })
    const [popup, setPopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleEditorChange = (value) => {
        if (currentLang === 'html') {
            setHtml(value)
        }
        else if (currentLang === 'css') {
            setCss(value)
        }
        else {
            setJs(value)
        }
        setDataToAdd(previous => ({ ...previous, structure: htmlcode, style: csscode, logic: jscode }))
        // console.log(dataToAdd.structure + dataToAdd.styles + dataToAdd.logic);
    }

    useEffect(() => {
        setLoading(true)
        const timeout = setTimeout(() => {
            setSourceDoc(`
                <html>  
                  <body>${htmlcode}</body>
                  <style>${csscode}</style>
                  <script>${jscode}</script>
                 </html>
            `)
            setLoading(false)
        }, 550)
        return () => {
            clearTimeout(timeout)
        }
    }, [htmlcode, csscode, jscode])

    const uploadwebcodes = async () => {
        setauthLoad(30)
        if (!dataToAdd.filename || !dataToAdd.structure) {
            setauthLoad(100)
            toast.error(dataToAdd.structure)
            return
        }
        setPopup(false)
        const docCodeRef = doc(db, user.useruid, user.useruid + "_usercodes")
        await updateDoc(docCodeRef, {
            webpages: arrayUnion(dataToAdd)
        })
        setauthLoad(100)
        setPopup(true)
        toast.success("Webpage uploaded successfully")
    }

    const copycode = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            toast.success("Code copied")
        }).catch(() => {
            toast.error("Unable to copy code")
        })
    }

    return (
        <>
            <Modal isOpen={popup} toggle={() => { setPopup(!popup) }}>
                <ModalHeader toggle={() => { setPopup(!popup) }}>
                    Adding code to your webpages
                </ModalHeader>
                <ModalBody>
                    {popup ? <div className='w-full flex flex-col justify-start items-center py-3 px-2'>
                        <label htmlFor="" className='text-xl font-semibold tracking-tight text-slate-500'>Add a name for your webpage</label>
                        <input type="text" className='mt-3 rounded-md shadow-sm text-slate-500 w-[85%] text-sm py-2 px-2' placeholder='Webfile name' onChange={(e) => setDataToAdd(previous => ({ ...previous, filename: e.target.value }))} />
                        <button className='text-white bg-[#fb6976] w-[85%] text-sm px-3 py-2 rounded-md font-semibold mt-3' onClick={() => { }}>Add Webpage + </button>
                    </div> : <Loader title="Adding webcode" />}
                </ModalBody>
            </Modal>
            {authenticated ? <div div className='flex justify-start gap-2' >
                <div className='w-[10%]'>

                    <div className="files w-[100%] text-sm font-bold text-slate-600 bg-gray-100 h-[100vh] flex flex-col gap-1 py-3">
                        <div className='html-file flex items-center gap-1 ml-3 mx-2 p-[0.32rem] rounded-lg cursor-pointer hover:bg-white' onClick={() => {
                            setCurrentLang('html')
                            toast.success("switched to html")
                        }}>
                            <img className='w-7 h-7' src={html} alt="" />
                            <span>HTML</span>
                        </div>
                        <div className='css-file flex items-center gap-1 ml-3 mx-2 p-[0.32rem] rounded-lg cursor-pointer hover:bg-white' onClick={() => {
                            setCurrentLang('css')
                            toast.success("switched to css")
                        }}>
                            <img className='w-7 h-7' src={css} alt="" />
                            <span>CSS</span>
                        </div>
                        <div className='js-file flex items-center  gap-1 ml-3 mx-2 p-[0.32rem] rounded-lg cursor-pointer hover:bg-white' onClick={() => {
                            setCurrentLang('jsx')
                            toast.success("switched to javascript")
                        }}>
                            <img className='w-7 h-7' src={js} alt="" />
                            <span>JS</span>
                        </div>
                    </div>

                    {/* updation part comes here */}
                    <div>

                    </div>
                </div>
                <div className="code w-[44%] h-[100vh] flex flex-col gap-2">
                    <div className="controls flex  items-center justify-between text-sm mt-2 mx-2">
                        <div className=' flex font-semibold items-center justify-start gap-2'>
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => setPopup(true)}>
                                <img className='w-4 h-4' src={upload} alt="" />
                            </button>
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => {
                                currentTheme === 'light' ? setCurrentTheme('dark') : setCurrentTheme('light')
                                toast.success(`Theme set to ${currentTheme === 'light' ? 'dark' : 'light'}`)
                            }}
                            >
                                <img className='w-4 h-4' src={currentTheme === 'light' ? moon : sun} alt="" />
                            </button>
                            <button className='bg-gray-200 p-2 rounded-full' onClick={() => {
                                currentLang === 'html' ? copycode(htmlcode) : currentLang === 'css' ? copycode(csscode) : copycode(jscode)
                            }}>
                                <img className='w-4 h-4' src={copy} alt="" />
                            </button>
                        </div>
                        <div className="other-controls bg-gray-200 px-3 py-1 rounded-md text-sm text-white font-semibold flex justify-center items-center gap-2">
                            Output
                            <img className='w-2 h-2' src={right} alt="right-arrow" />
                        </div>
                    </div>
                    <div className='rounded-md flex justify-center h-[100%] w-[100%] mx-2'>
                        <AceEditor
                            value={currentLang === 'html' ? htmlcode : currentLang === 'css' ? csscode : jscode}
                            placeholder="Write code here"
                            style={{ height: "calc(100%)", width: "calc(100%)", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", padding: "calc(12px)" }}
                            mode={currentLang}
                            theme={currentTheme === 'light' ? 'xcode' : 'dracula'}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            wrapEnabled={true}
                            setOptions={{
                                useWorker: false,
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                showLineNumbers: true,
                                tabSize: 2,
                            }}
                            onChange={handleEditorChange}
                        />
                    </div>

                </div>

                <div className="output flex justify-center items-center w-[46%] mt-5 mx-3">
                    {loading ? (
                        <Loader title="Saving changes" />
                    ) : (
                        <iframe
                            title="output-frame"
                            className="form-shadow rounded-t-[10px] "
                            style={{
                                width: "100%",
                                height: "100%",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                            }}
                            srcDoc={sourceDoc}
                        />
                    )}
                </div>
            </div > : <div className='h-[70vh] flex items-center justify-center'><UserNotFound /></div>}
        </>
    )
}
