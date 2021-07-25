import "./app.css";
import Letter from "./letter.js";
import _, { indexOf } from "lodash";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Swap from "./swaps";

const App = () => {
  const CONSECUTIVE_CAPITAL_LETTERS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const [displayArray, setDisplayArray] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [currentSwap, setCurrentSwap] = useState(null);
  const sortedReference = useRef();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (currentSwap !== null && currentSwap < displayArray.length) {
      const copiedArray = [...displayArray];

      if (swaps[currentSwap]) {
        const { to, from } = swaps[currentSwap];

        const temporary = copiedArray[to];
        copiedArray[to] = copiedArray[from];
        copiedArray[from] = temporary;
      }

      const debouncedUpdateSwap = _.debounce(() => {
        setDisplayArray(copiedArray);
        setCurrentSwap(currentSwap + 1);
      }, 1000);

      debouncedUpdateSwap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSwap]);

  const getLetterGlow = (letter) => {
    if (
      JSON.stringify(displayArray) === JSON.stringify(sortedReference.current)
    ) {
      return true;
    }

    if (swaps[currentSwap]) {
      const { to, from } = swaps[currentSwap];

      if (displayArray[to] === letter || displayArray[from] === letter) {
        return true;
      }
    }
  };

  const generateRandom = () => {
    // Generating a random length that provides AT LEAST 2 elements, and AT MOST 26 elements
    const randomArrayLength = Math.random() * (26 - 2) + 2;
    const arraySlice = CONSECUTIVE_CAPITAL_LETTERS.slice(randomArrayLength);
    setDisplayArray(_.shuffle([...arraySlice, "_"]));
    setSwaps([]);
  };

  const generateLetters = () => {
    if (!_.isEmpty(displayArray)) {
      return displayArray.map((randomLetter) => (
        <Letter
          displayValue={randomLetter}
          glow={getLetterGlow(randomLetter)}
        />
      ));
    }

    return "Click generate random array to start!";
  };

  const cycleSort = (unsortedArray) => {
    if (_.isEmpty(unsortedArray) || unsortedArray.length === 1) {
      return unsortedArray;
    }

    //Creating a sorted array to use as a reference, javascript's built in sort is an adaptive algorithm with approximately O (n log(n)) time
    const sortedArray = [...unsortedArray].sort();
    sortedReference.current = sortedArray;

    //Using a set to check for traversed units
    const traversedUnits = new Set();
    const cycles = [];
    let buffer = indexOf(unsortedArray, "_");

    const getCycle = () => {
      if (buffer !== unsortedArray.length - 1) {
        while (buffer !== unsortedArray.length - 1) {
          let currentIndex = indexOf(unsortedArray, sortedArray[buffer]);
          traversedUnits.add(currentIndex);
          traversedUnits.add(buffer);
          cycles.push({ from: currentIndex, to: buffer });

          //Apply a swap for bookkeeping
          const temporary = unsortedArray[buffer];
          unsortedArray[buffer] = unsortedArray[currentIndex];
          unsortedArray[currentIndex] = temporary;
          buffer = currentIndex;
        }
      }
    };

    getCycle();

    let containerIndex = 0;

    while (containerIndex < unsortedArray.length) {
      const correctIndex = indexOf(sortedArray, unsortedArray[containerIndex]);

      if (
        !traversedUnits.has(containerIndex) &&
        containerIndex !== correctIndex
      ) {
        cycles.push({ from: containerIndex, to: buffer });
        const temporary = unsortedArray[buffer];
        unsortedArray[buffer] = unsortedArray[containerIndex];
        unsortedArray[containerIndex] = temporary;
        buffer = containerIndex;
        getCycle();
      }

      containerIndex++;
    }
    setSwaps(cycles);
    setCurrentSwap(0);
  };

  const getSequence = () => {
    if (!_.isEmpty(swaps)) {
      return swaps.map((swap) => (
        <Swap swapObject={swap} glow={swaps[currentSwap] === swap} />
      ));
    }
  };

  const renderButton = () => {
    if (!_.isEmpty(swaps)) {
      if (
        JSON.stringify(displayArray) === JSON.stringify(sortedReference.current)
      ) {
        return null;
      }
    }

    return (
      <div className="button" onClick={() => cycleSort([...displayArray])}>
        Sort array with minimum swaps
      </div>
    );
  };

  const renderSwapsTitle = () => {
    if (!_.isEmpty(swaps)) {
      if (
        JSON.stringify(displayArray) === JSON.stringify(sortedReference.current)
      ) {
        return (
          <div>
            <h2>{`The containers were sorted in ${swaps.length} ${
              swaps.length === 1 ? "movement" : "movements"
            }!`}</h2>
          </div>
        );
      }

      return (
        <div>
          <h2>Swaps List:</h2>
        </div>
      );
    }
  };

  return (
    <div className="main-container">
      <div className="controls-panel">
        <div className="button" onClick={() => generateRandom()}>
          Generate random array
        </div>
        {renderButton()}
      </div>

      <div>
        <h2>Container Array:</h2>
      </div>
      <div className="letter-container">{generateLetters()}</div>
      {renderSwapsTitle()}
      <div className="sequence-container">{getSequence()}</div>
    </div>
  );
};

export default App;
