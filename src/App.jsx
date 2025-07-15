import { useState } from 'react'
import axios from 'axios';
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

const apiCall = async() => {
  try {
    console.log("About to send request and fetch response");
    const promise = await fetch("http://localhost:3001/chords/CMaj");
    console.log("Promise received");
    // if (!promise.ok) {
    //   throw new Error("");
    // }
    const chord = await promise.json();
    console.log(chord[0].Link);
    const audio = new Audio (chord[0].Link);
    audio.play();
  } catch (error) {
    console.log(error);
  }
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
      <h1>ChordSense</h1>
      <h4>Music theory explained simply</h4>
    </div>
  );
}

function ChordList() {
  let listChords = chords.map(chord => <li key = {chord.id}> {chord.name} </li>);
  return <ul>{listChords}</ul>;
}

export default function App() { // file can only have one default export
  const [count, setCount] = useState(0); // Hook
  console.log("App is rendering");

  function handleClick() {
    setCount(count + 1);
  }
  // props - information passed from its parent component
  return (
    <div>
      <Header />
      <ChordList />
      <MyButton count = {count} onClick = {handleClick} />
      <button onClick = {apiCall}>CMaj Chord</button>
    </div>
  );
}