import { useState, useEffect} from 'react'
import axios from 'axios';
import "./style.css";
import * as Tone from "tone";


// sampler used for all chords
const sampler = new Tone.Sampler({
    urls: {"C4": "C4.mp3", "E4": "E4.mp3", "G4": "G4.mp3", "B4": "B4.mp3", 
      "C5": "C5.mp3", "B5": "B5.mp3", "E5": "E5.mp3", "G5": "G5.mp3"},
    release: 1,
    baseUrl: "/",
})
sampler.toDestination();

// chords are queried and fetched from backend
const getChords = async() => {
  try {
    console.log("About to send request and fetch response");
    const promise  = await fetch("http://localhost:3001/chords");
    console.log("Promise received");
    const chords = await promise.json();
    return chords;
  } catch (error) {
    console.log(error);
    return ([{error: "Chords fetching failed"}]);
  }
}

// Plays specified chord
const playChord = async ({chords, chord}) => {
  sampler.triggerAttackRelease(chords.get(chord).notes, 2.5);
}

// Plays specified note
const playNote = async (note) => {
  sampler.triggerAttackRelease(note, 2.5);
}

//Sets buttons to correct chord
const ChordButtons = ({chords, chord}) => {
  return (
    <div className = "flex flex-row shrink-0" >
      {chords.get(chord).notes.map((note) => (
        <div key = {note} className = "w-40 m-2">
          <button className = "object-cover btn-sm" onClick = {() => playNote(note)}>
            <img src = {`/${note}.png`} className = "w-32 h-20" />  {/* w-32 h-20*/}
          </button>
            <p className = "p-5">{note}</p>
        </div>
      ))}
      <div className = "w-40 m-2">
        <button className = "object-cover btn-sm" onClick = {() => playChord({chords, chord})}>
          <img src = {`/${chord}.png`} className = "w-36 h-20" />
        </button>
          <p className = "p-5">{chord}</p>
      </div>
      
    </div>
  );
}

// remember to pass all parent states as props to children
// [...chords] - destructuring, converting map to array
// awaits tone within dropdown to decrease tone delay when a note / button is pressed

const RootDropdown = ({setIsShowing, setCurrChord, chords}) => {

  useEffect (() => {
    setIsShowing(true);
  }, []); 

  return (
    <div>
      <div className = "dropdown dropdown-bottom ">
      <div tabIndex = {0} role = "button" className = "p-6 w-xs btn btn-soft ">
        Chord
      </div>
      <ul tabIndex = {0} className = "dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-1 shadow-sm">
        {[...chords].map(([chord_name, notes]) => (
          <li key = {chord_name}><a onClick = {async () => {
            setCurrChord(chord_name);
            await Tone.start();
            }}>
            {chord_name}
          </a></li>
        ))}
      </ul> 
      </div>
    </div>
  );
}

const ChordDropdown = ({setIsShowing, setCurrChord, chords}) => {

  useEffect (() => {
    setIsShowing(true);
  }, []); 

  return (
    <div>
      <div className = "dropdown dropdown-bottom ">
      <div tabIndex = {0} role = "button" className = "p-6 w-xs btn btn-soft ">
        Chord
      </div>
      <ul tabIndex = {0} className = "dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-1 shadow-sm">
        {[...chords].map(([chord_name, notes]) => (
          <li key = {chord_name}><a onClick = {async () => {
            setCurrChord(chord_name);
            await Tone.start();
            }}>
            {chord_name}
          </a></li>
        ))}
      </ul> 
      </div>
    </div>
  );
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

export default function App() { // file can only have one default export
  const [chords, setChords] = useState([]); //hook
  const [isReady, setIsReady] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [currChord, setCurrChord] = useState(null);


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
      <div className = "col-start-4 col-span-2 m-10" >
        {isReady && <RootDropdown setIsShowing = {setIsShowing} 
        setCurrChord = {setCurrChord} chords = {chords}/> 
        }
      </div>
      <div className = "col-start-4 col-span-4">
       
        {isShowing && currChord && <ChordButtons chords = {chords} chord = {currChord} />}
      </div>

    </div>
  );
}