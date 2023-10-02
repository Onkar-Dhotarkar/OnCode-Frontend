import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import mail from '../../images/micro/mail.png'
import heart from '../../images/micro/heart.png'
import share from '../../images/micro/profshare.png'
import friends from '../../images/micro/friends.png'
import options from '../../images/micro/dots.png'
import edit from '../../images/micro/edit.png'
import codeskills from '../../images/micro/codeskills.png'
import log from '../../images/micro/exit.png'
import exit from '../../images/micro/logout.png'
import cam from '../../images/micro/camera.png'
import profimg from '../../images/micro/banner.png'
import UserNotFound from '../UserNotFound'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import PopMessage from '../Popups/Others/PopMessage'
import { signOut, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ChangeName from '../Popups/ProfilePopup/ChangeName'
import Loader from '../Popups/Others/Loader'
import { BarLoader } from 'react-spinners'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import ChangeSkills from '../Popups/ProfilePopup/ChangeSkills'
import { doc, getDoc } from 'firebase/firestore'
import ChangeDescription from '../Popups/ProfilePopup/ChangeDescription'
import ChangeOthers from '../Popups/ProfilePopup/ChangeOthers'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'

export default function UpdateProfile() {

    const { user, authenticated, setauthLoad } = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)
    const [profilePopup, setProfilePopup] = useState(false)
    const [skillspopup, setSkillsPopup] = useState(false)
    const [descPopup, setDescPopup] = useState(false)
    const [logout, setLogout] = useState(false)
    const [fetchedskills, setfetchedskills] = useState([])
    const [fetchedesc, setfetchedesc] = useState("")
    const [fetchedcountry, setfetchedcountry] = useState("")
    const [fetchedline, setfetchedline] = useState("")
    const navigate = useNavigate("")


    //states for the updation popups
    const [username, setUsername] = useState(false)
    const [profile_popup, setProfile_popup] = useState(false) //for modal popup
    const [profile_image, setProfile_image] = useState("") //for picture file 
    const [setting_profile, setSetting_profile] = useState(false) //for setting profile
    const [user_skills, setUserskills] = useState(false)
    const [user_desc, setUserdesc] = useState(false)
    const [user_others, setUserothers] = useState(false)

    useEffect(() => {
        setauthLoad(30)
        async function getData() {
            try {
                const docRef = doc(db, user.useruid, user.useruid + "_userdata");
                const skills = (await getDoc(docRef)).data().skills;
                const desc = (await getDoc(docRef)).data().description;
                const country = (await getDoc(docRef)).data().country;
                const line = (await getDoc(docRef)).data().oneliner;

                setfetchedskills(skills)
                setfetchedesc(desc)
                setfetchedcountry(country)
                setfetchedline(line)

                console.log(!desc + "s");
                if (skills.length === 0) {
                    setfetchedskills(null)
                }
                if (!desc) {
                    setfetchedesc(null)
                }
                if (!country) {
                    setfetchedcountry(null)
                }
                if (!line) {
                    setfetchedline(null)
                }
            } catch (e) {
                //error
            }
        }
        getData()
        setLoaded(true)
        setauthLoad(100)
    }, [setauthLoad, user.useruid])

    async function signOutFromCurrentAccount() {
        setauthLoad(30)
        await signOut(auth)
        setTimeout(() => {
            setauthLoad(100)
            setLogout(false)
        }, 1000);
        navigate("/")
        toast.success("Logged out from current account")
    }

    async function setProfilePicture() {
        setauthLoad(30)
        setSetting_profile(true)
        const image = ref(storage, 'profilePictures/' + user.useruid);
        await uploadBytes(image, profile_image);
        const url = await getDownloadURL(image)
        await updateProfile(auth.currentUser, {
            photoURL: url
        })
        setProfile_popup(false)
        setSetting_profile(false)
        setauthLoad(100)
        toast.success("Profile picture updated")
        navigate("/")
    }

    return (
        <>
            <Modal isOpen={logout} toggle={() => setLogout(!logout)}>
                <ModalHeader className='text-slate-600' toggle={() => setLogout(!logout)}>
                    Logout from current account
                </ModalHeader>
                <ModalBody className="flex items-center">
                    <PopMessage src={log} main="Logout For Now" description="After logging out, you will not be able to access any of our coding facilities" content="Log out" clickFunction={signOutFromCurrentAccount} />
                </ModalBody>
            </Modal>

            {/* Profile updation modals */}
            <Modal isOpen={username} toggle={() => setUsername(!username)}>
                <ModalHeader className='text-slate-600' toggle={() => setUsername(!username)}>
                    Change your profile name
                </ModalHeader>
                <ModalBody className="flex items-center">
                    <ChangeName />
                </ModalBody>
            </Modal>

            <Modal
                size='25rem'
                isOpen={profile_popup}
                toggle={() => {
                    setProfile_popup(!profile_popup)
                }} >
                <ModalHeader toggle={() => {
                    setProfile_popup(!profile_popup)
                }} className='text-gray-500 capitalize font-semibold'>{setting_profile ? 'Setting profile picture' : 'Continue setting profile'}</ModalHeader>
                <ModalBody className='flex justify-center items-center min-h-[50vh]'>{setting_profile ? <Loader title="Setting profile picture" /> : <PopMessage
                    src={profimg} main="Set Profile Picture" sub="Persolize your profile with a picture" description={`Hey ${user.username}, hit the button to set the profile image of yours`} content="Set Profile" clickFunction={setProfilePicture} />}
                </ModalBody>
            </Modal>

            <Modal isOpen={user_skills} toggle={() => setUserskills(!user_skills)} size='lg'>
                <ModalHeader className='text-slate-600' toggle={() => setUserskills(!user_skills)}>
                    Persolize so other folks can see your skills
                </ModalHeader>
                <ModalBody className="flex items-center justify-center">
                    <ChangeSkills />
                </ModalBody>
            </Modal>

            <Modal isOpen={user_desc} toggle={() => setUserdesc(!user_desc)} size='lg'>
                <ModalHeader className='text-slate-600' toggle={() => setUserdesc(!user_desc)}>
                    Add a description so other folks can know you more
                </ModalHeader>
                <ModalBody className="flex items-center justify-center">
                    <ChangeDescription />
                </ModalBody>
            </Modal>

            <Modal isOpen={user_others} toggle={() => setUserothers(!user_others)}>
                <ModalHeader className='text-slate-600' toggle={() => setUserothers(!user_others)}>
                    Add your country location and a one liner
                </ModalHeader>
                <ModalBody className="flex items-center">
                    <ChangeOthers />
                </ModalBody>
            </Modal>

            {authenticated ? <div className={`main_container fade-slide-in ${loaded ? 'loaded' : ''}`} onClick={() => {
                if (profilePopup || skillspopup || descPopup) {
                    setProfilePopup(false)
                    setSkillsPopup(false)
                    setDescPopup(false)
                }
            }}>
                <div className='w-3/4 mx-auto'>
                    <div className="current-user-details relative">
                        <div className="user-profile w-32 h-32 rounded-full border-3 border-[#fb6976] p-[2px] absolute left-[45%] top-4">
                            <img className='w-full h-full rounded-full object-cover shadow-2xl cursor-pointer' src={user.userprofile} alt="" />
                            <input type="file" id="selectprof" className='w-0 h-0 opacity-0 hidden' onChange={(e) => {
                                if (e.target.files[0]) {
                                    // toast.success("oye")
                                    setProfile_image(e.target.files[0])
                                    setProfile_popup(true)
                                }
                            }} />
                            <label htmlFor="selectprof" className='absolute top-0 right-1 shadow-md w-8 h-8 cursor-pointer p-[0.38rem] bg-white rounded-full'>
                                <img src={cam} alt="" />
                            </label>
                        </div>

                        <div className='text-2xl text-slate-800 font-bold w-full text-start px-5 pt-1 pb-4 shadow shadow-slate-50 rounded-xl relative top-24 z-10'>
                            <div className='mt-3 capitalize'>
                                {user.username ? user.username : <BarLoader cssOverride={{ width: 80, height: 3, borderRadius: 4 }} color='#fb6976' />
                                }
                            </div>
                            <div className="email text-base text-slate-600 font-semibold flex justify-start items-center gap-2 mt-2">
                                <img src={mail} className='w-5 h-5' alt="" />
                                {user.usermail}
                            </div>
                            <div className='text-sm text-slate-600 font-semibold flex items-center gap-2 mt-1 ml-[0.15rem]'>
                                <div className="countryname flex items-center gap-2">
                                    <div className='w-3 h-3 background-grad rounded-full'></div>
                                    {fetchedcountry !== null && <ReactCountryFlag
                                        className='rounded-lg'
                                        countryCode={fetchedcountry}
                                        svg
                                        style={{
                                            height: '2.3em',
                                            width: '2.3em'
                                        }} />}
                                    {fetchedline === null ? <label>Add your nationality</label> : fetchedcountry ? countryList().getLabel(fetchedcountry) : <BarLoader cssOverride={{ width: 80, height: 3, borderRadius: 4 }} color='#fb6976' />}
                                </div>
                                <div className='flex justify-start items-center gap-2 capitalize'>
                                    <div className='w-3 h-3 background-grad rounded-full'></div>
                                    {fetchedline === null ? <label>Add a one liner about yourself</label> : fetchedline ? fetchedline : <BarLoader cssOverride={{ width: 80, height: 3, borderRadius: 4 }} color='#fb6976' />}
                                </div>
                            </div>
                            <div className='flex gap-2 mt-1'>
                                <button className='text-sm font-semibold text-white background-grad flex justify-center items-center gap-2 px-4 py-2 rounded-md mt-2'>
                                    <img src={share} className='w-4 h-4' alt="" /> Share profile
                                </button>
                                <button className='text-sm font-semibold text-white bg-gray-300 flex justify-center items-center gap-2 px-4 py-2 rounded-md mt-2'>
                                    <img src={friends} className='w-4 h-4 mt-1' alt="" /> See all friends
                                </button>
                            </div>
                            <div className="options absolute right-5 top-12" onClick={() => {
                                setProfilePopup(!profilePopup)
                            }}>
                                <img src={options} className='w-6 h-6 cursor-pointer' alt="" />
                            </div>
                            <button className="logout text-slate-400 font-semibold flex justify-start items-center gap-2 absolute right-5 top-36 text-sm" onClick={() => {
                                setLogout(true)
                            }}>
                                Logout
                                <img src={exit} className='w-5 h-5 cursor-pointer' alt="" />
                            </button>
                            <div className={`popup fade-slide-in absolute right-11 top-12 font-normal text-sm text-slate-400 rounded-lg p-3 bg-white w-48 shadow-md ${profilePopup ? 'loaded' : '-z-50'}`}>

                                <div className="change_username p-2 border-b border-slate-100 
                            cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2" onClick={() => {
                                        setProfilePopup(false)
                                        setUsername(true)
                                    }}>
                                    <img src={edit} className='w-3 h-3' alt="" />
                                    Change username
                                </div>
                                <div className="change_profilepic p-2 border-b border-slate-100
                            cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2" onClick={() => {
                                        setProfilePopup(false)
                                        setUserothers(true)
                                    }}>
                                    <img src={edit} className='w-3 h-3' alt="" />
                                    Change others
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='personal-skills-in-coding font-bold w-full text-start px-5 pt-1 pb-4 shadow shadow-slate-50  rounded-xl relative top-24 mt-3'>
                        <div className="head font-bold text-2xl text-slate-800 mt-3 flex justify-start items-center gap-2">
                            My Skills
                            <img src={codeskills} className='w-6 h-6 mt-1' alt="" />
                        </div>
                        <div className='skills text-sm flex flex-wrap justify-start gap-2 mt-2 '>
                            {fetchedskills === null ? <label className='text-slate-600 border border-slate-100 font-semibold px-3 py-2 text-sm rounded-3xl cursor-pointer flex items-center justify-center gap-2 mt-2'>Show your skills</label> : fetchedskills.length !== 0 ? fetchedskills.map((element) => {
                                return (<div key={element} className='text-slate-600 font-semibold flex justify-center items-center border border-slate-400 w-fit px-4 py-1 rounded-lg capitalize'>
                                    {element}
                                </div>)
                            }) : <Loader />}
                            <div className="options absolute right-5 top-8">
                                <img src={options} onClick={() => {
                                    setSkillsPopup(!skillspopup)
                                }} className='w-6 h-6 cursor-pointer' alt="" />
                            </div>
                            <div className={`popup fade-slide-in absolute right-11 top-12 font-normal text-sm text-slate-400 shadow-md rounded-lg p-3 z-10 bg-white w-48 ${skillspopup ? 'loaded' : '-z-50'}`}>
                                <div className="p-2 border-b border-slate-100 
                            cursor-pointer hover:bg-gray-100 rounded-md flex gap-2 items-center" onClick={() => {
                                        setSkillsPopup(false)
                                        setUserskills(true)
                                    }}>
                                    <img src={codeskills} className='w-4 h-4 ' alt="" />
                                    Update your skills
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='personal-data font-bold w-full text-start px-5 pt-1 pb-[calc(35px)] shadow shadow-slate-50 rounded-xl relative top-24 mt-3 mb-4'>
                        <div className="head font-bold text-2xl text-slate-800 mt-3 flex justify-start items-center gap-2" >
                            Little about me
                            <img src={edit} className='w-4 h-4 mt-1' alt="" />
                        </div>
                        <div className='skills text-sm flex flex-wrap justify-start gap-2 mt-3 '>
                            <div className={`bio text-sm font-semibold text-slate-600 pr-5 ${!fetchedesc ? 'flex flex-col items-center w-full' : ''}`}>
                                <div className={`${fetchedesc != null ? '' : "ml-7"} text-start w-full`}>
                                    {fetchedesc === null ? <div className='flex justify-start items-center'>Add a short description about you and show your <span><img src={heart} className='w-3 h-3 mx-1 mt-[0.1rem]' alt="" /></span>for coding</div> : fetchedesc ? <div>
                                        {fetchedesc} <br />
                                    </div> : <Loader />}
                                </div>

                            </div>
                            <div className="options absolute right-5 top-8">
                                <img src={options} onClick={() => {
                                    setDescPopup(!descPopup)
                                }} className='w-6 h-6 cursor-pointer' alt="" />
                            </div>
                            <div className={`popup fade-slide-in absolute right-11 top-12 font-normal text-sm text-slate-400 shadow-md rounded-lg p-3 z-10 bg-white w-48 ${descPopup ? 'loaded' : '-z-50'}`}>

                                <div className="change_username p-2 border-b border-slate-100 
                            cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2" onClick={() => {
                                        setDescPopup(false)
                                        setUserdesc(true)
                                    }} >
                                    <img src={edit} className='w-3 h-3' alt="" />
                                    Change description
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='text-sm mt-32 mb-4 ml-2 text-start w-full font-semibold text-slate-800 flex justify-start items-center'>
                        Account created with <img src={heart} className='w-3 h-3 mx-1 mt-[0.1rem]' alt="" /> on {user.userdate}
                    </div>
                </div>
            </div >
                : <div className='h-[70vh] flex justify-center items-center'>
                    <UserNotFound />
                </div>
            }
        </>
    )
}