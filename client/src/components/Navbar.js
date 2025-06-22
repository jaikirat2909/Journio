import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { IonIcon } from "@ionic/react";
import { menuOutline, closeOutline, logoFacebook, logoTwitter, logoYoutube } from "ionicons/icons";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderActive(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavbar = () => setNavOpen(!navOpen);

  return (
    <header className={`header ${headerActive ? "active" : ""}`} data-header>
      <div className={`overlay ${navOpen ? "active" : ""}`} onClick={toggleNavbar}></div>

      <div className="header-top">
        <div className="container">
          <a href="tel:+01123456790" className="helpline-box"></a>

          <a href="/" className="logo">
            <img src="./assets/images/logo.svg" alt="Tourly logo" />
          </a>

          <div className="header-btn-group">
            <button className="nav-open-btn" aria-label="Open Menu" onClick={toggleNavbar}>
              <IonIcon icon={menuOutline} />
            </button>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <ul className="social-list">
            <li>
              <a href="#" className="social-link">
                <IonIcon icon={logoFacebook} />
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <IonIcon icon={logoTwitter} />
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <IonIcon icon={logoYoutube} />
              </a>
            </li>
          </ul>

          <nav className={`navbar ${navOpen ? "active" : ""}`} data-navbar>
            <div className="navbar-top">
              <a href="/" className="logo">
                <img src="./assets/images/logo-blue.svg" alt="Tourly logo" />
              </a>
              <button className="nav-close-btn" aria-label="Close Menu" onClick={toggleNavbar}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            <ul className="navbar-list">
              <li><a href="#home" className="navbar-link" onClick={toggleNavbar}>home</a></li>
              <li><a href="Hotel.html" className="navbar-link" onClick={toggleNavbar}>Hotels</a></li>
              <li><a href="#destination" className="navbar-link" onClick={toggleNavbar}>destination</a></li>
              <li><a href="#package" className="navbar-link" onClick={toggleNavbar}>packages</a></li>
              <li><a href="#gallery" className="navbar-link" onClick={toggleNavbar}>gallery</a></li>
              <li><a href="#contact" className="navbar-link" onClick={toggleNavbar}>contact us</a></li>
            </ul>
          </nav>

          <a id="auth-btn" href="login-page.html">
            <button className="btn btn-primary">login</button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
