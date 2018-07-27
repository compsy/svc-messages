'use strict';

import StudentTexts from './student-texts';
import MentorTexts from './mentor-texts';

function main(params) {
  const mentor = false
  let generator;
  if (mentor === true) {
    generator = new MentorTexts();
  } else {
    generator = new StudentTexts();
  }
  const text = generator.message(params.response, params.protocol_subscription);
  return { payload: text };
}

export default main;
