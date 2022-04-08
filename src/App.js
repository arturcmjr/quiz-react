import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import Game from "./components/game/Game";
import Menu from "./components/menu/Menu";
import GameOver from "./components/game/GameOver";
import logo from "./logo.svg";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.setState({
      gameState: 0,
    });
  }

  state = {};

  render() {
    return (
      <div className="bg-orange-300 w-screen h-screen flex items-center flex-col text-gray-700 relative">
        <div className="flex items-center h-[15%] mt-2">
          <img src={logo} width="60px" className="mr-2" alt="app_logo"></img>
          <span className="text-5xl text-white font-light">QUIZ</span>
        </div>

        <div className="grow flex justify-center items-start w-screen">
          <div className="bg-white rounded overflow-hidden shadow-md md:w-1/2 sm:w-full mx-3 mb-2 p-4 relative max-w-2xl min-h-[400px] w-[900px] z-10">
            {this.renderContent()}
          </div>
        </div>

        {/* TODO: use correct link */}
        <a
          href="https://www.google.com/"
          className="absolute bottom-3 text-orange-700 hover:text-orange-900 text-lg"
        >
          arju.dev
        </a>
      </div>
    );
  }

  componentDidMount() {
    this.checkSessionToken();
  }

  checkSessionToken() {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      axios
        .get("https://opentdb.com/api_token.php?command=request")
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("sessionToken", token);
        });
    }
  }

  renderContent() {
    switch (this.state.gameState) {
      case 1:
        return (
          <Game
            onOver={(res) => this.setState({ gameState: 2, gameResult: res })}
          ></Game>
        );
      case 2:
        return (
          <GameOver
            onPlayAgain={() => this.resetGame()}
            result={this.state.gameResult}
          ></GameOver>
        );
      default:
        return <Menu onStart={() => this.startGame()}></Menu>;
    }
  }

  startGame() {
    this.setState({ gameState: 1, gameResult: null });
  }

  resetGame() {
    this.setState({ gameState: 0, gameResult: null });
  }
}

export default App;
