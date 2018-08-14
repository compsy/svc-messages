import '../src/service';

import StudentTexts from '../src/student-texts';
import MentorTexts from '../src/mentor-texts';
jest.mock('../src/mentor-texts');
jest.mock('../src/student-texts', () => {
  return jest.fn().mockImplementation(() => {
    return {
      message: (_response, _protsub) => {
        return 'The message';
      }
    };
  });
});
import main from '../src/service';

describe('main', () => {
  test('throws when params are undefined', () => {
    expect(() => {
      return main(undefined);
    }).toThrow('You need to provide the correct params instead of undefined');
  });

  test('throws when params dont have a person', () => {
    const params = {
      a: 1
    };
    const expected = `You need to provide the correct params instead of ${JSON.stringify(params)}`;
    expect(() => {
      return main(params);
    }).toThrow(expected);
  });


  test('calls the mentor text generator when we are dealing with a mentor', () => {
    const expected = 1;
    const notExpected = 0;
    const params = {
      person: {
        group: 'mentor'
      }
    };
    main(params);
    expect(MentorTexts).toHaveBeenCalledTimes(expected);
    expect(StudentTexts).toHaveBeenCalledTimes(notExpected);
  });

  test('calls the student text generator when we are dealing with a student', () => {
    const expected = 1;
    const notExpected = 0;
    const params = {
      person: {
        group: 'student'
      }
    };
    main(params);
    expect(MentorTexts).toHaveBeenCalledTimes(notExpected);
    expect(StudentTexts).toHaveBeenCalledTimes(expected);
  });

  test('throws if the group is not found', () => {
    const expected = 0;
    const params = {
      person: {
        group: 'nothing'
      }
    };
    expect(() => {
      main(params);
    }).toThrow('Group nothing not yet supported');
    expect(MentorTexts).toHaveBeenCalledTimes(expected);
    expect(StudentTexts).toHaveBeenCalledTimes(expected);
  });

  test('returns the value of the generator in a json object', () => {
    const params = {
      person: {
        group: 'student'
      }
    };
    const result = main(params);
    expect(result).toEqual({
      payload: 'The message'
    });
  });
});
