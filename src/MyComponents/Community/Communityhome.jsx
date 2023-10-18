import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { BarLoader } from 'react-spinners'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'
import friends from '../../images/micro/friends.png'
import post from '../../images/micro/post.png'
import ReactSyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'




export default function Communityhome() {

    //using auth context 
    const { user } = useContext(AuthContext)

    const [countryCode, setCountryCode] = useState("")
    const [oneLiner, setOneLiner] = useState("")

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, user.useruid, user.useruid + "_userdata");
            setCountryCode((await getDoc(docRef)).data().country)
            setOneLiner((await getDoc(docRef)).data().oneliner)
        }
        getData()
    }, [user.useruid])

    return (
        <div className='h-[calc(100vh-38px)] flex'>
            <div className="border-r-[1px] left w-[24%] h-full text-center py-3">
                <div className="heading text-slate-600 font-semibold text-xl tracking-tight flex justify-center items-center gap-3">
                    Recent Questions
                    <button className='bg-[#fb6976] text-sm font-semibold text-white px-3 py-[0.33rem] rounded-md'>New post</button>
                </div>
                <input type="text" placeholder='Search for your questions' className='text-slate-600 border text-sm border-slate-100 px-3 py-2 rounded-lg mt-3 w-[80%]' />
                <div className="questions w-[80%] mx-auto">
                    <div className="question flex justify-center items-center gap-2 cursor-pointer py-2 rounded-md mt-2 hover:bg-[#eee] transition-all duration-500">
                        <div className='border-2 border-[#fb6976] w-11 h-11 rounded-full p-[2px]'>
                            <img src={user.userprofile} className='rounded-full object-cover' alt="" />
                        </div>
                        <div className="question-content text-sm font-semibold text-slate-600 text-start w-[67%]">How to add app router in Next.js 13...</div>
                    </div>
                </div>
            </div>
            <div className="community-home w-[55%]">
                <div className="about-user mt-3">
                    <div className='flex justify-start ml-10 items-center gap-3'>
                        <div className='w-32 h-32 p-[4px] rounded-full border-4 border-[#fb6976]'>
                            <img src={user.userprofile} className='rounded-full object-cover' alt="" />
                        </div>
                        <div className='text-5xl font-bold text-slate-600 tracking-tight'>
                            {user.username}
                            <div className="details flex items-center justify-start gap-2 text-slate-600 font-semibold text-sm tracking-normal">
                                <div className='w-3 h-3 rounded-full bg-[#fb6976]'></div>
                                {countryCode !== null && <ReactCountryFlag
                                    className='rounded-lg'
                                    countryCode={countryCode}
                                    svg
                                    style={{
                                        height: '2.3em',
                                        width: '2.3em'
                                    }} />}
                                {countryCode === null ? <label>Add your nationality</label> : countryCode ? countryList().getLabel(countryCode) : <BarLoader cssOverride={{ width: 80, height: 3, borderRadius: 4 }} color='#fb6976' />}
                                <div className='w-3 h-3 rounded-full bg-[#fb6976]'></div>
                                {oneLiner === null ? <label>Add a one liner about yourself</label> : oneLiner ? oneLiner : <BarLoader cssOverride={{ width: 80, height: 3, borderRadius: 4 }} color='#fb6976' />}
                            </div>
                        </div>
                    </div>
                    <div className="btns text-white text-sm font-semibold flex justify-start items-center gap-2 mt-3 ml-10">
                        <button className='bg-[#fb6976] flex justify-center items-center gap-2 px-3 py-2 rounded-md'>Post Question
                            <img src={post} className='w-4 h-4' alt="" />
                        </button>
                        <button className='bg-gray-300 flex justify-center items-center gap-2 px-3 py-2 rounded-md'>See all friends
                            <img src={friends} className='w-4 h-4 mt-1' alt="" />
                        </button>
                    </div>
                </div>
                {/* starting the questions timeline */}
                <div className="q-wrapper mt-4  ">
                    <div className="posts h-[calc(60vh)] overflow-y-scroll scroll-smooth rounded-md">
                        <div className="post  px-5 py-3 rounded-md bg-[#eee]">
                            <div className="question flex gap-2 justify-start items-center font-semibold text-slate-600">
                                <div className='w-4 h-4 rounded-full bg-[#fb6976]'></div>
                                You posted a question on 6th October 2023
                            </div>
                            <div className="question-content font-semibold text-sm text-slate-600 mt-2">
                                Hey friends i am having an error set up in app router in next js 13 can anyone help me in this.I am a beginner in programming so i don't know about next js router that much
                            </div>
                            <div className="codeanderror font-semibold text-slate-600 mt-2">
                                <div className="code">
                                    Code
                                    <ReactSyntaxHighlighter language={'javascript'} className='px-5 py-3 mb-2 h-fit rounded-md' customStyle={{ width: "100%" }} style={atomOneDark} wrapLongLines={true}>
                                        {`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);`}
                                    </ReactSyntaxHighlighter>
                                </div>
                                <div className="error">
                                    Error
                                    <ReactSyntaxHighlighter language={'javascript'} className='px-5 py-3 mb-2 h-fit rounded-md' customStyle={{ width: "100%" }} style={atomOneDark} wrapLongLines={true}>
                                        {` render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }`}
                                    </ReactSyntaxHighlighter>
                                </div>
                            </div>
                            <div className="responses flex mt-3 gap-3 text-slate-600 font-semibold justify-start items-center">
                                Total responses 3
                                <button className='bg-[#fb6976] text-white text-sm px-3 py-2 rounded-md'>See all Responses</button>
                            </div>
                        </div>
                        <div className="post mt-4 px-5 py-3 rounded-md bg-[#eee]">
                            <div className="question flex gap-2 justify-start items-center font-semibold text-slate-600">
                                <div className='w-4 h-4 rounded-full bg-[#fb6976]'></div>
                                You posted a question on 6th October 2023
                            </div>
                            <div className="question-content font-semibold text-sm text-slate-600 mt-2">
                                Hey friends i am having an error set up in app router in next js 13 can anyone help me in this.I am a beginner in programming so i don't know about next js router that much
                            </div>
                            <div className="codeanderror font-semibold text-slate-600 mt-2">
                                <div className="code">
                                    Code
                                    <ReactSyntaxHighlighter language={'javascript'} className='px-5 py-3 mb-2 h-fit rounded-md' customStyle={{ width: "100%" }} style={atomOneDark} wrapLongLines={true}>
                                        {`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);`}
                                    </ReactSyntaxHighlighter>
                                </div>
                                <div className="error">
                                    Error
                                    <ReactSyntaxHighlighter language={'javascript'} className='px-5 py-3 mb-2 h-fit rounded-md' customStyle={{ width: "100%" }} style={atomOneDark} wrapLongLines={true}>
                                        {` render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }`}
                                    </ReactSyntaxHighlighter>
                                </div>
                            </div>
                            <div className="responses flex mt-3 gap-3 text-slate-600 font-semibold justify-start items-center">
                                Total responses 3
                                <button className='bg-[#fb6976] text-white text-sm px-3 py-2 rounded-md'>See all Responses</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right border-l-[1px] left w-[24%] h-full text-center py-3">

            </div>
        </div >
    )
}
