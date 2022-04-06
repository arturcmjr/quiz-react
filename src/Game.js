import "./App.css";
import "./styles/output.css";
import React, { Component } from "react";
import axios from "axios";
import { unescape } from "./helpers/unescape";
import { shuffleArray } from "./helpers/shuffle-array";

class OptionButton extends Component {
  state = {};
  interval;

  render() {
    return (
      <button
        className={
          (this.props.selected ? "bg-orange-700" : "bg-orange-400") +
          " text-white hover:bg-orange-600 font-medium py-2 px-8 rounded col hover:shadow-md hover:-translate-y-0.5 transition duration-150 ease-in-out relative"
        }
        onClick={() => this.props.onSelect()}
      >
        <span className="material-icons absolute left-2">{this.props.icon}</span>
        {this.props.value}
      </button>
    );
  }
}

class Game extends Component {
  state = {};

  startGame() {
    this.setState({
      lives: 3,
      countDown: 15,
      currentIndex: -1,
    });
  }

  nextQuestion() {
    window.clearInterval(this.interval);
    const { questions, currentIndex, lives } = this.state;
    if (lives === 0 || questions.length <= currentIndex + 1) this.gameOver();
    else {
      this.setState({ currentIndex: this.state.currentIndex + 1 });
      this.restartCountDown();
    }
  }

  gameOver() {
    const { questions } = this.state;
    let correct = questions.filter(
      (q) => q.selected && q.correctAnswer === q.selected
    ).length;
    this.props.onOver({ correct, total: questions.length });
  }

  restartCountDown() {
    let countDown = this.state.timeLimit;
    this.setState({ countDown });
    this.interval = window.setInterval(() => {
      if (countDown > 0) {
        countDown--;
        this.setState({ countDown });
      } else {
        window.clearInterval(this.interval);
        this.handleOptionSelect("#TIME_OUT#");
      }
    }, 1000);
  }

  componentDidMount() {
    const { category, questionsAmount, timeLimit } = this.props.settings;
    this.setState({timeLimit});

    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: questionsAmount,
          // TODO: let user choose question type
          type: "multiple",
          // TODO: let user choose difficulty
          difficulty: "easy",
          category: category === -1 ? undefined : category,
          // TODO: send session token
        },
      })
      .then((res) => {
        let questions = [];
        const data = res.data.results;
        data.forEach((q) => {
          let options = q.incorrect_answers.map(unescape);
          options.push(unescape(q.correct_answer));
          options = shuffleArray(options);
          options = options.map((o) => o.trim());

          questions.push({
            category: unescape(q.category),
            options,
            question: unescape(q.question),
            correctAnswer: q.correct_answer,
          });
        });
        this.setState({
          questions,
        });
        this.nextQuestion();
      })
      .catch((err) => {
        // TODO: handle error
        console.error(err);
      });
    this.startGame();
  }

  renderQuestionButton(text, index) {
    const question = this.state.questions[this.state.currentIndex];
    const selected = question.selected;
    let buttonIcon = null;
    if (selected) {
      const correct = question.correctAnswer;
      if (text === correct) buttonIcon = "check";
      else if (selected === text && text !== correct) buttonIcon = "close";
    }
    return (
      <OptionButton
        value={text}
        key={index}
        onSelect={() => this.handleOptionSelect(text)}
        icon={buttonIcon}
        selected={selected === text}
      ></OptionButton>
    );
  }

  render() {
    if (this.state.currentIndex >= 0) {
      const question = this.getCurrentQuestion();
      const options = question.options;
      const answered = !!question.selected;

      return (
        <div className="w-100 h-100">
          <div className="w-full flex justify-between text-orange-400">
            {this.renderHearts()}
            <div className="flex justify-center py-2 px-3 rounded-full bg-orange-400 text-white">
              <span className="material-icons select-none">hourglass_empty</span>
              {this.state.countDown}
            </div>
            <div className="w-20 text-right font-medium">{`${
              this.state.currentIndex + 1
            }/${this.state.questions.length}`}</div>
          </div>

          <div className="w-full flex justify-center text-orange-400 mt-4"></div>
          <div className="h-60 flex flex-col items-center justify-center text-center">
            <p className="text-center text-sm text-gray-700">{question.category}</p>
            <p className="font-medium text-2xl">{question.question}</p>
          </div>
          <p className="text-center h-4">
            {answered ? "click anywhere to go to the next question" : ""}
          </p>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 pt-4">
            {options.map(this.renderQuestionButton, this)}
          </div>
          {this.renderOverlay(answered)}
        </div>
      );
    } else return this.renderLoading();
  }

  renderLoading() {
    return (
      <div className="max-w-full flex items-center justify-center min-h-[400px]">
        <svg
          className="animate-spin h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25 stroke-orange-500"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 fill-orange-500"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  renderHearts() {
    const { lives } = this.state;
    const icon = (index) =>
      index + 1 <= lives ? "favorite" : "favorite_border";
    return (
      <div className="flex justify-center w-20">
        <span className="material-icons select-none text-2xl">{icon(0)}</span>
        <span className="material-icons select-none text-2xl">{icon(1)}</span>
        <span className="material-icons select-none text-2xl">{icon(2)}</span>
      </div>
    );
  }

  renderOverlay(answered) {
    if (answered)
      return (
        <div
          className="w-screen h-screen cursor-pointer z-10 fixed top-0 left-0"
          onClick={() => this.nextQuestion()}
        ></div>
      );
    return null;
  }

  getCurrentQuestion() {
    return this.state.questions[this.state.currentIndex];
  }

  handleOptionSelect(option) {
    window.clearInterval(this.interval);
    const questions = this.state.questions.slice();
    const question = questions[this.state.currentIndex];
    const correct = question.correctAnswer === option;
    question.selected = option;
    let lives = this.state.lives;
    if (!correct) lives--;
    this.setState({
      questions,
      lives,
    });
  }
}

export default Game;
