import React from 'react';
import GlobalField from "../../Common/inputs/GlobalField";
import Button from "../../Common/Button/Button";
import loadingAnimation from "../../../animations/AnimationLoading.json";
import {Player} from "@lottiefiles/react-lottie-player";

const RegisterForm = ({ handleChange, isSubmitting, validatePassword }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlobalField
                name="businessName"
                label="Business Name"
                type="text"
                autoFocus={true}
            />
            <GlobalField
                name="contactName"
                label="Contact Name"
                type="text"
            />
            <GlobalField
                name="phone"
                label="Phone"
                type="tel"
            />
            <GlobalField
                name="email"
                label="Email"
                type="email"
            />
            <GlobalField
                name="password"
                label="Password"
                type="password"
                onChange={(e) => {
                    handleChange(e);
                    validatePassword(e.target.value);
                }}
            />
            <GlobalField
                name="repeatPassword"
                label="Password confirmation"
                type="password"
            />
            <div className="col-span-1 sm:col-span-2 flex justify-center items-center h-full">
                <Button
                    className="text-titles w-full h-14 flex justify-center items-center"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            Submitting...
                            <Player
                                autoplay
                                loop
                                src={loadingAnimation}
                                className="size-6"
                            />
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default RegisterForm;
