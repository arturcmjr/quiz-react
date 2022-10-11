import { Component } from "react";
import SelectInput from "./SelectInput";
import axios from "axios";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../../helpers/persist-settings";

class Settings extends Component {
  state = {
    options: {
      difficulties: [
        { value: "any", text: "Any Difficulty" },
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
    settings: { ...defaultSettings },
  };

  render() {
    return (
      <div className="w-full min-h-[400px] flex flex-col">
        <div className="grow">
          <div className="text-2xl text-center my-3 font-light">Settings</div>
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
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => {
              this.setDefaultSettings();
            }}
            className="text-orange-700 hover:text-orange-900 py-2 px-4"
          >
            DEFAULT
          </button>
          <button
            onClick={() => {
              this.onConfirm();
            }}
            className="text-orange-700 hover:text-orange-900 py-2 px-4"
          >
            CONFIRM
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.fetchCategories();
    const savedSettings = loadSettings();
    let { settings } = this.state;
    for (let key in settings) {
      settings[key] = savedSettings[key];
    }
    this.setState({ settings });
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

  setDefaultSettings() {
    let { settings } = this.state;
    for (let key in settings) {
      settings[key] = defaultSettings[key];
    }
    this.setState({ settings });
  }

  onConfirm() {
    this.setSavedSettings();
    this.props.onClose();
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
}

export default Settings;
