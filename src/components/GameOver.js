import React, { Component } from "react";


class GameOver extends Component {
  // TODO: show resume of questions and answers
  render() {
    return (
      <div className="max-w-full min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg">
          You got {this.props.result.correct} questions out of{" "}
          {this.props.result.total}
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

export default GameOver;