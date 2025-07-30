import { useState, useRef, useEffect } from "react";
import {
  urduKeyMap,
  shiftKeyMap,
  specialKeyMap,
} from "../logic/urduKeyboardMap";

const UrduKeyboard = () => {
  const [output, setOutput] = useState("");
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const outputRef = useRef(null);
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.focus();
    }
  }, []);
  const handleKeyDown = (e) => {
    const { key, shiftKey, ctrlKey, altKey, metaKey } = e;
    const keyLower = key.toLowerCase();

    if (["shift", "control", "alt", "meta", "capslock"].includes(keyLower)) {
      if (keyLower === "shift") setIsShiftActive(true);
      if (keyLower === "capslock") setIsCapsLock((prev) => !prev);
      return;
    }
    if (!ctrlKey && !altKey && !metaKey) {
      e.preventDefault();
    }
    if (specialKeyMap[key]) {
      handleSpecialKey(key);
      return;
    }
    if (key.length === 1 || keyLower in urduKeyMap || keyLower in shiftKeyMap) {
      handleCharacterInput(keyLower, shiftKey || isCapsLock);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key.toLowerCase() === "shift") {
      setIsShiftActive(false);
    }
  };

  const handleSpecialKey = (key) => {
    switch (key) {
      case "Backspace":
        setOutput((prev) => prev.slice(0, -1));
        break;
      case "Enter":
        setOutput((prev) => prev + "\n");
        break;
      case "Tab":
        setOutput((prev) => prev + "\t");
        break;
      case "Space":
        setOutput((prev) => prev + " ");
        break;
      default:
        break;
    }
  };

  const handleCharacterInput = (key, isShift) => {
    let urduChar;
    if (isShift && shiftKeyMap[key]) {
      urduChar = shiftKeyMap[key];
    } else if (urduKeyMap[key]) {
      urduChar = urduKeyMap[key];
    }

    if (urduChar) {
      setOutput((prev) => prev + urduChar);
    }
  };
  const handleContainerClick = () => {
    outputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="flex gap-2 justify-center mb-2">
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              isShiftActive
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Shift {isShiftActive ? "ON" : "OFF"}
          </span>
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              isCapsLock
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Caps Lock {isCapsLock ? "ON" : "OFF"}
          </span>
        </div>

        <div
          ref={outputRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={handleContainerClick}
          className="w-full min-h-[200px] max-h-[300px] border-2 border-gray-300 rounded-xl p-4 text-3xl text-right bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text leading-loose overflow-y-auto rtl"
        >
          {output || (
            <span className="text-gray-400 text-xl">
              Click here and start typing Urdu...
            </span>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Type Urdu using English keyboard.
        </p>
        <p className="text-xs text-gray-500">
          Supports Backspace, Enter, Tab, Space. Shift and Caps Lock indicators
          show current state.
        </p>
      </div>
    </div>
  );
};

export default UrduKeyboard;
