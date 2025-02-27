import SignUp from "./MyComponents/auth/SignUp";
import Login from "./MyComponents/auth/LogIn";
import ResetPassword from "./MyComponents/auth/ResetPassword";
import LandingPage from "./MyComponents/Home/LandingPage";
import UpdateProfile from "./MyComponents/auth/UpdateProfile";
import Accesscodes from "./MyComponents/pages/Accesswork";
import SelectLang from "./MyComponents/pages/Selectlang";
import Codes from "./MyComponents/pages/Codes"
import Codeview from "./MyComponents/pages/Codeview";
import Compiler from "./MyComponents/pages/Compiler";
import Aboutus from './MyComponents/pages/Aboutus'
import { Toaster } from 'react-hot-toast'
import LoadingBar from 'react-top-loading-bar'
import Webeditor from "./MyComponents/pages/Webeditor";
import Communityhome from "./MyComponents/Community/Communityhome";
import Vieworadd from "./MyComponents/Community/Vieworadd";
import Addquestion from "./MyComponents/Community/Addquestion";
import Commands from "./MyComponents/pages/Commands";
import Commandview from "./MyComponents/pages/Commandview";

import { auth } from "./MyComponents/Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import profile_pic from './images/micro/user.png'
import { useContext } from "react";
import { AuthContext } from "./MyComponents/contexts/AuthContext"
import { useEffect } from "react";
import MyContextLayout from "./MyComponents/LayoutContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";



function App()  {
  const { authenticated, setAuthenticated, user, setUser, authLoad, setauthLoad } = useContext(AuthContext)

  useEffect(() => {
    setauthLoad(20)
    const user = auth.currentUser;
    if (user) {
      setAuthenticated(true)
      setUser({
        useruid: user.uid,
        username: user.displayName,
        usermail: user.email,
        userprofile: user.photoURL ? user.photoURL : profile_pic,
        userdate: user.metadata.creationTime.substring(0, 16)
      })
    } else {
      setAuthenticated(false)
      setUser({
        useruid: '',
        username: '',
        userprofile: '',
        userdate: ''
      })
    }

    onAuthStateChanged(auth, (u) => {
      if (u) {
        setAuthenticated(true)
        setUser({
          useruid: u.uid,
          username: u.displayName,
          usermail: u.email,
          userprofile: u.photoURL ? u.photoURL : profile_pic,
          userdate: u.metadata.creationTime.substring(0, 16)
        })

      } else {
        setAuthenticated(false)
        setUser({
          useruid: '',
          username: '',
          userprofile: '',
          userdate: ''
        })
      }
    })
    setauthLoad(100)
  }, [setAuthenticated, setUser, setauthLoad])

  return (
    <div>
      <div className="capitalize text-slate-600 font-semibold text-sm">
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                color: "#475569"
              },
              iconTheme: {
                primary: '#fb6976',
              },
            },

            error: {
              style: {
                color: "#475569"
              },
              iconTheme: {
                primary: '#fb6976',
              },
            },
          }}
        />
      </div>

      <Router>
        {<div className='flex justify-between min-h-[50px] items-center mx-auto shadow-md px-10 sticky top-0 z-30 bg-white '>
          <LoadingBar
            color='#fb6976'
            height={3}
            progress={authLoad}
            onLoaderFinished={() => {
              setauthLoad(0)
            }}
          />



          <div className="main-name max-[900px]:w-full">
            <Link to="/" className='text-2xl font-bold text-slate-600 tracking-tight cursor-pointer no-underline'>
              <span className="text-[#fb6976]">On</span>Code<span className="text-[#fb6976]">.</span>
            </Link>
            {/* <div className="svg absolute">
              <img className='w-36 relative bottom-[95px] left-[-60px] -z-50 opacity-70' src={a2} alt="" />
            </div> */}
          </div>
          <div className="hamburger hidden max-[900px]:block">
            hamburger
          </div>

          <div className="nav-components flex justify-between items-center space-x-6 max-[900px]:hidden">
            <Link to='/community'>
              <button className='font-semibold text-sm transition-all text-slate-600 hover:text-[#fb6976]'>
                Explore Community
              </button>
            </Link>
            {/* <button id='log-handler' className='text-slate-600 font-semibold rounded-md text-sm flex justify-center items-center gap-2 transition-all hover:text-[#fb6976]'>
              Contact Us
            </button> */}
            <Link to='/we'>
              <button className='font-semibold text-sm transition-all text-slate-600 hover:text-[#fb6976]'>
                We
              </button>
            </Link>
            <div className="profile w-72 flex items-center">
              <Link to='/console'>
                <button id='log-handler' className={`font-semibold w-[7rem] px-1 py-[0.52rem] rounded-md text-sm mr-8 transition-all ${authenticated ? 'text-[#fb6976] hover:bg-red-100' : 'text-slate-400 hover:bg-gray-200'}`} disabled={!authenticated}>
                  Go to Console
                </button>
              </Link>

              <div className="relative">

                <Link to='/profile'>
                  <img id="profile_icon" src={authenticated ? user.userprofile : profile_pic} alt="" className={`userProfile w-[2.2rem] h-[2.2rem] rounded-full cursor-pointer object-cover ${authenticated ? 'border-profile' : ''}`} />
                </Link>
              </div>

              <div className={`current-username text-slate-400 font-semibold tracking-tight text-sm ml-2 capitalize`}>
                {user.username ? user.username.split(" ")[0] + '...' : 'No log'}
              </div>
            </div>
          </div >
        </div >
        }
        {/* Router setup  */}
        < Routes >
          <Route path="/" Component={LandingPage} />
          <Route path="/create-account" Component={SignUp} />
          <Route path="/log-into-account" Component={Login} />
          <Route path="/resetpassword" Component={ResetPassword} />
          <Route path="/profile" Component={UpdateProfile} />
          <Route path="/access-your-work" Component={Accesscodes} />
          <Route path="/reset-password" Component={ResetPassword} />
          <Route path="/we" Component={Aboutus} />
          <Route path="/userview" Component={Vieworadd} />
          <Route path="/add-question-to-community" Component={Addquestion} />
          <Route path="/commands" Component={Commands} />
          <Route path="/commandview" Component={Commandview} />
          <Route element={<MyContextLayout />}>
            <Route path="/console" Component={SelectLang} />
            <Route path="/codes" Component={Codes} />
            <Route path="/codeview" Component={Codeview} />
            <Route path="/editor" Component={Compiler} />
            <Route path="/web-editor" Component={Webeditor} />
            <Route path="/community" Component={Communityhome} />
          </Route>
        </ Routes>
      </Router >
    </div >
  )

}
export default App;
