import React, { useContext } from 'react'
import collab from '../../../images/micro/collaboration.png'
import { AuthContext } from '../../contexts/AuthContext'

export default function Collab(props) {
    const { user } = useContext(AuthContext);

    function validate() {
        Array.from(document.getElementsByClassName('inp')).forEach((element) => {
            if (!element.value) {
                element.style.backgroundColor = '#f8d7da'
            } else {
                element.style.backgroundColor = '#d1e7dd'
            }
        })
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={collab} className='w-20 h-20' alt="" />
            <div className="heading text-xl my-2 text-slate-600 font-semibold">Collab with others and work together</div>
            <div onChange={validate} className='flex flex-col w-4/6 justify-center items-center'>
                <input id='rid' className='inp mt-2 mb-1 w-[100%] border border-gray-300 py-[0.65rem] px-3 text-base text-slate-600 rounded-sm' type="text" placeholder='Room' onChange={props.handleRoomIdChange} />
                <input className='inp my-1 w-[100%] border border-gray-300 py-[0.65rem] px-3 text-base text-slate-600 capitalize rounded-sm' type="text" placeholder='Name' value={user.username} />
            </div>
            <span className='text-sm my-2 text-slate-600'>Don't have a room id ? <span className='cursor-pointer text-[#fb6976]' onClick={props.clickFunction}>
                Generate one
            </span></span>
            <button id='join' className='background-grad my-2 w-4/6 py-3 rounded-md px-1 font-semibold text-sm text-white' onClick={() => {
                props.joinFunction()
            }}>Join Room</button>
        </div>
    )
}
