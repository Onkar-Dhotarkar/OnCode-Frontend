import React, { useCallback, useEffect, useState } from 'react'
import profile from '../../images/micro/user.png'
import banner_img from '../../images/micro/banner.png'
import cam from '../../images/micro/camera.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../Firebase/Firebase'
import { Modal, ModalBody } from 'reactstrap'
import Loader from '../Popups/Others/Loader'
import PopMessage from '../Popups/Others/PopMessage'

export default function Banner() {
    const [modal, setModal] = useState('')
    const [settingbanner, isBannerSetting] = useState('')
    const { authenticated, user, setauthLoad } = useContext(AuthContext)
    const [bannersrc, setbannersrc] = useState(null)
    const [file, setfile] = useState('')

    const getBannerUrlFromStorage = useCallback(async () => {
        try {
            const banner = ref(storage, 'profileBanner/' + user.useruid)
            await getDownloadURL(banner).then((url) => {
                setbannersrc(url)
            }).catch((error) => {
                console.log("Banner not available add it" + error);
            })
        } catch (error) {
            console.log("Banner not set yet");
        }
    }, [user.useruid])

    useEffect(() => {
        getBannerUrlFromStorage()
    }, [user, getBannerUrlFromStorage])

    async function setBanner() {
        isBannerSetting(true)
        setauthLoad(30)
        const banner = ref(storage, 'profileBanner/' + user.useruid)
        await uploadBytes(banner, file)
        console.log("uploaded");
        getBannerUrlFromStorage()
        isBannerSetting(false)
        setModal(false)
        setauthLoad(100)
    }

    return (
        <>
            <Modal
                size='25rem'
                isOpen={modal}
                toggle={() => {
                    setModal(!modal)
                }} >
                <ModalBody className='flex justify-center items-center min-h-[50vh] p-5'>{settingbanner ? <Loader title="Setting profile banner" /> : <PopMessage
                    src={banner_img} main="Set Profile Banner" description={`Hey ${user.username}🚀Hit that button to set the banner image and make your profile stand out! 🌟 Let the creativity flow and showcase your style with a personalized touch. 🎨📸`} content="Set Banner" clickFunction={setBanner} />}
                </ModalBody>
            </Modal>

            <div className='w-[100vw] flex justify-center items-center mx-auto relative'>
                <div className="acc-images">
                    <div className="bg-banner w-[100vw] h-48 banner_color flex items-center relative">
                        <img className={`w-[100%] h-[100%] object-cover bg-blend-darken opacity-${bannersrc === null ? 0 : 100}`} src={bannersrc} alt="" />
                        <input type="file" className='opacity-0 w-0 hidden cursor-pointer pointer-events-none' id="bannerinput" onChange={(e) => {
                            if (e.target.files[0]) {
                                setfile(e.target.files[0])
                                setModal(true)
                            }
                        }} />
                        <label htmlFor="bannerinput" className='h-8 w-8 p-1 bg-white rounded-full flex justify-center items-center absolute right-10 bottom-3'>
                            <img className='h-[70%] w-[70%] ' src={cam} alt="" />
                        </label>
                        <div className='flex justify-between absolute z-20 px-2 py-[0.62rem] rounded-xl top-8 left-14 items-center'>
                            <Link to='/profile'>
                                <img className='w-44 h-44 max-w-[14rem] max-h-[14rem] object-cover rounded-full border-[5px] border-white cursor-pointer' src={authenticated ? user.userprofile : profile} alt="" />
                            </Link>
                            <div className='flex flex-col justify-start ml-10 gap-2 text-white'>
                                <span className='text-6xl font-semibold tracking-tight uppercase'>{authenticated ? user.username : ''}</span>
                                <span className='text-sm font-semibold ml-1'>Coding , Once in there is no way out...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
