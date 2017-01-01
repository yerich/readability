import React from 'react';
import ReactDOM from 'react-dom';
require('./style.less');
import questions from 'json-loader!./text.json';
import Instructions from './instructions.jsx';

const TextPassage = (props) => (
  <div className="text-passage-wrapper">
    <div className="text-passage">
      {props.question.text}
    </div>
    <div className="next-button-wrapper">
      <a className="button" href="#" onClick={props.finished}>Finished reading</a>
    </div>
  </div>
);

const PreTextPassage = (props) => (
  <div className="pre-text-passage-wrapper">
    <div>
      <p>
        On the next screen, you will be presented with a short text article.
      </p>
      <p>
        <strong>Read the text at a natural pace, as if you were reading a novel or
        news article.</strong>
      </p>
      <p>
        <strong>Click "finished reading" as soon as you are done.</strong>
      </p>
    </div>
    <div className="next-button-wrapper">
      <a className="button" href="#" onClick={props.finished}>Continue</a>
    </div>
  </div>
);

class Hello extends React.Component {
  constructor() {
    super();
    window.q = this;
    this.state = {
      screen: 'instructions',
      currentQuestion: questions[0]
    }

    setTimeout(() => {
      document.getElementById('screen-too-small-error').innerHTML = "Your browser window is too small. Please maximize your browser window or " +
        "adjust your monitor's resolution settings. This survey requires a minimum " +
        "resolution of 1024x768."
    }, 1000);
  }

  render() {
    let inner;
    if (this.state.screen === 'textPassage') {
      inner = <TextPassage question={this.state.currentQuestion} finished={() => alert('test')} />
    }
    else if (this.state.screen === 'instructions') {
      inner = <Instructions finished={() => this.setState({ screen: 'preTextPassage' })} />
    }
    else if (this.state.screen === 'preTextPassage') {
      inner = <PreTextPassage finished={() => this.setState({ screen: 'textPassage' })} />
    }

    return <div className="wrapper">
      <div className="survey-main">
        {inner}
      </div>
    </div>
  }
}
 
ReactDOM.render(<Hello/>, document.getElementById('react-main'));
