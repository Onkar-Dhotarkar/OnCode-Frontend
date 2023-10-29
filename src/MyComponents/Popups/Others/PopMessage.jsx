import React from 'react'

export default function PopMessage(props) {
    return (
        <div className='pop-wrapper text-center w-[35vw] mx-auto rounded-md px-5'>
            <div className="img mt-1">
                <img className='w-16 mx-auto' src={props.src} alt="" />
            </div>
            <div className="main-message mt-3 text-slate-600 font-bold text-2xl tracking-tight">{props.main}</div>
            <div className="sub-message mt-1 text-xl tracking-tight font-semibold text-slate-500">{props.sub}</div>
            <div className="description-msg w-80 mx-auto text-sm mt-3 text-slate-500 px-2 py-1">{props.description}</div>
            <div className="proceed-btn mt-3">
                <button className="background-grad py-[0.69rem] mt-2 w-9/12 text-white text-sm font-semibold rounded-md" onClick={props.clickFunction}>
                    {props.content}
                </button>
            </div>
        </div>
    )
}
