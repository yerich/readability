import React from 'react';

export default (props) => {
  let button;
  if (props.loaded) {
    button = <a className="button" href="#" onClick={props.finished}>Continue</a>;
  }
  else {
    button = <a className="button disabled" href="#">Loading...</a>;
  }

  return <div className="instructions">
    <h1>Reading speed study</h1>
    <p>
      Thank you for participating in this study.<br />
      <strong>Please take a moment to read the following instructions carefully.</strong>
    </p>
    <p>
      In this study, you'll be asked to read a few short text articles. The speed at which you
      read each of these articles will be timed.
    </p>
    <p>
      <strong>Read the article at a natural pace, as if you were reading a novel or
      news story.</strong>
    </p>
    <p>
      We will change the style of the text between screens, and our goal is to see
      if doing this has any impact on the speed at which people read. This is why
      it is very important to read at a natural, consistent pace.
    </p>
    <p>
      After you are done with reading the article, we will ask you a few very simple
      questions about it to make sure you've read the entire article. These questions
      are designed to be very easy to answer, so you shouldn't worry about forgetting
      or missing any details. You do not have to answer every question correctly. However,
      we may not award you credit if we believe you didn't read the entire article.
    </p>
    <p>
      <strong>This study should take around 10 minutes to complete.</strong>
    </p>
    <p>
      No personal information is collected in this study. Your IP address may be used
      for verification purposes as part of the Amazon Mechanical Turk program, but it will
      not be used for research purposes, nor will it ever be shared. Additionally, a screenshot
      of how your browser rendered the article will be taken and saved for accuracy purposes. The
      screenshot will be of the rendered text <em>only</em> &mdash; no other part of the 
      page, browser or desktop will be captured. You will be able to review these screenshots
      before submitting them.
    </p>
    <p>
      If you do not wish to participate in the study, or, at any time don't wish to continue,
      you may close the browser tab to stop your participation. Your answers will not be recorded.
      However, you will only recieve credit for the task if you complete the entirety of the study,
      submit your results, and enter the survey code at the end.
    </p>
    <p>
      <strong>Do not press the "back" button on your browser at any time during this study.</strong>
    </p>
    <p>
      When you are ready to begin the test, click the button below to continue.
    </p>
    <div className="next-button-wrapper">
      {button}
    </div>
  </div>;
};
