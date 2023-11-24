import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { auth, db, storage } from '../Firebase/Firebase'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'
import { ref, getDownloadURL, } from 'firebase/storage'
import userimg from '../../images/micro/user.png'
import { AuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Vieworadd() {

    const [loaded, setLoaded] = useState(false)
    const [banner, setbannersrc] = useState("")
    const [already, setalready] = useState(false)
    const { user, setauthLoad } = useContext(AuthContext)

    const [dataToShow, setDataToShow] = useState({
        username: "",
        usercountry: "",
        useroneliner: "",
        userskills: [],
        userdescription: "",
        userprofile: "",
        friends: [],
        questions: []
    })

    const getBannerUrlFromStorage = useCallback(async () => {
        try {
            const banner = ref(storage, 'profileBanner/' + localStorage.getItem("currentUserToView"))
            await getDownloadURL(banner).then((url) => {
                setbannersrc(url)
            }).catch((error) => {
                console.log("Banner not available add it" + error);
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
            console.log(localStorage.getItem("currentUserToView"));
            const userdoc = doc(db, localStorage.getItem("currentUserToView"), localStorage.getItem("currentUserToView") + "_userdata")
            const userquestions = doc(db, localStorage.getItem("currentUserToView"), localStorage.getItem("currentUserToView") + "_userquestions")
            const data = await getDoc(userdoc)
            const qs = await getDoc(userquestions)
            setDataToShow({
                username: data.data().username,
                usermail: data.data().email,
                usercountry: data.data().country,
                useroneliner: data.data().oneliner,
                userskills: data.data().skills,
                userdescription: data.data().description,
                userprofile: data.data().profile_pic,
                friends: data.data().friendlist,
                questions: qs.data().self_questions
            })
        }

        checkFriend()
        getUserDataToView()
        getBannerUrlFromStorage()
    }, [getBannerUrlFromStorage])

    return (
        <div className={` fade-slide-in ${loaded ? "loaded" : ""} relative`}>

            <div className="banner w-3/4 mx-auto h-80 rounded-2xl banner_color ">
                {banner && <img src={banner} alt="" className='w-full h-full object-cover rounded-2xl' />}
            </div>

            <div className="upper absolute w-full top-64">
                <div className="userdataholder flex items-center justify-between w-[70%] gap-4 mx-auto">
                    <div className='flex justify-start items-center gap-4 '>
                        <div className="image-holder w-44 h-44 p-1 border-4 border-[#fb6976] rounded-full bg-white">
                            <img src={dataToShow.userprofile ? dataToShow.userprofile : userimg} className='w-full h-full rounded-full object-cover bg-white' alt="" />
                        </div>
                        <div className="text-3xl capitalize font-bold text-slate-700 tracking-tight mt-12">
                            {dataToShow.username}
                            <div className="other-details text-sm font-semibold text-slate-600 tracking-normal flex justify-start items-center gap-2 ml-1">
                                <div className="country flex justify-start gap-2 items-center">
                                    {dataToShow.usercountry && <ReactCountryFlag
                                        className='rounded-lg'
                                        countryCode={dataToShow.usercountry}
                                        svg
                                        style={{
                                            height: '2em',
                                            width: '2em'
                                        }} />}
                                    {countryList().getLabel(dataToShow.usercountry)}
                                </div>
                                <div className="oneliner flex justify-start items-center gap-2">
                                    {dataToShow.useroneliner && <div className='w-3 h-3 rounded-full bg-[#fb6976]'></div>}
                                    {dataToShow.useroneliner}
                                </div>
                            </div>
                            <div className="friendcount text-sm font-semibold text-slate-600 tracking-normal ml-1">
                                friends {dataToShow.friends.length}
                            </div>
                        </div>
                    </div>

                    <div className='actions mt-12 flex justify-start items-center gap-2 mr-1'>
                        <button className='bg-[#fb6976] px-4 py-2 rounded-md text-white text-sm font-semibold' onClick={() => {
                            if (already) {
                                toast.success(`${dataToShow.username} is already your friend`)
                                return
                            }
                            addFriend()
                        }}>
                            {already ? "You are friends" : "Add as friend"}
                        </button>
                    </div>
                </div>
            </div >


            <div className="skills mt-32 form-shadow w-[70%] mx-auto p-4 rounded-2xl">
                <div className="heading text-slate-600  mx-auto text-xl font-bold">
                    Skills and knowledge ➡️
                </div>
                <div className="skills mt-3 flex flex-wrap gap-2">
                    {dataToShow.userskills.map((skill) => {
                        return (
                            <div className='px-3 py-2 border border-gray-100 capitalize rounded-3xl text-sm font-semibold text-slate-600'>
                                {skill}
                            </div>
                        )
                    })}
                    {dataToShow.userskills.length === 0 && <div className='text-sm font-semibold px-4 py-2 rounded-3xl border border-slate-100 w-fit'>No skills to show ❌</div>}
                </div>
            </div>

            <div className="about mt-4 form-shadow w-[70%] mx-auto p-4 rounded-2xl">
                <div className="heading text-slate-600 capitalize mx-auto text-xl font-bold">
                    About {dataToShow.username}
                </div>
                <div className="about mt-3 text-sm font-semibold ">
                    {!dataToShow.userdescription ? <div className='text-sm font-semibold px-4 py-2 rounded-3xl border border-slate-100 w-fit text-slate-600'>No description to show 👁️</div>
                        : <div>
                            {dataToShow.userdescription}
                        </div>}
                </div>
            </div>
        </div>
    )
}
