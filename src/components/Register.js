import React, { useEffect, useState } from 'react';
import "../css/Register.css";
import featuredImage from "../img/Mobile login-pana 2.png";
import { countries } from 'countries-list';

const Register = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryOptions, setCountryOptions] = useState([]);

    useEffect(() => {
        const options = Object.entries(countries).map(([code, { name }]) => ({
            value: code,
            label: name
        }));
        setCountryOptions(options);
    }, []);

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
    };

    return (
        <section className="contact-form-inner">
            <div className="card form">
                <h3 className="title">Let's create an account</h3>
                <div className="card-half">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Business Name</label>
                            <input className="input input-half" id="name" placeholder="Business name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-name">Contact Representative</label>
                            <input className="input input-half" id="contact-name" placeholder="Contact representative" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input className="input input-half" id="phone" placeholder="05x-xxxxxxx" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input className="input input-half" id="address" placeholder="Address" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input className="input input-half"  id="city" placeholder="City"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                id="country"
                                className="input input-half"
                                placeholder="Select a Country"
                                style={{width:"90%"}}
                                value={selectedCountry}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                >
                            <option value="">Select a Country</option>
                                {countryOptions.map((country) => (
                                    <option className="input" key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="account-type">Account Type</label>
                <select id="account-type" className="input input-register" style={{width:"95%"}}>
                    <option value="">Select Account Type</option>
                    <option value="restaurant-manager">Restaurant Manager</option>
                    <option value="supplier">Supplier</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" className="input input-register" type="email" placeholder="email@domain.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" className="input input-register" type="password" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="repeat-password">Repeat Password</label>
                    <input id="repeat-password" className="input input-register" type="password" placeholder="Repeat Password" />
                </div>
            </div>
            <div className="card" style={{ width: '35%' }}>
                <img className="card-img-contact" src={featuredImage} alt="" />
                <button className="submit">Submit</button>
            </div>
        </section>
    );
}

export default Register;
