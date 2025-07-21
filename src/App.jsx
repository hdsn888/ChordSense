import { useState, useEffect} from 'react'
import axios from 'axios';
import "./style.css";
import * as Tone from "tone";
// const apiCall = async () => {
//  try {
//   await axios.get('http://localhost:3001/');
//   console.log("apiCall is functioning");
//   return 0;
//  } catch (error) {
//     console.log(error);
//     return 1;
//  }
// }

// const urls = {"C4": "C4.mp3", "E4": "E4.mp3", "G4": "G4.mp3"};

// chords are queried and fetched from backend
const getChords = async() => {
  try {
    console.log("About to send request and fetch response");
    const promise  = await fetch("http://localhost:3001/chords");
    console.log("Promise received");
    // if (!promise.ok) {
    //   throw new Error("");
    // }
    const chords = await promise.json();
    return chords;
    // console.log(chords[0].Link);
    // const audio = new Audio (chords[0].Link);
    // audio.play();
  } catch (error) {
    console.log(error);
    return ([{error: "Chords fetching failed"}]);
  }
}

const playMusic = (chords) => {
    // console.log(chords[0].Link);
    // const audio = new Audio (chords[0].Link);
    // audio.play();
    const sampler = new Tone.Sampler({
      urls: {"C4": "C4.mp3", "E4": "E4.mp3", "G4": "G4.mp3", "B4": "B4.mp3"},
      release: 1,
      baseUrl: "../public/",
    }).toDestination();

    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(chords.get("C7").notes);
    });
}

function MyButton({count, onClick}) {
  return (
    <button onClick = {e => { 
      e.stopPropagation();
      onClick();
      }}>
      Clicked {count} times
    </button>
  );
}

function Header() {
  return (
    <div>
      <h1 className = "object-scale-down m-4 text-7xl text-center">ChordSense</h1>
      <h4 className = "text-center">Music theory explained simply</h4>
    </div>
  );
}

// function ChordList() {
//   let listChords = chords.map(chord => <li key = {chord.id}> {chord.name} </li>);
//   return <ul>{listChords}</ul>;
// }

export default function App() { // file can only have one default export
  const [chords, setChords] = useState([]); //hook
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchChords = async () => {
      console.log("App is rendering...");
      const data = await getChords();
      const chords = new Map(data.map(chord => [chord.chord_name, chord]));
      console.log(chords);
      setChords(chords);
      if (data.error !== "Chords fetching failed") {
        setIsReady(true);
      }
    };
    
    fetchChords();
  }, []);



  // props - information passed from its parent component
  return (
    <div className = "grid grid-cols-8 gap-4 items-center content-center">

      <div className = "col-span-2 col-start-4 place-items-center">
        <Header />
      </div>
      <div className = "col-span-2 col-start-7">
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
          <li><a>Home</a></li>
          <li><a>About</a></li>
          <li><a>Contact</a></li>
        </ul>
      </div>
      {/* <ChordList /> */}
      {/*<MyButton count = {count} onClick = {handleClick} />*/}
      {isReady && <div className = "dropdown dropdown-bottom">
      <div tabIndex = {0} role = "button" className = "btn btn-soft col-start-4 col-span-2">Chords</div>
        <ul tabIndex = {0} className = "dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-1 shadow-sm">
          <li><a onClick = {() => playMusic(chords)}>CMaj7</a></li>
          <li><a>C7</a></li>
          <li><a>Cm7</a></li>
        </ul> 
      </div>}
      {/* <button>
        <img src = "/CMaj.png" alt = "CMaj chord"/>
      </button> */}

    </div>
  );
}