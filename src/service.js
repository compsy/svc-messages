import StudentTexts from './student-texts';
import MentorTexts from './mentor-texts';

function main(params) {
  if (params === undefined || params.person === undefined) {
    throw(`You need to provide the correct params ${JSON.stringify(params)}`)
  }

  const personGroup = params.person.group;
  const generator = getGenerator(personGroup);
  const text = generator.message(params.response, params.protocol_subscription);
  return {
    payload: text
  };
}

function getGenerator(group) {
  if (isMentor(group)) return new MentorTexts();
  if (isStudent(group)) return new StudentTexts();

  throw (`Group ${group} not yet supported`);
}

function isMentor(group) {
  return group.toLowerCase() === 'mentor'
}


function isStudent(group) {
  return group.toLowerCase() === 'student'
}

export default main;
