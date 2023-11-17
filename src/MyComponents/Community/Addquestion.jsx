import React, { useContext, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { AuthContext } from '../contexts/AuthContext'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import toast from 'react-hot-toast'
import { Modal, ModalBody } from 'reactstrap'
import Loader from '../Popups/Others/Loader'

export default function Addquestion() {
    const [loaded, setLoaded] = useState(false)
    const { user, setauthLoad } = useContext(AuthContext)

    //states for holding data to add in the question
    const [question, setQuestion] = useState("")
    const [language, setLanguage] = useState("")
    const [code, setCode] = useState("")
    const [error, setError] = useState("")

    const [add, setAdd] = useState(false)
    const [adding, setAdding] = useState(false)

    const questionStructure = {
        posted_by: {
            id: user.useruid,
            name: user.username,
            profile: user.userprofile
        },
        question_title: question,
        question_language: language,
        question_code: code,
        question_error: error,
        date: new Date().toDateString(),
        likes: [],
        comments: [],
        responses: []
    }

    const postQuestion = async () => {
        if (!question || !code || !language) {
            toast.error("Fill the required fields")
            return
        }

        setauthLoad(30)
        const selfdoc = doc(db, user.useruid, user.useruid + "_userquestions")
        await updateDoc(selfdoc, {
            self_questions: arrayUnion(questionStructure)
        }).catch(() => {
            toast.error("Failed to add question")
            setAdding(false)
            setauthLoad(100)
            return
        })
        toast.success("Question added successfully")
        setAdding(false)
        setauthLoad(100)
    }

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <>
            <Modal isOpen={add} toggle={() => setAdd(!add)}>
                <ModalBody className='p-5'>
                    {!adding ? <div >
                        <div className="heading text-2xl text-slate-600 font-bold tracking-tight text-center w-full">
                            Continue adding this question ❓
                        </div>
                        <div className="rest-part text-sm font-semibold text-slate-600 mt-4 text-center w-full">
                            Add the question to your community ➡️ so that others can see and respond you with the solution ✅<br />
                            <button className='bg-[#fb6976] text-white  px-4 py-2 rounded-md mt-3' onClick={() => {
                                setAdding(true)
                                postQuestion()
                            }}>
                                Add question
                            </button>
                        </div>
                    </div> : <div className='w-full h-full flex justify-center items-center'><Loader title="Adding question" /></div>}
                </ModalBody>
            </Modal>

            <div className={`main-wrapper fade-slide-in ${loaded ? "loaded" : ""} p-4`}>
                <div className="heading text-4xl text-slate-600 font-bold tracking-tight mx-auto text-center">
                    <div>🙋‍♂️❓</div>
                    Feel <span className='text-[#fb6976]'>free</span> to raise your doubts <br /> and questions
                </div>
                <div className="main-section mt-5 w-[50%] mx-auto">
                    <div className="question-title flex flex-col items-start px-2 text-start gap-2 text-slate-600 font-semibold">
                        <span className='mx-2'>Add your question❓in a clear and understandable way</span>
                        <textarea onChange={(e) => { setQuestion(e.target.value) }} placeholder='Write your queation regarding any coding issue you are facing➡️' id="question-title" className="resize-y border-1 border-slate-100 outline-none p-3 rounded-2xl shadow-sm text-sm" cols="80" rows="6" />
                    </div>

                    <div className="question-language flex flex-col items-start px-2 text-start gap-2 text-slate-600 font-semibold mt-4">
                        <span className='mx-2'>Specify the language ⚙️ technology in which you are working 👷‍♂️</span>
                        <input onChange={(e) => { setLanguage(e.target.value) }} placeholder='Language in which you are working ➡️' id="question-language" className="border-1 border-slate-100 outline-none px-2 rounded-md shadow-sm text-sm w-[95%] mx-2 font-normal py-2" />
                    </div>

                    <div className="question-code flex flex-col items-start px-2 text-start gap-2 text-slate-600 font-semibold mt-4">
                        <span className='mx-2'>Add your code 🧑‍💻 in which you are getting error ❌</span>
                        <AceEditor
                            className='scrollbar scrollbar-thumb-[#fb6976]'
                            placeholder="Add the code in which you are facing an issue⬇️"
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            mode={'javascript'}
                            theme='dracula'
                            style={{ height: "16rem", width: "calc(98%)", borderRadius: "10.5px" }}
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
                            onChange={(value) => { setCode(value) }}
                            onPaste={(value) => { setCode(value) }}
                        />
                    </div>

                    <div className="question-error flex flex-col items-start px-2 text-start gap-2 text-slate-600 font-semibold mt-4">
                        <span className='mx-2'>Add the error 🥲 you are facing (optional)</span>
                        <AceEditor
                            className='scrollbar scrollbar-thumb-[#fb6976] shadow-sm'
                            placeholder="Add the error you are getting if possible"
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            mode={'javascript'}
                            theme='xcode'
                            style={{ height: "10rem", width: "calc(98%)", borderRadius: "10.5px" }}
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
                            onChange={(value) => { setError(value) }}
                            onPaste={(value) => { setError(value) }}
                        />
                    </div>

                    <div className='w-full text-center'>
                        <button className='text-white text-sm font-semibold px-4 py-2 rounded-md bg-[#fb6976] mt-4' onClick={() => {
                            if (!question || !code || !language) {
                                toast.error("Fill the required fields")
                                return
                            }
                            setAdd(true)
                        }}>
                            Share question with Community 📤
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
