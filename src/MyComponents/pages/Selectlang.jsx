import React, { useEffect, useState } from 'react'
import c from '../../images/bgs/c.png'
import cpp from '../../images/bgs/cpp.png'
import java from '../../images/bgs/python.png'
import python from '../../images/bgs/java.png'
import js from '../../images/bgs/js.png'
import html from '../../images/bgs/html.png'
import Banner from './Banner'
// import { addDoc, collection, getDocs } from 'firebase/firestore'
// import { db } from '../Firebase/Firebase'
import Loader from '../Popups/Others/Loader'
import { useContext } from 'react'
// import { DbContext } from '../contexts/DbContext'
import { AuthContext } from '../contexts/AuthContext'
import { LangContext } from '../contexts/LangContext'
import { useNavigate } from 'react-router-dom'
import UserNotFound from '../UserNotFound'

export default function SelectLang(props) {

    const navigate = useNavigate('')
    const [loading, setLoading] = useState(false)
    // const { setdbdata } = useContext(DbContext)
    const { authenticated, setauthLoad } = useContext(AuthContext)
    const { setlangDetails } = useContext(LangContext)

    useEffect(() => {
        setLoading(true)
        setauthLoad(30)
        if (authenticated) {
            setTimeout(() => {
                setLoading(false)
                setauthLoad(100)
            }, 1000);
        }
    }, [authenticated, setauthLoad])

    async function setLanguage(lang) {
        setauthLoad(30)
        setlangDetails(lang)
        setTimeout(() => {
            navigate("/codes")
            setauthLoad(100)
        }, 1000);
    }

    const categories = [
        {
            imageSrc: c,
            onClick: '',
            mainCategaory: 'c',
            description: 'C is a general-purpose programming language created by Dennis Ritchie at the Bell Laboratories in 1972. It is a very popular language, despite being old.'
        }, {
            imageSrc: cpp,
            onClick: '',
            mainCategaory: 'c++',
            description: 'C++ is a high-level, general-purpose programming language created by Danish computer scientist Bjarne Stroustrup.'

        }, {
            imageSrc: python,
            onClick: '',
            mainCategaory: 'java',
            description: 'Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.'
        }, {
            imageSrc: java,
            onClick: '',
            mainCategaory: 'python',
            description: 'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation via the off-side rule.'
        }, {
            imageSrc: js,
            onClick: '',
            mainCategaory: 'javascript',
            description: 'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.'
        }, {
            imageSrc: html,
            onClick: '',
            mainCategaory: 'HTML Template',
            description: 'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.'
        }
    ]

    return (
        <div className='overflow-x-hidden'>
            {
                authenticated ? loading ?
                    <div className='mt-[15%] flex justify-center items-center'> <Loader title='Just few moments' /> </div>
                    : <div className={`fade-slide-in ${!loading ? 'block loaded' : 'hidden'}`}>
                        <Banner />
                        <div className="lang-category mt-3 flex flex-wrap justify-center mx-auto gap-4 min-h-fit px-3 py-5">
                            {
                                categories.map((element, index) => {
                                    return (
                                        <div className="langs w-96 min-h-fit bg-gray-100 px-6 py-[0.87rem] rounded-xl shadow-md">
                                            <div className='flex justify-between items-center'>
                                                <div className="langname text-3xl capitalize font-bold text-slate-800">{element.mainCategaory}</div>
                                                <div className="langpic">
                                                    <img className='w-16 rounded-full' src={element.imageSrc} alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="description text-sm text-slate-600 my-2 h-32 w-60">
                                                    {element.description}
                                                </div>
                                            </div>
                                            <button id="gotocodes" className='w-[14rem] text-white background-grad font-semibold text-sm px-3 py-[0.9rem] mb-3 rounded-md' onClick={() => {
                                                index < 5 ? setLanguage(element.mainCategaory) : console.log("another function to be implemented");
                                            }}>
                                                Get  {element.mainCategaory}  codes
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : <div className='h-[70vh] flex justify-center items-center'>
                    <UserNotFound />
                </div>
            }
        </div>
    )
}

