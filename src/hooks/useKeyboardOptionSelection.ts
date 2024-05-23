import { useEffect, useState } from 'react';

export const useKeyboardOptionSelection = ({ totalOptions, onSelectOption, optionType = 'letter' }) => {
  const [sequence, setSequence] = useState('');
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const keyPressThreshold = 500; // milliseconds

  useEffect(() => {
    const handleKeyPress = (event) => {
      const now = Date.now();
      const key = event.key.toUpperCase();

      if (optionType === 'letter') {
        if (!/^[A-Z]$/.test(key)) return;

        const newSequence = now - lastKeyPressTime < keyPressThreshold ? sequence + key : key;
        let optionIndex = 0;
        for (let i = 0; i < newSequence.length; i++) {
          optionIndex = optionIndex * 26 + (newSequence.charCodeAt(i) - 65);
        }
        if (optionIndex < totalOptions) onSelectOption(optionIndex);

        setSequence(newSequence);
      } else if (optionType === 'star') {
        if (!/^[0-9]$/.test(key)) return;
        const optionIndex = parseInt(key, 10) - 1;
        if (optionIndex >= 0 && optionIndex < totalOptions) onSelectOption(optionIndex);
      }

      setLastKeyPressTime(now);
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [sequence, lastKeyPressTime, onSelectOption, totalOptions, optionType]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastKeyPressTime > keyPressThreshold && sequence !== '') {
        setSequence('');
      }
    }, keyPressThreshold);

    return () => clearInterval(interval);
  }, [lastKeyPressTime, sequence]);
};
