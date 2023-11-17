import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { auth, db, storage } from '../Firebase/Firebase'
import friends from '../../images/micro/friends.png'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'
import { ref, getDownloadURL, } from 'firebase/storage'
import chat from '../../images/micro/chat.png'
import post from '../../images/micro/post.png'
import { useNavigate } from 'react-router-dom'
import userimg from '../../images/micro/user.png'
import { AuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Vieworadd() {

    const [loaded, setLoaded] = useState(false)
    const [banner, setbannersrc] = useState("")
    const [already, setalready] = useState(false)
    const navigate = useNavigate("/")
    const { user, setauthLoad } = useContext(AuthContext)

    const [dataToShow, setDataToShow] = useState({
        username: "",
        usercountry: "",
        useroneliner: "",
        userskills: [],
        userdescription: "",
        userprofile: "",
        friends: []
    })

    const getBannerUrlFromStorage = useCallback(async () => {
        try {
            const banner = ref(storage, 'profileBanner/' + localStorage.getItem("currentUserToView"))
            await getDownloadURL(banner).then((url) => {
                setbannersrc(url)
            }).catch((error) => {
                // console.log("Banner not available add it" + error);
            })
        } catch (error) {
            console.log("Banner not set yet");
        }
    }, [])

    const addFriend = async () => {

        if (already) {
            toast.success(`${dataToShow.username.split(" ")[0]} is already your friend`)
            return
        }
        setauthLoad(30)
        const wannaBeFriendId = localStorage.getItem("currentUserToView")
        const wannaBeFriendDoc = doc(db, wannaBeFriendId, wannaBeFriendId + "_userdata")
        const selfdoc = doc(db, auth.currentUser.uid, auth.currentUser.uid + "_userdata")

        try {
            //updating the wanna be friend ka db
            await updateDoc(wannaBeFriendDoc, {
                received: arrayUnion({
                    requesterName: user.username,
                    requesterId: user.useruid,
                    requesterProfile: user.userprofile
                })
            })

            //updating khud ka db

            await updateDoc(selfdoc, {
                sent: arrayUnion({
                    sentName: dataToShow.username,
                    sentId: localStorage.getItem("currentUserToView"),
                    sentProfile: dataToShow.userprofile
                })
            })
            toast.success("Sent request successfully")
        } catch (e) {
            toast.error(e.message)
            console.log(e.message);
        }
        setauthLoad(100)
    }

    useEffect(() => {
        setLoaded(true)

        const checkFriend = async () => {
            const selfdoc = doc(db, auth.currentUser.uid, auth.currentUser.uid + "_userdata")
            const data = (await (getDoc(selfdoc))).data()
            const friends = data.friendlist

            friends.forEach(element => {
                if (element.id === localStorage.getItem("currentUserToView")) {
                    setalready(true)
                    return
                }
            });
        }

        const getUserDataToView = async () => {
            const userdoc = doc(db, localStorage.getItem("currentUserToView"), localStorage.getItem("currentUserToView") + "_userdata")
            const data = (await (getDoc(userdoc))).data()
            setDataToShow({
                username: data.username,
                usermail: data.email,
                usercountry: data.country,
                useroneliner: data.oneliner,
                userskills: data.skills,
                userdescription: data.description,
                userprofile: data.profile_pic,
                friends: data.friendlist
            })
        }

        checkFriend()
        getUserDataToView()
        getBannerUrlFromStorage()
    }, [getBannerUrlFromStorage])

    return (
        <div className={`p-4 relative fade-slide-in ${loaded ? "loaded" : ""} relative`}>
            <button className='mb-2 text-sm font-semibold text-slate-600 transition-all duration-500 hover:text-[#fb6976]' onClick={() => {
                navigate("/community")
            }}>
                &larr; Back to community
            </button>
            <div className="banner w-full h-44 rounded-2xl banner_color ">
                {banner && <img src={banner} alt="" className='w-full h-full object-cover rounded-2xl' />}
            </div>
            <div className="left w-[20%] h-full absolute top-40 mt-2">
                <div className="userdataholder">
                    <div className="image-holder w-40 h-40 p-1 border-4 border-[#fb6976] rounded-full mx-auto bg-white">
                        <img src={dataToShow.userprofile ? dataToShow.userprofile : userimg} className='w-full h-full rounded-full object-cover' alt="" />
                    </div>
                    <div className="usernameandemail text-3xl mt-2 font-bold text-slate-600 capitalize tracking-tight flex flex-col items-center">
                        {dataToShow.username}
                        <div className='normal-case text-xs text-slate-400 tracking-normal font-normal'>
                            {dataToShow.usermail}
                        </div>
                    </div>
                    <div className="other-data text-sm text-slate-600 font-semibold mt-2">
                        <div className="country flex justify-center items-center gap-2">
                            {dataToShow.usercountry && <ReactCountryFlag
                                className='rounded-lg'
                                countryCode={dataToShow.usercountry}
                                svg
                                style={{
                                    height: '1.8em',
                                    width: '1.8em'
                                }} />}
                            {countryList().getLabel(dataToShow.usercountry)}
                        </div>
                        {dataToShow.useroneliner && <div className="oneliner flex justify-center items-center gap-1">
                            <div className='bg-[#fb6976] rounded-full w-3 h-3'></div>
                            {dataToShow.useroneliner}
                        </div>}
                    </div>
                    <div className="actions text-sm font-semibold text-white mx-auto flex flex-col gap-2 items-center mt-3">
                        <button className='bg-[#b1ccfc] flex justify-center items-center gap-2 w-40 py-2 rounded-md' onClick={addFriend}>{!already ? "Add as friend" : "Added as friend"}</button>

                        <button className='bg-[#ffb8b8] flex justify-center items-center gap-2 w-40 py-2 rounded-md'>Chat with {dataToShow.username.split(" ")[0]} <img src={chat} className='w-4 h-4' alt="" /></button>

                        <button className='bg-[#ebe5e5] flex justify-center items-center gap-2 w-40 py-2 rounded-md'>See all questions<img src={post} className='w-4 h-4' alt="" /></button>

                        <button className='bg-[#eee] flex justify-center items-center gap-2 w-40 py-2 rounded-md'>Community posts<img src={friends} className='w-4 h-4' alt="" /></button>
                    </div>
                </div>
            </div>

            <div className="right absolute w-[75%] right-7 mt-3 pb-4">
                <div className=' text-2xl text-slate-600 font-bold tracking-tight'>
                    Skills ➡️
                </div>
                <div className="skills h-[7rem] bg-white p-4 form-shadow mt-2 rounded-2xl flex flex-wrap justify-start gap-2">

                    {dataToShow.userskills.map(skill => {
                        return (
                            <div className='px-4 py-1 h-fit rounded-3xl font-semibold text-sm text-slate-600 capitalize border border-slate-100'>
                                {skill}
                            </div>
                        )
                    })}

                    {dataToShow.userskills.length === 0 && <div className='text-xl w-full text-center flex justify-center items-center font-bold text-slate-400 tracking-tight'>No skills added yet by {dataToShow.username.split(" ")[0]} ❌</div>}
                </div>
                <div className=' text-2xl text-slate-600 font-bold tracking-tight mt-3'>
                    Little about {dataToShow.username.split(" ")[0]} 😊
                </div>
                <div className="skills bg-white p-4 text-sm font-semibold text-slate-500 form-shadow mt-2 rounded-2xl flex flex-wrap justify-start gap-2 min-h-[11rem]">
                    {dataToShow.userdescription}
                    {!dataToShow.userdescription && <div className='text-xl w-full h-full font-bold text-slate-400 tracking-tight text-center flex items-center'>No description set by {dataToShow.username.split(" ")[0]} ❌</div>}
                </div>
            </div>
        </div >
    )
}
