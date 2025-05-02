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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-5xl font-extrabold text-white mb-6">ESP32 LED Controller</h1>
      <p className="text-2xl mb-6">LED is <span className={led ? 'text-yellow-300' : 'text-gray-300'}>{led ? 'ON' : 'OFF'}</span></p>
      <button
        onClick={toggleLed}
        className="px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
      >
        Turn {led ? 'OFF' : 'ON'}
      </button>
    </div>
  );
}
