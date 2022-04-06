import React, { Component } from "react";
import SelectInput from "./SelectInput";
import axios from "axios";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../helpers/persist-settings";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.getSavedSettings();
  }

  state = {
    options: {
      difficulties: [
        { value: "easy", text: "Easy" },
        { value: "medium", text: "Medium" },
        { value: "hard", text: "Hard" },
      ],
      types: [
        { value: "multiple", text: "Multiple Choice" },
        { value: "boolean", text: "True/False" },
      ],
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
    },
    settings: defaultSettings,
  };

  render() {
    return (
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 w-full">
        <SelectInput
          options={this.state.options.categories}
          value={this.state.settings.category}
          onChange={(value) => this.onSelect("category", value)}
          label="Category"
        />

        <SelectInput
          options={this.state.options.types}
          value={this.state.settings.type}
          onChange={(value) => this.onSelect("type", value)}
          label="Type"
        />

        <SelectInput
          options={this.state.options.difficulties}
          value={this.state.settings.difficulty}
          onChange={(value) => this.onSelect("difficulty", value)}
          label="Difficulty"
        />

        <SelectInput
          options={this.state.options.questionsAmount}
          value={this.state.settings.questionsAmount}
          onChange={(value) => this.onSelect("questionsAmount", value)}
          label="Questions"
        />

        <SelectInput
          options={this.state.options.timeLimits}
          value={this.state.settings.timeLimit}
          onChange={(value) => this.onSelect("timeLimit", value)}
          label="Time Limit"
        />
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
        const { options } = this.state;
        options.categories = categories;
        this.setState({ options });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onSelect(property, value) {
    const { settings } = this.state;
    settings[property] = value;
    this.setState({ settings });
  }

  setSavedSettings() {
    const { settings } = this.state;
    saveSettings(settings);
  }

  getSavedSettings() {
    const settings = loadSettings();
    this.setState({ settings });
  }
}

class Menu extends Component {
  state = {
    showSettings: false,
  };

  render() {
    const { showSettings } = this.state;
    let content;
    if (!showSettings) {
      content = (
        <div>
          <button
            className="bg-orange-400 text-white hover:bg-orange-500 font-medium rounded-full h-32 w-32 hover:shadow-md hover:-translate-y-0.5 transition duration-150 ease-in-out"
            onClick={() =>
              this.props.onStart(this.state.settings || defaultSettings)
            }
          >
            PLAY
          </button>
          <button onClick={() => this.setState({ showSettings: true })}>
            <span className="material-icons">settings</span>
          </button>
        </div>
      );
    } else {
      content = (
        <Settings
          onClose={() => this.setState({ showSettings: false })}
        ></Settings>
      );
    }
    return (
      <div className="max-w-full min-h-[400px] flex flex-col">
        <div className="flex items-center justify-center grow w-full">
          {content}
        </div>
      </div>
    );
  }
}

export default Menu;
