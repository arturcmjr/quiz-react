import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import Game from "./components/game/Game";
import Menu from "./components/menu/Menu";
import GameOver from "./components/game/GameOver";


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
      /* TODO: display app name and logo */
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
    this.setState({ gameState: 1, gameResult: null});
  }

  resetGame() {
    this.setState({ gameState: 0, gameResult: null });
  }
}

export default App;
