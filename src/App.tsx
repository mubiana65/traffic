import { database as db } from "./firebase";
import { ref as dbRef, set as dbSet } from "firebase/database";
import { useState } from "react";

const trafficStates = ["red", "yellow", "green"] as const;

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);

  const changeTrafficState = (state: string) => {
    dbSet(dbRef(db, "/state"), state);
    setSelected(state);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/20">
        <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
          Smart Traffic Light Control
        </h1>
        
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-col items-center gap-4">
            {trafficStates.map((state) => (
              <button
                key={state}
                onClick={() => changeTrafficState(state)}
                className={`w-24 h-24 rounded-full border-4 transition-all duration-300 transform hover:scale-110
                  ${
                    state === "red"
                      ? "bg-red-500 border-red-700 shadow-lg shadow-red-500/30"
                      : state === "yellow"
                      ? "bg-yellow-400 border-yellow-600 shadow-lg shadow-yellow-400/30"
                      : "bg-green-500 border-green-700 shadow-lg shadow-green-500/30"
                  } 
                  ${
                    selected === state
                      ? "ring-4 ring-offset-4 ring-offset-gray-800 ring-white/50 scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4">
          <p className="text-gray-300">
            Current state:{" "}
            <span className={`font-semibold ${
              selected === "red" 
                ? "text-red-400" 
                : selected === "yellow" 
                ? "text-yellow-400" 
                : selected === "green" 
                ? "text-green-400" 
                : "text-gray-400"
            }`}>
              {selected || "none"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
