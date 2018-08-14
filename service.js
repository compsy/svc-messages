import StudentTexts from './student-texts';
import MentorTexts from './mentor-texts';

function getGenerator(isMentor) {
  if (isMentor) {
    return new MentorTexts();
  }
  return new StudentTexts();
}

function main(params) {
  const isMentor = false;

  const generator = getGenerator(isMentor);
  const text = generator.message(params.response, params.protocol_subscription);
  return {
    payload: text
  };
}

export default main;
