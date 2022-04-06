import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import Game from "./Game";
import Menu from "./components/Menu";
import GameOver from "./components/GameOver";


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
      <div className="bg-orange-300 w-screen h-screen flex justify-center items-center text-gray-700">
        <div className="bg-white rounded overflow-hidden shadow-md md:w-1/2 sm:w-full my-8 mx-4 p-4 relative max-w-2xl min-h-[400px] w-[900px]">
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    switch (this.state.gameState) {
      case 1:
        return (
          <Game
            settings={this.state.gameSettings}
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
        return <Menu onStart={(settings) => this.startGame(settings)}></Menu>;
    }
  }

  startGame(settings) {
    this.setState({ gameState: 1, gameResult: null, gameSettings: settings });
  }

  resetGame() {
    // TODO: persist settings across games
    this.setState({ gameState: 0, gameResult: null });
  }
}

export default App;
