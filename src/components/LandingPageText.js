import React from 'react';
import '../css/LandingPageText.css';
import placeholderIcon from '.././img/placeholder.svg';
import icon1 from '.././img/00-1.svg';
import icon2 from '.././img/00-2.svg';

const LandingPageText = () => {
    return (
        <div className="text-content">
            <div className="content-inner">
               <h3>OUR VISION</h3>
                <div className="frame-parent4">
                    <div className="placeholder-parent">
                        <img className="placeholder-icon" alt="Placeholder Icon" src={placeholderIcon} />
                        <div className="subheading">Subheading 1</div>
                        <div className="body-text-for">
                            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                        </div>
                    </div>
                    <div className="frame-wrapper2">
                        <div className="frame-parent5">
                            <div className="placeholder-group">
                                <img className="placeholder-icon1" alt="Icon 1" src={icon1} />
                                <div className="subheading1">Subheading 2</div>
                            </div>
                            <div className="body-text-for1">
                                Body text for whatever you’d like to type. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                            </div>
                        </div>
                    </div>
                    <div className="frame-wrapper3">
                        <div className="frame-parent6">
                            <div className="frame-wrapper4">
                                <div className="placeholder-container">
                                    <img className="placeholder-icon2" alt="Icon 2" src={icon2} />
                                    <div className="subheading2">Subheading 3</div>
                                </div>
                            </div>
                            <div className="body-text-for2">
                                Body text for whatever you’d like to suggest. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageText;
