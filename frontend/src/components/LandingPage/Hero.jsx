import React, { useEffect } from 'react';
import Button from "../Common/Button/Button";
import { ChevronDown } from "lucide-react";
import featuredImage2 from "../../img/featured34-1@2x.png";

const Hero = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slideIn');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.slide-animate');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col justify-start md:justify-center py-3 h-screen w-full text-left relative overflow-hidden">
            <div
                className="absolute top-0 left-0 w-full h-full animate-fadeInDown"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            to top,
                            rgba(0, 0, 0, 0) 0%,
                             #fefff6 75%
                        ),
                        url(${featuredImage2})
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',

                }}
            />

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] -z-10"/>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime/5 rounded-full blur-[120px] -z-10"/>

            <div className="flex flex-col items-center space-y-4">
                <div className="overflow-hidden">
                    <h1 className="font-semibold text-titles text-[60px] sm:text-[72px] md:text-[96px] lg:text-[144px] leading-[0.9] animate-slideFromBottom">
                        Turn
                    </h1>
                </div>

                <div className="overflow-hidden">
                    <h1 className="font-semibold text-titles text-[60px] sm:text-[72px] md:text-[96px] lg:text-[144px] leading-[0.9] animate-slideFromBottom animation-delay-300">
                        Kitchen Waste
                    </h1>
                </div>

                <div className="overflow-hidden">
                    <h1 className=" text-titles text-[60px] sm:text-[72px] md:text-[96px] lg:text-[144px] leading-[0.9] animate-slideFromBottom animation-delay-600">
                        Into
                    </h1>
                </div>

                <div className="">
                    <h1 className="font-bold text-titles text-[72px] sm:text-[96px] md:text-[144px] lg:text-[170px] tracking-wide leading-[0.9] animate-slideFromBottom animation-delay-900">
                        <span className="text-lime drop-shadow-[0_0_10px_rgba(132,204,22,0.3)]">$</span>avings
                    </h1>
                </div>
            </div>

            <ChevronDown
                className="self-center w-14 h-14 text-lime animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300 "/>

            <Button
                to={"/auth"}
                state={{showRegister: true}}
                className="self-center bg-lime border-2 border-transparent hover:border-buttons text-buttons p-4 rounded-full text-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 "
            >
                Start Saving Now
            </Button>
        </div>
    );
};

export default Hero;