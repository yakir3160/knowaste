import { useState } from 'react';

export const usePasswordStatus = () => {
    const [passwordStatus, setPasswordStatus] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const validatePassword = (value) => {
        const lengthValid = value.length >= 8;
        const uppercaseValid = /[A-Z]/.test(value);
        const lowercaseValid = /[a-z]/.test(value);
        const numberValid = /[0-9]/.test(value);
        const specialCharValid = /[@$!%*?&]/.test(value);

        setPasswordStatus({
            length: lengthValid,
            uppercase: uppercaseValid,
            lowercase: lowercaseValid,
            number: numberValid,
            specialChar: specialCharValid,
        });
        return value;
    };

    return { passwordStatus, validatePassword };
};
