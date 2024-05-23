import { useEffect, useState } from 'react';

const useKeyboardOptionSelection = ({ totalOptions, onSelectOption, optionType = 'letter' }) => {
  const [lastKey, setLastKey] = useState('');
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const keyPressThreshold = 500; // milliseconds

  useEffect(() => {
    const handleKeyPress = (event) => {
      const now = Date.now();
      const key = event.key.toUpperCase();

      if (optionType === 'letter') {
        if (!/^[A-Z]$/.test(key)) return;

        if (now - lastKeyPressTime < keyPressThreshold && /^[A-Z]$/.test(lastKey)) {
          const optionIndex = (lastKey.charCodeAt(0) - 65) * 26 + (key.charCodeAt(0) - 65);
          if (optionIndex < totalOptions) onSelectOption(optionIndex);
        } else {
          const optionIndex = key.charCodeAt(0) - 65;
          if (optionIndex < totalOptions) onSelectOption(optionIndex);
        }
      } else if (optionType === 'star') {
        if (!/^[0-9]$/.test(key)) return;
        const optionIndex = parseInt(key, 10) - 1;
        if (optionIndex >= 0 && optionIndex < totalOptions) onSelectOption(optionIndex);
      }

      setLastKey(key);
      setLastKeyPressTime(now);
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [lastKey, lastKeyPressTime, onSelectOption, totalOptions, optionType]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastKeyPressTime > keyPressThreshold && lastKey !== '') {
        setLastKey('');
      }
    }, keyPressThreshold);

    return () => clearInterval(interval);
  }, [lastKeyPressTime, lastKey]);
};

export default useKeyboardOptionSelection;
