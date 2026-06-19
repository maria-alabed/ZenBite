import "../../styles/layout.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-logo">
        Zen<span>Bite</span>
      </div>

      <p>
        Experience authentic Asian cuisine with modern flavors.
      </p>

      <div className="footer-links">
        <span>Home</span>
        <span>Menu</span>
        <span>Contact</span>
        <span>Privacy</span>
      </div>

      <p className="copy">
        © 2026 ZenBite. All rights reserved.
      </p>

    </footer>
  );
}

export default Footer;