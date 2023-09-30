import React, { useEffect, useState } from 'react'
import html from '../../images/bgs/html.png'
import css from '../../images/bgs/css.png'
import js from '../../images/bgs/js.png'
import codepic from '../../images/bgs/pic.png'
import light from '../../images/micro/light.png'
import codeskills from '../../images/micro/codeskills.png'
import dark from '../../images/micro/moon.png'
import next from '../../images/micro/right-arrow.png'
import copy from '../../images/micro/copy.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import figma_1 from '../../images/micro/figma_2.png'
import AceEditor from 'react-ace'
import Loader from '../Popups/Others/Loader'

export default function PlayWebDemo() {
    const [theme, setTheme] = useState(true)
    const [htmlcode, sethtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calculator in HTML CSS & JavaScript</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <input type="text" placeholder="Equation" class="display" />

      <div class="buttons">
        <button class="operator" data-value="AC">AC</button>
        <button class="operator" data-value="DEL">DEL</button>
        <button class="operator" data-value="%">%</button>
        <button class="operator" data-value="/">/</button>

        <button data-value="7">7</button>
        <button data-value="8">8</button>
        <button data-value="9">9</button>
        <button class="operator" data-value="*">*</button>

        <button data-value="4">4</button>
        <button data-value="5">5</button>
        <button data-value="6">6</button>
        <button class="operator" data-value="-">-</button>

        <button data-value="1">1</button>
        <button data-value="2">2</button>
        <button data-value="3">3</button>
        <button class="operator" data-value="+">+</button>

        <button data-value="0">0</button>
        <button data-value="00">00</button>
        <button data-value=".">.</button>
        <button class="operator" data-value="=">=</button>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>`)
    const [csscode, setcssCode] = useState(`@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e3eb;
}
.container {
  position: relative;
  max-width: 230px;
  height:80%;
  width: 100%;
  border-radius: 12px;
  padding: 10px 20px 20px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
}
.display {
  height: 80px;
  width: 100%;
  outline: none;
  border: none;
  text-align: right;
  margin-bottom: 10px;
  font-size: 21.5px;
  color: #000e1a;
  pointer-events: none;
}
.buttons {
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(4, 1fr);
}
.buttons button {
  padding: 3px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  background-color: #eee;
}
.buttons button:active {
  transform: scale(0.99);
}
.operator {
  color: #58c0ab;
}`)
    const [jscode, setjsCode] = useState(`const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

//Define function to calculate based on button clicked.
const calculate = (btnValue) => {
  display.focus();
  if (btnValue === "=" && output !== "") {
    //If output has '%', replace with '/100' before evaluating.
    output = eval(output.replace("%", "/100"));
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    //If DEL button is clicked, remove the last character from the output.
    output = output.toString().slice(0, -1);
  } else {
    //If output is empty and button is specialChars then return
    if (output === "" && specialChars.includes(btnValue)) return;
    output += btnValue;
  }
  display.value = output;
};

//Add event listener to buttons, call calculate() on click.
buttons.forEach((button) => {
  //Button click listener calls calculate() with dataset value as argument.
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});`)
    const [sourceDoc, setSourceDoc] = useState('')
    const [language, setLanguage] = useState('html')
    const [changes, setChanges] = useState(false)
    const navigate = useNavigate('')

    const handleEditorChange = (value) => {
        setChanges(true)
        if (language === 'html') {
            sethtmlCode(value)
        }
        else if (language === 'css') {
            setcssCode(value)
        }
        else {
            setjsCode(value)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setChanges(true)
            setSourceDoc(`
                <html>  
                  <body>${htmlcode}</body>
                  <style>${csscode}</style>
                  <script>${jscode}</script>
                 </html>
            `)
            setChanges(false)
        }, 550)
        return () => {
            clearTimeout(timeout)
        }
    }, [htmlcode, csscode, jscode])

    return (
        <div className='flex flex-col items-center gap-1 mt-28'>
            <div className="heading text-3xl font-semibold text-slate-700 flex flex-col justify-center items-center">
                <img src={codeskills} className='w-8 h-8' alt="" />
                Compile on the fly with our web tool
            </div>
            <div className="intro text-slate-600 w-4/6 font-semibold text-sm flex justify-center items-center pt-3 pb-4 gap-3">
                <div span className='px-3' >
                    Embark on a journey of exploration and mastery in HTML, CSS, and JavaScript, right within our intuitive web-based tool. We've crafted a simple yet effective environment for you to create and experiment with web pages. As we continuously evolve, stay tuned for exciting updates and advanced features in the near future. Dive in and enhance your skills by practicing with this basic calculator example. Create your own web pages, indulge in the joy of coding, and let the learning adventure begin. Happy coding!
                </div >
                <img className='w-32 h-32 object-cover rounded-full pr-1' src={figma_1} alt="" />
            </div >
            <div className="buttons mt-4 flex justify-between items-center px-2 w-4/6">
                <div className='flex gap-1'>
                    <button className={`first-line:langButton ${language === 'html' ? 'background-grad' : 'bg-gray-300'} cpp w-24 flex justify-center items-center gap-2 text-white font-semibold text-sm px-1 py-2 rounded-sm`} onClick={() => {
                        setLanguage('html')
                    }}>
                        <img className='w-5 h-5' src={html} alt="" />
                        Html
                    </button>
                    <button className={`langButton py w-24 flex justify-center items-center gap-2 ${language === 'css' ? 'background-grad' : 'bg-gray-300'} text-white font-semibold text-sm px-1 py-2 rounded-sm`} onClick={() => {
                        setLanguage('css')
                    }}>
                        <img className='w-5 h-5' src={css} alt="" />
                        Css
                    </button>
                    <button className={`langButton java w-24 flex justify-center items-center gap-2 ${language === 'js' ? 'background-grad' : 'bg-gray-300'} text-white font-semibold text-sm px-1 py-2 rounded-sm`} onClick={() => {
                        setLanguage('js')
                    }}>
                        <img className='w-5 h-5 rounded-full' src={js} alt="" />
                        Js
                    </button>
                </div>

                <div className='remBtns flex justify-center items-center gap-1 '>
                    <button id='copy' className="text-slate-700 font-semibold text-xs px-3 py-2 flex justify-center rounded-md" onClick={() => {
                        toast.success("Code copied!")
                        navigator.clipboard.writeText(language === 'html' ? htmlcode : language === 'css' ? csscode : jscode)
                    }}>
                        <img className='w-5 h-5' src={copy} alt="" />
                    </button>
                    <img className='bg-gray-300 p-2 rounded-full w-9 h-9 cursor-pointer' onClick={() => {
                        setTheme(!theme)
                        toast.success("switched theme")
                    }} src={theme ? light : dark} alt="" />
                    <button className='background-grad text-white px-3 py-2 rounded-md text-sm font-semibold ml-3 flex justify-center gap-2 items-center' onClick={() => {
                        navigate("/web-editor")
                    }}>
                        Web Editor
                        <img className='w-3 h-3' src={next} alt="" />
                    </button>
                </div>
            </div>

            <div id className='w-[66%] h-[58vh] rounded-lg mt-2 shadow shadow-slate-300 flex justify-center items-center gap-1'>
                {changes ? (
                    <Loader title="Saving changes" />
                ) : (
                    <iframe
                        title="output-frame"
                        style={{
                            width: "36%",
                            height: "100%",
                            borderTopLeftRadius: "10px",
                            borderBottomLeftRadius: "10px",
                        }}
                        srcDoc={sourceDoc}
                    />
                )}
                <AceEditor
                    style={{ width: "calc(64%)", height: "calc(100%)", borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}
                    fontSize={14}
                    wrapEnabled={true}
                    theme={theme ? 'dracula' : 'xcode'}
                    mode={language === "html" ? "html" : language === "css" ? "css" : "jsx"}
                    value={language === 'html' ? htmlcode : language === 'css' ? csscode : jscode}
                    setOptions={{ useWorker: false }}
                    onChange={handleEditorChange}
                />
            </div>
        </div >
    )
}
