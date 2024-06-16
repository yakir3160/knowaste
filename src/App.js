
import './css/App.css';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ContactForm from "./pages/ContantForm";
import Auth from "./pages/Auth";

const App = () => {
  return (
      <div className="app">
        <NavigationBar/>
          <div className="app-container">
              <ContactForm />
              {/*<LandingPage/>*/}
              {/*<Auth/>*/}
          </div>
        <Footer/>
      </div>
  );
}

export default App;
