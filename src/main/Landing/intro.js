import React from "react";
import "./landingpage.css";

const Header = (props) => {
  return (
    <header className="header">
      <div className="logo-container">
        <h1 style={{ color: "#ffff", fontWeight: "bold", fontSize: "2rem" }}>
          Flames
        </h1>
      </div>
      <div className="button-container">
        <button
          onClick={() => (window.location.href = "https://flames.mobshale.com")}
          className="try-free-button"
        >
          Try It Free
        </button>
      </div>
    </header>
  );
};

const Image = ({ src, alt }) => {
  return (
    <div className="image-container">
      <img className="image" src={src} alt={alt} />
    </div>
  );
};

const Content = (props) => {
  return (
    <div className="content">
      <Image
        src="https://mobshale.com/media/banner/main/mockup-overlay.png"
        alt="Your Image"
      />
      <h1 style={{ color: "#6dd5ed", fontWeight: "bold" }}>
        Get Your Class Live Within Seconds
      </h1>
      <p>
        Discover the power of online learning with Flames! Connect and
        collaborate with your teachers and classmates in real-time with our
        user-friendly virtual classroom. Engage and have fun with interactive
        tools like polls. Join the Flames community today!
      </p>
      <button
        onClick={() => (window.location.href = "https://flames.mobshale.com")}
        className="try-free-button"
      >
        Try It Free
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="container">
      <Header />
      <Content />
    </div>
  );
};

export default App;
