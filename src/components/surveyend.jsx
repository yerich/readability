import React from 'react';
import Request from 'superagent';

export default class SurveyEnd extends React.Component {
  constructor() {
    super();
    this.state = {
      submitted: false,
      submitting: false,
      surveyCode: null
    }
  }

  submit() {
    this.setState({
      submitting: true
    });
    Request.post('https://yerich.net/projects/readingspeed/api.php?url=complete')
      .send(this.props.submissionBody)
      .then((resp) => {
        if (!resp.body || !resp.body.survey_code) {
          resp.body = {
            survey_code: 'LRAV4S5A2 '
          }
        }
        this.setState({
          submitted: true,
          surveyCode: resp.body.survey_code
        });
      })
      .catch(function() {
        alert('Sorry, there was an error submitting your survey response.');
        this.setState({
          submitted: true,
          surveyCode: 'ERROR1262'
        });
      });
  }

  render() {
    if (this.state.submitted) {
      return <div>
        <h1>Thank you for completing this survey.</h1>
        <p>Your survey code is:</p>
        <h2>{this.state.surveyCode}</h2>
        <p>Please enter this code into the Mechanical Turk page.</p>
        <p>You may close this browser tab after submitting the task as complete.
          Once again, thank you for taking part in this study.
        </p>
        <p>
          This study was created by Richard Ye. Contact methods are available <a href="https://yerich.net">here</a>.
        </p>
      </div>
    }
    else {
      let screenShots = this.props.submissionBody.screenShots.map((s) => {
        return <img className="screenshot" src={s} key={Math.random()} />
      })

      return <div>
        <h1>You have reached the end of this survey.</h1>
        <p>
          Please click on the button below to submit the results of your survey. If you do not
          wish to submit this survey, you may close your browser tab. However, you will not receive
          credit for this survey unless you choose to submit it. After you have submitted your
          survey, you will recieve a survey code.
        </p>
        <div className="next-button-wrapper">
          <a className="button" href="#" onClick={this.submit.bind(this)} disabled={this.state.submitting}>
            {this.state.submitting ? 'Submitting...' : 'Submit survey'}
          </a>
        </div>
        <p>
          We've also taken screenshots of this survey to be able to see how it appeared
          on your screen. You may review those screenshots below.
        </p>
        <div className="screenshots-wrapper">
          {screenShots}
        </div>
      </div>
    }
  }
}
