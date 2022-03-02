import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import Game from "./Game";

class GameStart extends Component {
  render() {
    return (
      <div className="max-w-full w-[900px] h-96 flex items-center justify-center">
        <button
          class="bg-orange-400 text-white hover:bg-orange-500 font-medium rounded-full h-32 w-32 hover:shadow-md hover:-translate-y-0.5 transition duration-150 ease-in-out"
          onClick={() => this.props.onStart()}
        >
          PLAY
        </button>
      </div>
    );
  }
}

class GameOver extends Component {
  render() {
    return (
      <div className="max-w-full w-[900px] h-96 flex flex-col items-center justify-center">
        <p className="text-lg">
          You got {this.props.result.correct} questions out of {this.props.result.total}
        </p>
        <button
          className="bg-orange-400 text-white hover:bg-orange-600 font-medium py-2 px-4 rounded col hover:shadow-md hover:-translate-y-0.5 transition duration-150 ease-in-out mt-4"
          onClick={() => this.props.onPlayAgain()}
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }
}

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
        <div class="bg-white rounded overflow-hidden shadow-md md:w-1/2 sm:w-full my-8 mx-4 p-4 relative max-w-2xl">
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
            onPlayAgain={() => this.startGame()}
            result={this.state.gameResult}
          ></GameOver>
        );
      default:
        return <GameStart onStart={() => this.startGame()}></GameStart>;
    }
  }

  startGame() {
    console.log("game started");
    this.setState({ gameState: 1, gameResult: null });
  }
}

export default App;
