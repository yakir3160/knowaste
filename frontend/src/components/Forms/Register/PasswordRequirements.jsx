import React from 'react';
import { CheckCircle, CircleAlert } from 'lucide-react';

const PasswordRequirements = ({ passwordStatus }) => {
    const requirementGood = 'text-green';
    return (
        <div className="max-w-lg mx-auto mt-8  border-2 border-secondary rounded-2xl p-4 w-fit">
            <p className="text-lg font-semibold">Password Requirements:</p>
            <ul className="list-inside mt-2 space-y-1 text-sm lg:text-lg px-3">
                <li className={`flex items-center ${passwordStatus.length ? requirementGood : ''}`}>
                    {passwordStatus.length ? (
                        <CheckCircle className="mr-2 " />
                    ) : (
                        <CircleAlert className="mr-2" />
                    )}
                    Password must be at least 8 characters long
                </li>
                <li className={`flex items-center ${passwordStatus.uppercase ? requirementGood : ''}`}>
                    {passwordStatus.uppercase ? (
                        <CheckCircle className="mr-2" />
                    ) : (
                        <CircleAlert className="mr-2" />
                    )}
                    Contains at least one uppercase letter
                </li>
                <li className={`flex items-center ${passwordStatus.lowercase ? requirementGood : ''}`}>
                    {passwordStatus.lowercase ? (
                        <CheckCircle className="mr-2" />
                    ) : (
                        <CircleAlert className="mr-2" />
                    )}
                    Contains at least one lowercase letter
                </li>
                <li className={`flex items-center ${passwordStatus.number ? requirementGood : ''}`}>
                    {passwordStatus.number ? (
                        <CheckCircle className="mr-2" />
                    ) : (
                        <CircleAlert className="mr-2" />
                    )}
                    Contains at least one number
                </li>
                <li className={`flex items-center ${passwordStatus.specialChar ? requirementGood : ''}`}>
                    {passwordStatus.specialChar ? (
                        <CheckCircle className="mr-2" />
                    ) : (
                        <CircleAlert className="mr-2" />
                    )}
                    Contains at least one special character (@$!%*?&)
                </li>
            </ul>
        </div>
    );
};

export default PasswordRequirements;
