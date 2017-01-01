import React, { Component } from 'react';

class TextPassage extends Component {
  render() {
    return (
      <div className="text-passage-wrapper">
        <div className="text-passage-instructions">
          Read the following article at a natural pace, as if you were reading a newspaper article or novel. 
          Try not to go back and re-read any part for any missed details. Press "next" as soon as you are done.
        </div>
        <div className="text-passage">
          {this.props.question.text}
        </div>
      </div>
    );
  }
}

export default TextPassage;
