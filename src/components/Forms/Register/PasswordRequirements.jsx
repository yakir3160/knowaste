import React from 'react';

const PasswordRequirements = ({ passwordStatus }) => {
    const requirementGood = 'text-green font-semibold';
    return (
        <div className="max-w-lg mx-auto mt-8 p-2">
            <p className="text-lg font-semibold">Password Requirements:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm lg:text-lg px-3">
                <li className={passwordStatus.length ? requirementGood : ''}>
                    Password must be at least 8 characters long
                </li>
                <li className={passwordStatus.uppercase ? requirementGood : ''}>
                    Contains at least one uppercase letter
                </li>
                <li className={passwordStatus.lowercase ? requirementGood : ''}>
                    Contains at least one lowercase letter
                </li>
                <li className={passwordStatus.number ? requirementGood : ''}>
                    Contains at least one number
                </li>
                <li className={passwordStatus.specialChar ? requirementGood : ''}>
                    Contains at least one special character (@$!%*?&)
                </li>
            </ul>
        </div>
    );
};

export default PasswordRequirements;