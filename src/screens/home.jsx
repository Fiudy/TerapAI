import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/app");
  };

  return (
    <div>
      <div className="banner">
        <h1 className="title">TerapAI</h1>
        <div className="next">
          <button onClick={handleButtonClick}>Começar</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
