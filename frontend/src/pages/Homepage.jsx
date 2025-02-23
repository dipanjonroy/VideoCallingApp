import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="homepageContainer">
      <div className="homepageNavbar">
        <div className="hompageBrand">
          <h2>
            <span>Video</span> App
          </h2>
        </div>

        <nav className="homepageNavigation">
          <Link>Join as guest</Link>
          <Link>Register</Link>
          <Link to="/auth">LogIn</Link>
        </nav>
      </div>

      <div className="hompageHero">
        <div className="homepageText">
          <p>Crystal-Clear Video Calls, Anytime</p>
          <h1>The Future of Video Communication Starts Here</h1>
          <Link>Get started</Link>
        </div>
        <div className="homepageImage">
          <img src="/images/1.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
