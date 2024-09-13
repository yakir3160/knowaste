import React from 'react';
import placeholderIcon from '../img/placeholder.svg';
import icon1 from '../img/00-1.svg';
import icon2 from '../img/00-2.svg';

const LandingPageText = () => {
    return (
        <div className="w-full self-stretch flex flex-row items-start justify-start text-left text-xl text-[#2a522a] font-inherit p-5 ml-4">
            <div className="max-w-1/3 w-full sm:w-1/2 flex flex-col items-start justify-end box-border">
                <h3>OUR VISION</h3>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col items-start gap-2">
                        <img className="w-[20%] h-[39px] object-contain" alt="Placeholder Icon" src={placeholderIcon} />
                        <div className="text-lg leading-[150%] font-medium text-[#828282]">
                            Subheading 1
                        </div>
                        <div className="text-lg leading-[150%] font-medium text-[#828282]">
                            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <img className="w-[20%] h-[39px] object-contain" alt="Icon 1" src={icon1} />
                        <div className="text-lg leading-[150%] font-medium text-[#828282]">
                            Subheading 2
                        </div>
                        <div className="text-lg leading-[150%] font-medium text-[#828282]">
                            Body text for whatever you’d like to type. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2.5">
                        <img className="w-[20%] h-[39px] object-contain" alt="Icon 2" src={icon2} />
                        <div className="text-lg leading-[150%] font-medium text-[#828282]">
                            Subheading 3
                        </div>
                        <div className="text-lg leading-[150%]  font-medium text-[#828282]">
                            Body text for whatever you’d like to suggest. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageText;
