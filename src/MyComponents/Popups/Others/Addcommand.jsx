import React, { useContext, useState } from 'react'
import AceEditor from 'react-ace'
import { AuthContext } from '../../contexts/AuthContext'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase'
import toast from 'react-hot-toast'
import Loader from './Loader'

export default function Addcommand() {

    const { setauthLoad, user } = useContext(AuthContext)
    //states for holding data 
    const [cmdName, setcmdName] = useState("")
    const [cmdCode, setcmdCode] = useState("")

    const [adding, setAdding] = useState(false)

    const addCommand = async () => {
        if (!cmdName || !cmdCode) {
            toast.error("Fill the mandatory fields")
            return
        }
        setAdding(true)
        setauthLoad(30)
        const selfDoc = doc(db, user.useruid, user.useruid + "_usercodes")
        await updateDoc(selfDoc, {
            commands: arrayUnion({ commandName: cmdName, command: cmdCode })
        }).catch(() => {
            toast.error("Failed to add command")
            setauthLoad(100)
            return
        })

        toast.success("Added command successfully")
        setauthLoad(100)
        setAdding(false)
    }

    return (
        <>
            {!adding ? <div >
                <div className="heading text-3xl font-bold tracking-tight text-slate-600">
                    Setup new commands for a procedure ⚙️
                </div>
                <div className="command mt-3">
                    <input className='w-full p-2 rounded-md outline-none form-shadow border border-gray-100 text-sm text-slate-600' placeholder='Write in detail about the commands you are about to add➡️' onChange={(e) => setcmdName(e.target.value)} />
                    <AceEditor
                        className='scrollbar scrollbar-thumb-[#fb6976] rounded-xl mt-4 p-2 '
                        placeholder="Write your commands in an understandable way"
                        theme={'dracula'}
                        fontSize={14}
                        mode={"javascript"}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        style={{ height: "21rem", width: "calc(100%)" }}
                        wrapEnabled={true}
                        setOptions={{
                            useWorker: false,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                            wrap: true
                        }}
                        onChange={(value) => setcmdCode(value)}
                    />
                    <div className="add text-center">
                        <button className='bg-[#fb6976] text-sm font-semibold text-white px-4 py-2 mt-4 rounded-md' onClick={addCommand}>Add to commands +</button>
                    </div>
                </div>
            </div > : <div className='h-[40vh] flex justify-center items-center'><Loader title={"Adding command"} /></div>}
        </>

    )
}