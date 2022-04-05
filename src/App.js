import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import Game from "./Game";
import axios from "axios";

class SelectInput extends Component {
  render() {
    return (
      <div className="w-full">
        <div className="text-center text-sm mb-1 text-gray-700">
          {this.props.label}
        </div>
        <select
          className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-orange-900
      bg-orange-100 bg-clip-padding bg-no-repeat
      rounded
      transition
      ease-in-out
      m-0
      focus:bg-orange-200 focus:outline-none focus:shadow-outline-orange-500"
          aria-label="Default select example"
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
        >
          {this.props.options.map((option) => {
            return this.renderOption(option.text, option.value);
          })}
        </select>
      </div>
    );
  }

  renderOption(text, value) {
    return (
      <option
        key={value}
        value={value}
        className="flex items-center w-full bg-white text-gray-700"
      >
        {text}
      </option>
    );
  }
}

class GameStart extends Component {
  state = {
    questionsAmount: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "15", value: 15 },
    ],
    timeLimits: [
      { text: "10 seconds", value: 10 },
      { text: "15 seconds", value: 15 },
      { text: "30 seconds", value: 30 },
    ],
    categories: [{ text: "Fetching Categories...", value: -1 }],
    selectedCategory: -1,
    selectedQuestionsAmount: 10,
    selectedTimeLimit: 15,
  };

  render() {
    return (
      <div className="max-w-full w-[900px] h-96 flex flex-col">
        <div className="flex items-center justify-center grow w-100">
          <button
            className="bg-orange-400 text-white hover:bg-orange-500 font-medium rounded-full h-32 w-32 hover:shadow-md hover:-translate-y-0.5 transition duration-150 ease-in-out"
            onClick={() => this.props.onStart({
              category: this.state.selectedCategory,
              questionsAmount: this.state.selectedQuestionsAmount,
              timeLimit: this.state.selectedTimeLimit,
            })}
          >
            PLAY
          </button>
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-3 w-full">
          <SelectInput
            options={this.state.questionsAmount}
            value={this.state.selectedQuestionsAmount}
            onChange={(value) =>
              this.setState({ selectedQuestionsAmount: value })
            }
            label="Questions"
          />

          <SelectInput
            options={this.state.categories}
            value={this.state.selectedCategory}
            onChange={(value) => this.setState({ selectedCategory: value })}
            label="Category"
          />

          <SelectInput
            options={this.state.timeLimits}
            value={this.state.selectedTimeLimit}
            onChange={(value) => this.setState({ selectedTimeLimit: value })}
            label="Time Limit"
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((res) => {
        let categories = res.data.trivia_categories.map((c) => ({
          text: c.name,
          value: c.id,
        }));
        categories.unshift({
          value: -1,
          text: "Any Category",
        });
        this.setState({ categories });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

class GameOver extends Component {
  // TODO: show resume of questions and answers
  render() {
    return (
      <div className="max-w-full w-[900px] h-96 flex flex-col items-center justify-center">
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
        <div className="bg-white rounded overflow-hidden shadow-md md:w-1/2 sm:w-full my-8 mx-4 p-4 relative max-w-2xl">
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
        return <GameStart onStart={(settings) => this.startGame(settings)}></GameStart>;
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
