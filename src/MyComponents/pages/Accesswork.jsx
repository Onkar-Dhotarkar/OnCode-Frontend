import codes from '../../images/bgs/js.png'
import snip from '../../images/bgs/cmd.png'
import success from '../../images/micro/success.png'
import right from '../../images/micro/right-arrow.png'
import a3 from '../../images/bgs/abs3.svg'
import a4 from '../../images/bgs/abs4.svg'
import UserNotFound from '../UserNotFound'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Accesscodes() {

    const navigate = useNavigate("/")
    const [loaded, setLoaded] = useState(false)
    const { authenticated, setauthLoad } = useContext(AuthContext)
    const arr = [
        {
            cardId: "c1", cardSrc: codes, cardTask: "Get Codes", cardDesc: (<div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Add on Codes</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Oragnize them</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Stay Optimized</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Get easy access</div>
            </div>), onClick: () => {
                navigate("/console")
            }
        },
        {
            cardId: "c3", cardSrc: snip, cardTask: "Utility Commands", cardDesc: (<div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Add on commands</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />No need to memorize</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Stay always prepared</div>
                <div className='flex items-center my-2'><img src={success} alt="" className='w-6 mr-3' />Setup projects</div>
            </div>), onClick: ''
        }
    ]
    useEffect(() => {
        setauthLoad(30)
        setTimeout(() => {
            setLoaded(true)
            setauthLoad(100)
        }, 1000);
    }, [setauthLoad])
    return (
        <>
            <div className={`fade-slide-in ${loaded ? 'loaded' : ''} overflow-hidden`}>
                {authenticated ? <div>
                    <div className={`img1 relative mx-auto max-w-[800px] ${authenticated ? 'block' : 'hidden'}`}>
                        <img src={a3} alt="" className="absolute w-[560px] left-[-350px] -z-10 bottom-[-380px] opacity-10" />
                        <img src={a4} alt="" className="absolute w-[350px] right-[-250px] -z-10 bottom-[-620px] opacity-50" />
                    </div >
                    <div className='codepage flex justify-center mx-auto flex-wrap px-4 py-5 rounded-lg mt-2'>
                        {arr.map((element) => {
                            return <div className='w-[30rem] flex flex-col justify-center items-center px-8 py-4 rounded-2xl shadow-xl space-y-3 mx-3 bg-gray-100/5 backdrop-filter backdrop-blur-lg'>
                                <div className="task_img">
                                    <img src={element.cardSrc} alt="" className='w-[110px] h-[110px] object-cover rounded-full' />
                                </div>
                                <div className="main text-3xl text-slate-900 font-semibold">
                                    {element.cardTask}
                                </div>
                                <div className="sub text-lg font-semibold tracking-tight text-slate-700 text-center">
                                    {element.cardDesc}
                                </div>
                                <div className="btn outline-none">
                                    <button class=" w-[17.75rem] background-grad py-3 my-2 font-semibold text-white text-base rounded-md flex justify-center items-center gap-3" onClick={element.onClick}>
                                        Start
                                        <img src={right} alt="" className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        })
                        }
                    </div ></div> : <div className='flex h-[75vh] items-center'><UserNotFound /></div>}
            </div>
        </>
    )
}
