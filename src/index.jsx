import React from 'react';
import ReactDOM from 'react-dom';
require('./style.less');
import Instructions from './components/instructions.jsx';
import Request from 'superagent';
import html2canvas from 'html2canvas';
import SurveyEnd from './components/surveyend.jsx';

class TextPassage extends React.Component {
  constructor() {
    super();
    this.state ={
      startTime: Date.now()
    };
  }

  finished() {
    let timeTaken = (Date.now() - this.state.startTime);
    this.props.finished(timeTaken);
  }

  linesToParagraphs(...nodes) {
    return nodes
      .map(node => node.split('\n').map(text => <p>{text}</p>))
      .reduce((nodes, node) => nodes.concat(node), []);
  }

  componentDidMount() {
    html2canvas(this.passageDiv, {
      onrendered: (canvas) => {
        window.c = canvas;
        this.props.setScreenshot(canvas.toDataURL());
      } 
    })
  }

  render() {
    let text = this.props.survey.texts[this.props.currentText].text;
    let paragraphs = text.replace(/\r/g, '')
      .split('\n\n')
      .map((p, i) => <p key={i}>{p}</p>);
    let style = {
      fontFamily: this.props.survey.fonts[this.props.currentText]
    }

    return <div className="text-passage-wrapper">
      <div className="text-passage" style={style} ref={(div) => { this.passageDiv = div }}>
        {paragraphs}
      </div>
      <div className="next-button-wrapper">
        <a className="button" href="#" onClick={this.finished.bind(this)}>Finished reading</a>
      </div>
    </div>;
  }
};

const PreTextPassage = (props) => (
  <div className="pre-text-passage-wrapper">
    <div>
      <h1>Article {props.currentText} of {props.count}</h1>
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

class Quiz extends React.Component {
  constructor() {
    super();
    this.state = {
      answers: {}
    }
  }

  finished(e) {
    e.preventDefault();
    //if (!this.quizIncomplete()) {
      this.props.finished(this.state.answers);
    //}
  }

  quizIncomplete() {
    return Object.keys(this.state.answers).length < this.props.questions.length;
  }

  answerChanged(questionId) {
    return function(e) {
      let answers = this.state.answers;
      answers[questionId] = e.currentTarget.value;
      this.setState({
        answers: answers
      });
    }.bind(this);
  }

  render() {
    let quizQuestions = this.props.questions.map((question) => {
      return <div className="question" key={question.id}>
        <p className="question-text">{question.question}</p>
        <ul>
          {question.answers.map((answer, j) => {
            return <li key={j}>
              <input type="radio" id={"question-answer-" + question.id + "-" + j} name={"question-answer-" + question.id} value={answer.answer} onChange={this.answerChanged(question.id)} />
              <label htmlFor={"question-answer-" + question.id + "-" + j} className="question-answer-text">{answer.answer}</label>
            </li>
          })}
        </ul>
      </div>;
    });

    return <div className="quiz-wrapper">
      <h2>Please answer the following questions about the text you just read.</h2>
      <div className="questions-wrapper">
        {quizQuestions}
      </div>
      <div className="next-button-wrapper">
        <a className="button" href="#" onClick={this.finished.bind(this)} disabled={this.quizIncomplete()}>Submit Answers</a>
      </div>
    </div>
  }
}

class Main extends React.Component {
  constructor() {
    super();
    window.q = this;
    this.state = {
      screen: 'instructions',
      currentText: null,
      survey: null,
      answers: {},
      timeTaken: [],
      screenShots: []
    }

    setTimeout(() => {
      document.getElementById('screen-too-small-error').innerHTML = "Your browser window is too small. Please maximize your browser window or " +
        "adjust your monitor's resolution settings. This survey requires a minimum " +
        "resolution of 1024x768."
    }, 1000);

    //window.onbeforeunload = function() { return "Are you sure you wish to leave the survey?"; };

    Request.get('https://yerich.net/projects/readingspeed/api.php?url=survey')
      .accept('application/json')
      .then((res, err) => {
        console.log(res.body);
        this.setState({
          survey: res.body,
          currentText: 0
        });
        return true;
      })
      .catch(function() {
        alert('Sorry, there was an error loading the survey. The survey may no longer be available.');
      });
  }

  textFinished(timeTaken) {
    let record = this.state.timeTaken;
    record[this.state.currentText] = timeTaken;

    this.setState({
      timeTaken: record,
      screen: 'quiz'
    });
    window.scrollTo(0, 0);
  }

  quizFinished() {
    if (this.state.currentText < this.state.survey.texts.length - 1) {
      let newAnswers = Object.assign(this.state.answers, arguments[0]);
      this.setState({
        answers: newAnswers,
        screen: 'preTextPassage',
        currentText: this.state.currentText + 1
      });
      window.scrollTo(0, 0);
    }
    else {
      this.setState({
        screen: 'submit'
      })
      window.scrollTo(0, 0);
    }
  }

  setScreenshot(canvas) {
    let screenShots = this.state.screenShots;
    screenShots[this.state.currentText] = canvas;
    this.setState({
      screenShots: screenShots
    })
  }

  render() {
    window.q = this;
    let inner;
    if (this.state.screen === 'textPassage') {
      inner = <TextPassage survey={this.state.survey} 
        setScreenshot={this.setScreenshot.bind(this)}
        currentText={this.state.currentText} 
        finished={this.textFinished.bind(this)} />
    }
    else if (this.state.screen === 'instructions') {
      inner = <Instructions finished={() => { this.setState({ screen: 'preTextPassage' }); window.scrollTo(0, 0); }} loaded={!!this.state.survey} />
    }
    else if (this.state.screen === 'preTextPassage') {
      inner = <PreTextPassage 
        currentText={this.state.currentText + 1}
        count={this.state.survey.texts.length}
        finished={() => { this.setState({ screen: 'textPassage' }); window.scrollTo(0, 0); }} />
    }
    else if (this.state.screen === 'quiz') {
      inner = <Quiz 
        questions={this.state.survey.texts[this.state.currentText].questions} 
        finished={this.quizFinished.bind(this)} />
    }
    else if (this.state.screen === 'submit') {
      inner = <SurveyEnd 
        submissionBody={
          {
            screenShots: this.state.screenShots,
            answers: this.state.answers,
            timeTaken: this.state.timeTaken,
            survey: this.state.survey
          }
        } />
      // TODO submit survey, show completion code
    }

    return <div className="wrapper">
      <div className="survey-main">
        {inner}
      </div>
    </div>
  }
}
 
ReactDOM.render(<Main/>, document.getElementById('react-main'));
