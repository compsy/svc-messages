import StudentTexts from './student-texts';
import MentorTexts from './mentor-texts';

function isMentor(group) {
  return group.toLowerCase() === 'mentor';
}


function isStudent(group) {
  return group.toLowerCase() === 'student';
}

function getGenerator(group) {
  if (isMentor(group)) {
    return new MentorTexts();
  }
  if (isStudent(group)) {
    return new StudentTexts();
  }

  throw new Error(`Group ${group} not yet supported`);
}

function main(params) {
  if (params === undefined || params.person === undefined) {
    throw new Error(`You need to provide the correct params instead of ${JSON.stringify(params)}`);
  }

  const personGroup = params.person.group;
  const generator = getGenerator(personGroup);
  const text = generator.message(params.response, params.protocol_subscription);
  return {
    payload: text
  };
}

export default main;

    //const currentProtocolCompletion = this.truncatedProtocolCompletion(protocolCompletion, curidx);
// protocol: {
// current_reward: protocol.calculateReward(currentProtocolCompletion, false),
// maximum_reward: protocol.calculateReward(currentProtocolCompletion, true);
// }
