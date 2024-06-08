import { useState, useEffect } from "react";

interface SeekBarProps {
  value: number;
  min: number;
  max: number;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSeekTime: (seekTime: number) => void;
  appTime: number;
}

const SeekBar = ({
  value,
  min,
  max,
  onInput,
  setSeekTime,
  appTime,
}: SeekBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const getTime = (time: number) =>
    `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));

    onInput(event);
  };

  const handleTimeChange = (timeChange: number) => {
    const newTime = Math.max(min, Math.min(max, appTime + timeChange));

    setSeekTime(newTime);

    setInputValue(newTime);
  };

  return (
    <div className="hidden sm:flex flex-row items-center">
      <button
        type="button"
        onClick={() => handleTimeChange(-5)}
        className="hidden lg:mr-4 lg:block text-white"
      >
        -
      </button>

      <p className="text-white">{getTime(inputValue)}</p>

      <input
        type="range"
        step="any"
        value={inputValue}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="md:block w-24 md:w-56 2xl:w-96 h-1 mx-4 2xl:mx-6 rounded-lg"
      />

      <p className="text-white">{getTime(max)}</p>

      <button
        type="button"
        onClick={() => handleTimeChange(5)}
        className="hidden lg:ml-4 lg:block text-white"
      >
        +
      </button>
    </div>
  );
};

export default SeekBar;
