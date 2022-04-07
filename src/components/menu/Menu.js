import React, { Component } from "react";
import Settings from "./Settings";

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
              this.props.onStart()
            }
          >
            PLAY
          </button>
          <button
            onClick={() => this.setState({ showSettings: true })}
            className="absolute right-3 top-3 text-orange-400 hover:text-orange-500 hover:-translate-y-0.5 transition duration-150 ease-in-out"
          >
            <span className="material-icons text-3xl">settings</span>
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
