import "../css/Register.css";
import featuredImage from "../img/Mobile login-pana 2.png";

const Register = () => {
    return (
        <section className="contact-form-inner">
            <div className="card form" style={{padding:'30px'}}>
                <h3 className="title">Let's create an account</h3>
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
                            <input className="input input-half" id="city" placeholder="City" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <select id="country" className="input input-half"  style={{width:'90%'}}>
                                <option value="">Select Country</option>
                                <option value="USA">USA</option>
                                <option value="Canada">Canada</option>
                                <option value="UK">UK</option>
                                <option value="Australia">Australia</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="account-type">Account Type</label>
                        <select id="account-type" className="input input-register" style={{width:'95%'}}>
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
            <div className="card " style={{height: '60vh'}}>
                <img className="card-img-contact" src={featuredImage} alt=""/>
                <button className="submit" style={{width: "30%"}}>Submit</button>
            </div>
        </section>
    );
}

export default Register;
