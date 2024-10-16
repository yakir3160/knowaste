import { useState } from 'react';

export const usePasswordStatus = () => {
    const [passwordStatus, setPasswordStatus] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    return { passwordStatus, setPasswordStatus };
};
