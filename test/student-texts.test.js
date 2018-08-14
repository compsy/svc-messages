import StudentTexts from '../src/student-texts';
describe('StudentTexts', () => {
  const subject = new StudentTexts();
  let protocol = {
    name: 'Name of the protocol',
    current_reward: 10,
    maximum_reward: 20,
    streak_threshold: 3
  };
  test('should send the kick off message for the voormeting', () => {
    const protocolCompletion = [ {
      completed: false,
      periodical: false,
      reward_points: 0,
      future: true,
      streak: -1
    } ];

    const expected = 'Welkom bij de kick-off van het onderzoek \'u-can-act\'. Fijn dat je meedoet! ' +
      'Vandaag starten we met een aantal korte vragen, morgen begint de wekelijkse vragenlijst. ' +
      'Via de link kom je bij de vragen en een filmpje met meer info over u-can-act. Succes!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when the voormeting is not yet filled out', () => {
    // Timecop.freeze(2018, 5, 19) do
    const protocolCompletion = [ {
      completed: false,
      periodical: false,
      reward_points: 0,
      future: true,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 0,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 0,
      future: true,
      streak: 2
    }
    ];
    const expected = 'Hartelijk dank voor je inzet! Naast de wekelijkse vragenlijst sturen we je deze week ' +
      'ook nog even de allereerste vragenlijst (de voormeting), die had je nog niet ingevuld. ' +
      'Je beloning loopt gewoon door natuurlijk!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message for the first weekly questionnaire', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'Vul jouw eerste wekelijkse vragenlijst in en verdien twee euro!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when about to be on a streak', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 2
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 3
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 4
    }
    ];
    const expected = 'Je bent goed bezig {{deze_student}}! Vul deze vragenlijst in en bereik de bonus-euro-streak!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });
  test('should send a special message when on a streak', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 2
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 3
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 4
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 5
    }
    ];
    const expectedSet = subject.onStreakPool();
    expect(expectedSet).toBeInstanceOf(Array);
    expect(expectedSet.length).toBeGreaterThan(5);
    const result = expectedSet.includes(subject.pooledMessage(protocol, protocolCompletion));
    expect(result).toBeTruthy();
  });

  test('should send a special message when passing a reward threshold', () => {
    let protocolCompletion = [];
    protocol = {
      name: 'Name of the protocol',
      current_reward: 800,
      maximum_reward: 1000,
      streak_threshold: 3
    };
    let expected = 'Whoop! Na deze vragenlijst heb je €10,- verdiend. Ga zo door!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);

    protocol = {
      name: 'Name of the protocol',
      current_reward: 1900,
      maximum_reward: 2000,
      streak_threshold: 3
    };
    expected = 'Je gaat hard {{deze_student}}! Na deze vragenlijst heb je al €20,- gespaard.';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when the first two responses were missed', () => {
    const protocolCompletion = [ {
      completed: false,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'Vergeten te starten {{deze_student}}? Geen probleem, dat kan als nog! ' +
      'Start met het helpen van andere jongeren en vul de vragenlijst in.';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });
  test('should send a special message after one response was missed but the one before that was completed', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 2
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'We hebben je gemist vorige week. Help je deze week weer mee?';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });
  test('should send a special message after one response was missed but was on a streak before that', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 2
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 3
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'Je was heel goed bezig met het onderzoek {{deze_student}}! ' +
      'Probeer je opnieuw de bonus-euro-streak te halen?';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });
  test('should send a special message after more than one response was missed but there are completed responses', () => {
    const protocolCompletion = [ {
      completed: false,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'Je hebt ons al enorm geholpen met de vragenlijsten die je hebt ingevuld {{deze_student}}. ' +
      'Wil je ons weer helpen?';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when all periodical responses were missed', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 1
    }
    ];
    const expected = 'Start met u-can-act en help jouw begeleiders en andere ' +
      'jongeren terwijl jij €2,- per drie minuten verdient!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when rejoining after a single missed measurement', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 2
    }
    ];
    const expected = 'Na een weekje rust ben je er sinds de vorige week weer bij. Fijn dat je weer mee doet!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  test('should send a special message when rejoining after a single missed measurement', () => {
    const protocolCompletion = [ {
      completed: true,
      periodical: false,
      reward_points: 0,
      future: false,
      streak: -1
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 0
    },
    {
      completed: true,
      periodical: true,
      reward_points: 100,
      future: false,
      streak: 1
    },
    {
      completed: false,
      periodical: true,
      reward_points: 100,
      future: true,
      streak: 2
    }
    ];
    const expected = 'Sinds vorige week ben je er weer bij. Super! ' +
      'Vul nog twee vragenlijsten in en jaag op de bonus euro\'s!';
    expect(subject.pooledMessage(protocol, protocolCompletion)).toEqual(expected);
  });

  describe('first_response_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.first_response_pool;
      }).not.toThrow();
    });
  });
  describe('repeated_first_response_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.repeated_first_response_pool;
      }).not.toThrow();
    });
  });
  describe('second_response_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.second_response_pool;
      }).not.toThrow();
    });
  });
  describe('rewardsThresholdPool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.rewardsThresholdPool(1);
      }).not.toThrow();
    });
    test('should have a message for 10 euro', () => {
      expect(subject.rewardsThresholdPool(1000))
        .toEqual([ 'Whoop! Na deze vragenlijst heb je €10,- verdiend. Ga zo door!' ]);
    });
    test('should have a message for 20 euro', () => {
      expect(subject.rewardsThresholdPool(2000))
        .toEqual([ 'Je gaat hard {{deze_student}}! Na deze vragenlijst heb je al €20,- gespaard.' ]);
    });
    test('should have a message for 30 euro', () => {
      expect(subject.rewardsThresholdPool(3000))
        .toEqual([ 'De teller blijft lopen! Na deze vragenlijst passeer jij de €30,- 😃' ]);
    });
    test('should have a message for 40 euro', () => {
      expect(subject.rewardsThresholdPool(4000))
        .toEqual([ 'Hé {{deze_student}}. Door jouw goede inzet heb je bijna €40,- verdiend!' ]);
    });
    test('should have a message for 50 euro', () => {
      expect(subject.rewardsThresholdPool(5000))
        .toEqual([ 'Geweldig, na deze vragenlijst heb je al €50,- verdiend!' ]);
    });
    test('should have a message for 60 euro', () => {
      expect(subject.rewardsThresholdPool(6000))
        .toEqual([ 'Door jouw fantastische hulp heb jij al bijna €60,- verdiend!' ]);
    });
    test('should have a message for 70 euro', () => {
      expect(subject.rewardsThresholdPool(7000))
        .toEqual([ 'Weet jij al wat je gaat doen met de €70,- die jij na deze vragenlijst hebt verdiend?' ]);
    });
    test('should have a message for 80 euro', () => {
      expect(subject.rewardsThresholdPool(8000))
        .toEqual([ 'Wat heb jij je al ontzettend goed ingezet {{deze_student}}! Inmiddels heb je bijna €80,- verdiend.' ]);
    });
    test('should return an empty array otherwise', () => {
      expect(subject.rewardsThresholdPool(10000)).toEqual([]);
    });
  });
  describe('defaultPool', () => {
    test('should not raise an error with nil', () => {
      expect(() => {
        subject.defaultPool();
      }).not.toThrow();
    });

    test('should never include the begeleider specific texts if the protocol has the name studenten_control', () => {
      protocol.name = 'studenten_control';
      let result = subject.defaultPool(protocol);
      let check = result.includes('Help {{naam_begeleider}} om {{zijn_haar_begeleider}} werk ' +
        'beter te kunnen doen en vul deze vragenlijst in \uD83D\uDE00.');
      expect(check).toBeFalsy();
      check = result.includes('Heel fijn dat je meedoet, hiermee help je {{naam_begeleider}} ' +
        '{{zijn_haar_begeleider}} begeleiding te verbeteren!');
      expect(check).toBeFalsy();

      // Check if the begeleider at all is in the text.
      // Note that je_begeleidingsinitiatief and begeleiding are allowed.
      result = result.join();
      expect(result).toEqual(expect.not.stringMatching(/begeleider/));
    });

    test('should include the begeleider specific texts for other protocol names', () => {
      protocol.name = 'other_protocol';
      let result = subject.defaultPool(protocol);
      expect(result).toEqual(expect.arrayContaining(
        [ 'Help {{naam_begeleider}} om {{zijn_haar_begeleider}} werk ' +
        'beter te kunnen doen en vul deze vragenlijst in \uD83D\uDE00.' ]
      ));

      expect(result).toEqual(expect.arrayContaining([ 'Heel fijn dat je meedoet, hiermee help je {{naam_begeleider}} ' +
        '{{zijn_haar_begeleider}} begeleiding te verbeteren!' ]));

      // Check if the begeleieder at all is in the text
      result = result.join();
      expect(result).toEqual(expect.stringMatching(/begeleider/));
    });
  });
  describe('aboutToBeOnStreakPool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.aboutToBeOnStreakPool();
      }).not.toThrow();
    });
  });
  describe('on_streak_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.onStreakPool();
      }).not.toThrow();
    });
  });
  describe('first_responses_missed_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.firstResponsesMissedPool();
      }).not.toThrow();
    });
  });
  describe('missed_last_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.missedLastPool();
      }).not.toThrow();
    });
  });
  describe('missed_more_than_one_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.missedMoreThanOnePool();
      }).not.toThrow();
    });
  });
  describe('missed_everything_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.missedEverythingPool();
      }).not.toThrow();
    });
  });
  describe('rejoined_after_missing_one_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.rejoinedAfterMissingOnePool();
      }).not.toThrow();
    });
  });
  describe('rejoined_after_missing_multiple_pool', () => {
    test('should not raise an error', () => {
      expect(() => {
        return subject.rejoinedAfterMissingMultiplePool();
      }).not.toThrow();
    });
  });
});
