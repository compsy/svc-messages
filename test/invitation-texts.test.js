import InvitationTexts from '../src/invitation-texts';

describe('InvitationTexts', () => {
  const subject = new InvitationTexts();

  describe('message', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.message(undefined, undefined);
      }).toThrow('method message not implemented by subclass!');
    });
  });

  describe('firstResponsePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.firstResponsePool();
      }).toThrow('method firstResponsePool not implemented by subclass!');
    });
  });

  describe('repeatedFirstResponsePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.repeatedFirstResponsePool();
      }).toThrow('method repeatedFirstResponsePool not implemented by subclass!');
    });
  });

  describe('secondResponsePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.secondResponsePool();
      }).toThrow('method secondResponsePool not implemented by subclass!');
    });
  });

  describe('rewardsThresholdPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.rewardsThresholdPool();
      }).toThrow('method rewardsThresholdPool not implemented by subclass!');
    });
  });

  describe('defaultPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.defaultPool();
      }).toThrow('method defaultPool not implemented by subclass!');
    });
  });

  describe('aboutToBeOnStreakPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.aboutToBeOnStreakPool();
      }).toThrow('method aboutToBeOnStreakPool not implemented by subclass!');
    });
  });

  describe('onStreakPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.onStreakPool();
      }).toThrow('method onStreakPool not implemented by subclass!');
    });
  });

  describe('repeatedFirstResponsePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.repeatedFirstResponsePool();
      }).toThrow('method repeatedFirstResponsePool not implemented by subclass!');
    });
  });

  describe('firstResponsesMissedPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.firstResponsesMissedPool();
      }).toThrow('method firstResponsesMissedPool not implemented by subclass!');
    });
  });

  describe('missedLastPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.missedLastPool();
      }).toThrow('method missedLastPool not implemented by subclass!');
    });
  });

  describe('missedMoreThanOnePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.missedMoreThanOnePool();
      }).toThrow('method missedMoreThanOnePool not implemented by subclass!');
    });
  });

  describe('missedEverythingPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.missedEverythingPool();
      }).toThrow('method missedEverythingPool not implemented by subclass!');
    });
  });


  describe('rejoinedAfterMissingOnePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.rejoinedAfterMissingOnePool();
      }).toThrow('method rejoinedAfterMissingOnePool not implemented by subclass!');
    });
  });

  describe('rejoinedAfterMissingMultiplePool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.rejoinedAfterMissingMultiplePool();
      }).toThrow('method rejoinedAfterMissingMultiplePool not implemented by subclass!');
    });
  });

  describe('missedAfterStreakPool', () => {
    test('should throw an error', () => {
      expect(() => {
        subject.missedAfterStreakPool();
      }).toThrow('method missedAfterStreakPool not implemented by subclass!');
    });
  });
});
