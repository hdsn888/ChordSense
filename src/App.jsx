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

const YINTERVAL = 22.05; // distance of one whole-step (one ledger-line to the next)
const notePositions = new Map([
  ['C4', {cy: 66.375, xPath: 11.8, yPathStart: 63.35, yPathEnd: 5.35}],
  ['D4', {cy: 55.35, xPath: 11.8, yPathStart: 52.325, yPathEnd: -5.675}],
  ['E4', {cy: 44.325, xPath: 11.8, yPathStart: 41.3, yPathEnd: -16.7}],
  ['G4', {cy: 22.275, xPath: 11.8, yPathStart: 19.25, yPathEnd: -38.75}],
  ['B4', {cy: -0.225, xPath: -11.6, yPathStart: -1.025, yPathEnd: 59.025}],
  ['C5', {cy: -10.8, xPath:-11.6, yPathStart: -10, yPathEnd: 48}]

]);

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

const ChordDisplay = ({chords, chord}) => {
  return (
   <svg className = "w-full h-[300px] min-w-[400px] my-10 mx-auto block" viewBox = "-500 -100 1000 300">
      <rect
        x = "-500"
        y = "-100"
        width = "1000"
        height="300"
        fill = "#f6f6f6ff"
        rx="15" 
      />
      <path d = " M -500 -44 L 500 -44 M -500 -22 L 500 -22 M -500 0 L 500 0 M -500 22 L 500 22 M -500 44 L 500 44"
        stroke = "#000000ff"
        strokeWidth = "1.5"
      />

      {chords.get(chord).notes.map((note, index) => (
        <svg key = {note} className = "group" x={-250 + (index*100)} y="-100" width="100" height="300" viewBox="-50 -100 100 300" 
      onClick={() => playNote(note)} >
        <text className = "fill-black group-hover:fill-red-500" x = "-10" y = "150">{note}</text>
        <rect x="-50" y="-100" width="100" height="200" fill="transparent" />
        <ellipse className = "fill-black group-hover:fill-red-500" rx="14" ry="10.3" cx="0" cy={notePositions.get(note).cy} transform={`rotate(-28 0 ${notePositions.get(note).cy})`}/>
        <path
          className = "stroke-black group-hover:stroke-red-500"
          d = {`M ${notePositions.get(note).xPath} ${notePositions.get(note).yPathStart} L ${notePositions.get(note).xPath} ${notePositions.get(note).yPathEnd}`}
          strokeWidth="3"
        />
      </svg>
      ))}

      <svg className = "group" x = {-250 + chords.get(chord).notes.length*100} y="-100" width="100" height="300" viewBox="-50 -100 100 300" onClick = {() => playChord({chords, chord})} >
        <text className = "fill-black group-hover:fill-red-500" x = "-10" y = "150">{chord}</text>
        <rect x="-50" y="-100" width="100" height="200" fill="transparent" />
        {chords.get(chord).notes.map((note, index) => (
          <ellipse key = {note} className = "fill-black group-hover:fill-red-500" rx="14" ry="10.3" cx="0" cy={notePositions.get(note).cy} transform={`rotate(-28 0 ${notePositions.get(note).cy})`}/>
        ))}
        <path
          className = "stroke-black group-hover:stroke-red-500"
          d = {`M 11.8 ${notePositions.get(chords.get(chord).notes[0]).yPathStart} L 11.8 ${notePositions.get(chords.get(chord).notes[chords.get(chord).notes.length - 1]).yPathStart - 58}`}
          strokeWidth="3"
        />
      </svg>
      

      
    </svg>
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

const Navigation = () => {
  return (
    <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
      <li><a>Home</a></li>
      <li><a>About</a></li>
      <li><a>Contact</a></li>
    </ul>
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
    <div className = "object-scale-down text-center">
      <h1 className = "m-2 text-2xl">ChordSense</h1>
      <h4 className = "text-sm">Music theory explained simply</h4>
    </div>
  );
}

export default function App() { // file can only have one default export
  const [chords, setChords] = useState([]); //hook
  const [isReady, setIsReady] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [currChord, setCurrChord] = useState(null);
  const [noteColor, setNoteColor] = useState("#060404ff");

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
    <div className = "min-h-screen flex flex-col bg-[#313945]">
      <header className = "shadow-lg px-5 py-5 flex justify-between">
          <div className = "max-w-4xl mx-auto flex justify-between justify-left items-center">
            {/* <Header /> */}
            <img src="Logo.png" className = "w-40 h-10"/>
          </div>
          <div className = "flex mx-auto justify-right items-center">
            <Navigation/>
          </div>
      </header>
      <main className = "flex-1 px-4 px-12">
        <div className = "max-w-4xl mx-auto text-center">
          {isReady && <RootDropdown setIsShowing = {setIsShowing} 
          setCurrChord = {setCurrChord} chords = {chords}/>}
          {/* {isShowing && currChord && <ChordButtons chords = {chords} chord = {currChord} />} */}
          {isShowing && currChord && <ChordDisplay chords = {chords} chord = {currChord} /> }
        </div>
       
      </main>

    </div>
  );
}
