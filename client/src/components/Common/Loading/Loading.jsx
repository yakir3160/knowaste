import { RiLoader5Line } from "react-icons/ri";
import loadingAnimation from "../../../animations/AnimationLoading.json";
import {Player} from "@lottiefiles/react-lottie-player";
import React from "react";

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <Player
                autoplay
                loop
                src={loadingAnimation}
                className="size-24"
            />
            <p className="mt-4 text-xl md:text-3xl font-semibold text-titles animate-pulse">Loading...</p>
        </div>
    );
};

export default Loading;
