import React, { useState, useEffect, useContext } from 'react'
import Reset from '../../images/micro/reset.png'
import success from '../../images/micro/success.png'
import failure from '../../images/micro/failure.png'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { auth } from '../Firebase/Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import PopMessage from '../Popups/Others/PopMessage';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import UserNotFound from '../UserNotFound';

export default function ResetPassword(props) {
    const navigate = useNavigate('/')
    const [loaded, setLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState("")
    const { setauthLoad, authenticated } = useContext(AuthContext)

    useEffect(() => {
        setLoaded(true);
    }, []);

    function getResetPasswordEmail() {
        setauthLoad(30)
        const btn = document.getElementById('passwordresetbutton');
        const mail = document.getElementById('resetwithemail').value;
        btn.textContent = 'Sending Email'
        btn.disabled = true;
        btn.classList.remove('background-grad')
        btn.classList.add('disabled-background')

        sendPasswordResetEmail(auth, mail).then(() => {
            setauthLoad(100)
            btn.textContent = 'Get Reset Email'
            btn.disabled = false;
            btn.classList.remove('disabled-background')
            btn.classList.add('background-grad')
            setModal(true)
            return;
        }).catch((error) => {
            setauthLoad(100)
            setError(error.message.split("/")[1].split(")")[0])
            btn.textContent = 'Get Reset Email'
            btn.disabled = false;
            btn.classList.remove('disabled-background')
            btn.classList.add('background-grad')
            setModal(true)
            return;
        })
    }

    const navigateUser = () => {
        navigate('/')
    }

    return (
        <>
            <Modal
                size='25rem'
                isOpen={modal}
                toggle={() => {
                    setModal(!modal)
                }}>
                <ModalHeader title={null} toggle={() => {
                    setModal(!modal)
                }} className='text-gray-500 font-semibold capitalize'>{error ? error : `please check your inbox`}</ModalHeader>
                <ModalBody className='flex justify-center'>{error ? <PopMessage src={failure} main="Oops!" sub="Failed to send Email" description='Password reset process has been failed, please press continue to proceed to home' clickFunction={navigateUser} /> : <PopMessage src={success} main="Email Sent!" sub={`Reset your Password`} description='Reset password process has been done successfully, please press continue to proceed to home page' clickFunction={navigateUser} />}</ModalBody>
            </Modal>

            {authenticated ? <div className={`text-center mt-20 w-[31rem] py-5 mx-auto border border-gray-400 rounded-xl fade-slide-in ${loaded ? 'loaded' : ''}`}>
                <div className="img">
                    <img src={Reset} alt="" className="resetimg mx-auto" />
                </div>
                <div className="email text-gray-500 text-2xl font-semibold">Reset Password</div>
                <div><input type="email" id="resetwithemail" className="emailInput border border-gray-300 py-[0.75rem] w-[20.75rem] rounded-sm pl-5 text-sm mt-4 text-gray-600" placeholder='Email' /></div>
                <div className="reset"><button id='passwordresetbutton' className='background-grad text-white text-sm font-semibold py-3 w-[20.75rem] rounded-md mt-4' onClick={getResetPasswordEmail}>Get Reset Email</button></div>
            </div > : <div className='h-[70vh] flex justify-center items-center'>
                <UserNotFound />
            </div>}
        </>
    )
}
