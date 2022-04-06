import React, { Component } from "react";

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

export default SelectInput;