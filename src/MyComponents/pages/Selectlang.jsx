import React, { useEffect, useState } from 'react'
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
import html from '../../images/bgs/html.png'
import right_arrow from '../../images/micro/right-arrow.png'

import a1 from '../../images/bgs/abs1.svg'
import a2 from '../../images/bgs/abs4.svg'

import Banner from './Banner'
// import { addDoc, collection, getDocs } from 'firebase/firestore'
import Loader from '../Popups/Others/Loader'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { LangContext } from '../contexts/LangContext'
import { useNavigate } from 'react-router-dom'
import UserNotFound from '../UserNotFound'

export default function SelectLang(props) {

    const navigate = useNavigate('')
    const [loading, setLoading] = useState(false)
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
            imageSrc: assembly,
            onClick: '',
            mainCategaory: 'assembly',
            description: `A low-level language tied to CPU architecture, using mnemonic codes for machine-level instructions.`
        }, {
            imageSrc: c,
            onClick: '',
            mainCategaory: 'c',
            description: 'C is a general-purpose programming language created by Dennis Ritchie at the Bell Laboratories in 1972.'
        }, {
            imageSrc: cpp,
            onClick: '',
            mainCategaory: 'cpp',
            description: 'C++ extends C with object-oriented features, widely applied in systems programming and game development.'
        }, {
            imageSrc: clojure,
            onClick: '',
            mainCategaory: 'clojure',
            description: 'Clojure, a modern JVM language, emphasizes simplicity and immutability, making it suitable for concurrent programming.'
        }, {
            imageSrc: cobol,
            onClick: '',
            mainCategaory: 'cobol',
            description: 'COBOL, designed for business systems in 1959, remains vital for finance and administration.'
        }, {
            imageSrc: csharp,
            onClick: '',
            mainCategaory: 'c#',
            description: 'C# by Microsoft is an object-oriented language, known for its use in Windows and web development.'
        }, {
            imageSrc: dart,
            onClick: '',
            mainCategaory: 'dart',
            description: 'Dart, developed by Google, is used for mobile, web, and desktop applications, often with Flutter.'
        }, {
            imageSrc: erlang,
            onClick: '',
            mainCategaory: 'erlang',
            description: 'Erlang is a concurrency-focused language, ideal for scalable and fault-tolerant systems.'
        }, {
            imageSrc: go,
            onClick: '',
            mainCategaory: 'golang',
            description: 'Go is recognized for simplicity and efficiency, a preferred choice for scalable server-side applications.'
        }, {
            imageSrc: java,
            onClick: '',
            mainCategaory: 'java',
            description: 'Introduced in the mid-90s, Java is versatile and widely used for cross-platform applications.'
        }, {
            imageSrc: js,
            onClick: '',
            mainCategaory: 'javascript',
            description: 'Javascript is a scripting language essential for web development, enabling dynamic content and interactivity.'
        }, {
            imageSrc: julia,
            onClick: '',
            mainCategaory: 'julia',
            description: 'Julia is a high-performance language designed for scientific computing and data science.'
        }, {
            imageSrc: kotlin,
            onClick: '',
            mainCategaory: 'kotlin',
            description: 'Kotlin is a modern, statically typed programming language that runs on the Java Virtual Machine (JVM).'
        }, {
            imageSrc: lua,
            onClick: '',
            mainCategaory: 'lua',
            description: 'Lua is a lightweight scripting language commonly used in game development.'
        }, {
            imageSrc: php,
            onClick: '',
            mainCategaory: 'php',
            description: 'PHP is a server-side scripting language widely used for dynamic web pages and web development.'
        }, {
            imageSrc: python,
            onClick: '',
            mainCategaory: 'python',
            description: 'Python, known for readability, is versatile and widely used in various domains.'
        }, {
            imageSrc: rust,
            onClick: '',
            mainCategaory: 'rust',
            description: 'Rust is a safe and performant language, designed for systems programming with a focus on memory safety.'
        }, {
            imageSrc: scala,
            onClick: '',
            mainCategaory: 'scala',
            description: 'Scala is a hybrid language combining object-oriented and functional programming, commonly used for scalable applications.'
        }, {
            imageSrc: swift,
            onClick: '',
            mainCategaory: 'swift',
            description: 'Swift, developed by Apple, is used for iOS, macOS, watchOS, and tvOS applications.'
        }, {
            imageSrc: typescript,
            onClick: '',
            mainCategaory: 'typescript',
            description: 'TypeScript, a superset of JavaScript, adds static typing for large-scale development.'
        }, {
            imageSrc: html,
            onClick: '',
            mainCategaory: 'HTML Template',
            description: 'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.'
        }
    ]

    return (
        <div className='overflow-hidden'>
            {
                authenticated ? loading ?
                    <div className='mt-[15%] flex justify-center items-center'> <Loader title='Just few moments' /> </div>
                    : <div className={`fade-slide-in ${!loading ? 'block loaded' : 'hidden'}`}>
                        <Banner />
                        <img className='w-[68%] absolute left-[400px] bottom-[71rem] -z-10 opacity-10' src={a1} alt="" />
                        <img className='w-[78%] absolute left-[0px] bottom-[20rem] -z-10 opacity-40' src={a2} alt="" />
                        <img className='w-[60%] absolute left-[200px] bottom-[-2rem] -z-10 opacity-10' src={a1} alt="" />
                        <div className="lang-category mt-3 flex flex-wrap justify-center mx-auto gap-3 min-h-fit px-3 py-5">
                            {
                                categories.map((element, index) => {
                                    return (
                                        <div className="langs w-96 min-h-fit bg-transparent px-5 py-3 rounded-xl form-shadow backdrop-blur-3xl">
                                            <div className='flex justify-between items-center h-16'>
                                                <div className="langname text-3xl capitalize font-bold text-slate-800">{element.mainCategaory}</div>
                                                <div className="langpic">
                                                    <img className={`${index === 10 || index === 19 ? "rounded-full" : ""} w-16 drop-shadow-lg`} src={element.imageSrc} alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="description text-sm text-slate-600 my-2 h-20 w-60">
                                                    {element.description}
                                                </div>
                                            </div>
                                            <button id="gotocodes" className='w-[14rem] text-white background-grad font-semibold text-sm px-3 py-[0.9rem] mb-3 rounded-md capitalize flex justify-center items-center gap-2' onClick={() => {
                                                index < 20 && setLanguage(element.mainCategaory)
                                            }}>
                                                {element.mainCategaory}
                                                <img src={right_arrow} className='w-3 h-3' alt="" />
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

