import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { BarLoader } from 'react-spinners'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'
import post from '../../images/micro/post.png'
import mail from '../../images/micro/mail.png'
import friends_white from '../../images/micro/friends.png'
import friends from '../../images/micro/friends_theme.png'
import search from '../../images/micro/search.png'
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
        // <div className='w-full h-[80vh] text-5xl font-bold tracking-tight text-slate-800 flex justify-center items-center gap-2'>
        //     <div className='w-5 h-5 bg-[#fb6976] rounded-full mt-1'></div>
        //     Working on it....
        // </div>
        <div className='h-[calc(100vh-30px)] flex overflow-hidden'>
            <div className="border-r-[1px] left w-[24%] h-full text-center py-3">
                <div className="heading text-slate-600 font-semibold text-xl tracking-tight flex justify-center items-center gap-3">
                    Recent Questions
                    <button className='bg-[#fb6976] text-sm font-semibold text-white px-3 py-[0.33rem] rounded-md'>New post</button>
                </div>
                <input type="text" placeholder='Search for your questions' className='text-slate-600 border text-sm border-slate-100 px-3 py-[0.32rem] rounded-lg mt-3 w-[80%]' />
                <div className="questions w-[80%] mx-auto">
                    <div className="question flex justify-center items-center gap-2 cursor-pointer py-2 rounded-md mt-2 hover:bg-[#eee] transition-all duration-500">
                        <div className='border-2 border-[#fb6976] w-11 h-11 rounded-full p-[2px]'>
                            <img src={user.userprofile} style={{ borderRadius: "50%" }} className='w-full h-full' alt="" />
                        </div>
                        <div className="question-content text-xs font-semibold text-slate-600 text-start w-[71%]">How to add app router in Next.js 13...</div>
                    </div>
                </div>
            </div>
            <div className="community-home w-[55%]">
                <div className="about-user mt-3">
                    <div className='flex justify-start ml-10 items-center gap-3'>

                        <div className='w-32 h-32 p-[4px] rounded-full border-4 border-[#fb6976]'>
                            <img src={user.userprofile} style={{ borderRadius: "50%" }} className='w-full h-full object-cover' alt="" />
                        </div>

                        <div className='text-4xl font-bold text-slate-600 tracking-tight'>
                            <div className='capitalize'>
                                {user.username}
                            </div>
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

                            <div className="btns text-white text-sm font-semibold flex justify-start items-center gap-2 mt-1">
                                <button className='bg-[#fb6976] flex justify-center items-center gap-2 px-3 py-2 rounded-md'>Post Question
                                    <img src={post} className='w-4 h-4' alt="" />
                                </button>
                                <button className='bg-gray-300 flex justify-center items-center gap-2 px-3 py-2 rounded-md'>See all friends
                                    <img src={friends_white} className='w-4 h-4 mt-1' alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* starting the questions timeline */}
                <div className="q-wrapper mt-4  ">
                    <div className="posts h-[calc(60vh)] scrollbar-thin scrollbar-thumb-[#fb6976] scrollbar-track-gray-200 overflow-y-scroll hover:scrollbar-thumb-red-200 rounded-md">

                        <div className='post'>

                        </div>

                    </div>
                </div>
            </div>

            <div className="right border-l-[1px] left w-[24%] h-full text-center py-3">
                <div className='flex justify-center gap-3 text-xs font-semibold text-slate-600'>
                    <div className='flex justify-center items-center flex-col cursor-pointer'>
                        <img className='w-5 h-5' src={mail} alt="" />
                        Notifications
                    </div>
                    <div className='flex justify-center items-center flex-col cursor-pointer'>
                        <img className='w-5 h-5' src={friends} alt="" />
                        Friend Requests
                    </div>
                </div>
                <div className="search-friends flex justify-center items-center gap-2 mx-3 mt-3">
                    <input type="text" placeholder='Search for more people and add friends' className='text-slate-600 border text-sm border-slate-100 px-3 py-[0.32rem] rounded-lg w-[80%] outline-[#fb6976]' />
                    <button className='bg-[#fb6976] p-1 w-7 h-7 rounded-full flex justify-center items-center'>
                        <img className='w-3' src={search} alt="" />
                    </button>
                </div>
            </div>
        </div >
    )
}