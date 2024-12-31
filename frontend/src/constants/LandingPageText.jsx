import React, { useEffect, useRef } from 'react';
import { GlobeIcon, CalendarIcon, HandCoins } from 'lucide-react';
import TextCard from "../components/LandingPage/TextCard";

const LandingPageText = () => {
    const sectionRef = useRef(null);

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

        const cards = document.querySelectorAll('.card-animate');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} className="w-full  bg-titles p-8 h-100 text-center overflow-hidden">
            <div
                className="slide-animate opacity-0 translate-x-[-100px] delay-1000 flex flex-col items-center gap-6 mt-12 backdrop-blur-md bg-white/10 p-10 rounded-3xl">
                <p className=" text-[24px] sm:text-[30px] md:text-[36px] text-lime text-center">
                    Cut Kitchen Costs by 30%
                </p>
                <p className="font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-base text-center">
                    Smart Kitchen Management That Pays You Back
                </p>
            </div>
            <h3 className="text-[40px]  text-base font-bold mb-8 transform hover:scale-105 transition-transform">
                OUR VISION
            </h3>

            <div className="grid grid-cols-1  gap-8">
                <div className="card-animate opacity-0 translate-x-[-100px] h-full">
                    <TextCard
                        className="h-full flex flex-col"
                        iconColor={'text-green'}
                        icon={GlobeIcon}
                        title="Environmental Sustainability"
                        text="Reduce food waste in your restaurant by analyzing leftovers and optimizing portion sizes. Join us in creating a greener future for your business and the planet."
                    />
                </div>

                <div className="card-animate opacity-0 translate-x-[-100px] delay-200 h-full">
                    <TextCard
                        className="h-full flex flex-col"
                        iconColor={'text-lime'}
                        icon={CalendarIcon}
                        title="Smart Order Management"
                        text="Efficiently manage your inventory and schedule orders with intelligent tracking. Our system ensures accurate demand forecasting to minimize overstock and maximize freshness."
                    />
                </div>

                <div className="card-animate opacity-0 translate-x-[-100px] delay-400 h-full">
                    <TextCard
                        className="h-full flex flex-col"
                        iconColor={'text-buttons'}
                        icon={HandCoins}
                        title="Cost Efficiency"
                        text="Save money by optimizing sales, tracking waste, and adjusting inventory to meet real demand. Better management means higher profitability for your restaurant."
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPageText;
