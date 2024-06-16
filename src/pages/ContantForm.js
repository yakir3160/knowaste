
import "../css/ContantForm.css";
import featuredImage from '../img/contact.png';
const ContactForm = () => {

    return (
        <div className="contact-form">

            <section className="contact-form-inner">
                <div className="card" style={{marginTop:"-3%"}}>
                    <h3 className="title" style={{alignSelf:"center",padding:"10px"}}>Contact us</h3>
                    <input className="input" id="name" placeholder="First name"/>
                    <input className="input" id="name" placeholder="Last name"/>
                    <input type="email" className="input" id="email" placeholder="Email"/>
                    <textarea className="input-message" placeholder="Enter your question or message"></textarea>
                    <button className="submit">Submit</button>
                </div>
                <div className="card">
                    <img className="card-img-contact" src={featuredImage} alt=""/>
                </div>

            </section>
        </div>
    );
};

export default ContactForm;
