import { useEffect, useState } from "react";
import {  ref, onValue, set } from "firebase/database";
import { database } from './firebase.ts';

export default function App() {
  const [led, setLed] = useState(false);
  const db = database;
  useEffect(() => {
    const ledRef = ref(db, "led");
    onValue(ledRef, (snapshot) => {
      setLed(snapshot.val());
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  }, []);
  const toggleLed = () => {
    const newLedStatus = !led;
    set(ref(db, 'led'), newLedStatus);
    setLed(newLedStatus);
  };

  console.log('App component rendered');

  return (
    <div style={{ padding: 20 }}>
      <h1>ESP32 LED Controller</h1>
      <p>LED is {led ? "ON" : "OFF"}</p>
      <button onClick={toggleLed}>
        Turn {led ? "OFF" : "ON"}
      </button>
    </div>
  );
}
