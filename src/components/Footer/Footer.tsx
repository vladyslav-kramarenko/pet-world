import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                <div className="footer-logo">
                    <div className={"logo-wrapper"}>
                        <img src={logo} alt="PetWorld Logo" />
                    </div>
                    <h2>PetWorld</h2>
                </div>

                <div className="footer-info">
                    <p>© 2024 PetWorld. All rights reserved.</p>
                    <p>Connecting people with pets to find their best friends.</p>
                </div>

                <div className="footer-nav">
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
