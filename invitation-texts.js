export default class InvitationTexts {
  constructor() {
    this.MAX_REWARD_THRESHOLD = 8000;
  }

  message(Response) {
    throw 'method message not implemented by subclass!';
  }

  firstResponsePool() {
    throw 'method firstResponsePool not implemented by subclass!';
  }

  repeatedFirstResponsePool() {
    throw 'method repeatedFirstResponsePool not implemented by subclass!';
  }

  secondResponsePool() {
    throw 'method secondResponsePool not implemented by subclass!';
  }

  rewardsThresholdPool(Threshold) {
    throw 'method rewardsThresholdPool not implemented by subclass!';
  }

  defaultPool(Protocol) {
    throw 'method defaultPool not implemented by subclass!';
  }

  aboutToBeOnStreakPool() {
    throw 'method aboutToBeOnStreakPool not implemented by subclass!';
  }

  onStreakPool() {
    throw 'method onStreakPool not implemented by subclass!';
  }

  firstResponsesMissedPool() {
    throw 'method firstResponsesMissedPool not implemented by subclass!';
  }

  missedLastPool() {
    throw 'method missedLastPool not implemented by subclass!';
  }

  missedMoreThanOnePool() {
    throw 'method missedMoreThanOnePool not implemented by subclass!';
  }

  missedEverythingPool() {
    throw 'method missedEverythingPool not implemented by subclass!';
  }

  rejoinedAfterMissingOnePool() {
    throw 'method rejoinedAfterMissingOnePool not implemented by subclass!';
  }

  rejoinedAfterMissingMultiplePool() {
    throw 'method rejoinedAfterMissingMultiplePool not implemented by subclass!';
  }

  missedAfterStreakPool() {
    throw 'method missedAfterStreakPool not implemented by subclass!';
  }

  isAnnouncementWeek() {
    // Time.zone.now > Time.new(2018, 7, 24).inTimeZone &&
    // Time.zone.now < Time.new(2018, 8, 1).inTimeZone
    return false;
  }

  targetFirstName(response) {
    response.first_name;
  }

  currentIndex(protocolCompletion) {
    return protocolCompletion.findIndex((elem) => {
      return elem.future;
    });
  }

  specialConditions(protocolCompletion, curidx) {
    let smsPool = [];
    smsPool = this.push(smsPool, this.firstResponsesConditions(protocolCompletion, curidx));
    if (smsPool.length === 0) {
      smsPool = this.push(smsPool, this.missedResponsesConditions(protocolCompletion, curidx));
    }

    if (smsPool.length === 0) {
      smsPool = this.push(smsPool, this.rejoinedConditions(protocolCompletion, curidx));
    }

    return smsPool;
  }

  thresholdConditions(protocol, protocolCompletion, curidx) {
    const currentProtocolCompletion = this.truncatedProtocolCompletion(protocolCompletion, curidx);
    // calculateReward(currentProtocolCompletion, false);
    const rewardsBefore = protocol.current_reward;
    // protocol.calculateReward(currentProtocolCompletion, true);
    const rewardsAfter = protocol.maximum_reward;

    let smsPool = [];
    const sequence = this.generateSequence(this.MAX_REWARD_THRESHOLD, 1000);

    sequence.forEach((threshold) => {
      if (rewardsBefore < threshold && rewardsAfter >= threshold) {
        smsPool = this.push(smsPool, this.rewardsThresholdPool(threshold));
      }
    });

    return smsPool;
  }

  streakConditions(protocolCompletion, curidx) {
    let smsPool = [];

    // Streak about to be 3
    if (protocolCompletion[curidx].streak === this.streakSize()) {
      smsPool = this.push(smsPool, this.aboutToBeOnStreakPool());
    }

    // On bonus streak( == on streak > 3)
    if (protocolCompletion[curidx].streak > this.streakSize() && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.onStreakPool());
    }

    return smsPool;
  }

  sampleMessage(messages) {
    console.log(Math.floor(Math.random() * messages.length));
    return messages[Math.floor(Math.random() * messages.length)];
  }

  push(array, value) {
    if (value === undefined || value === [undefined]) {
      return [];
    }
    array = array.concat(value);
    console.log(array.length);
    return array;
  }

  rejoinedConditions(protocolCompletion, curidx) {
    let smsPool = [];

    // Opnieuw gestart na 1 gemiste meting
    if (this.rejoinedAfterMissingOne(protocolCompletion, curidx)) {
      smsPool = this.push(smsPool, this.rejoinedAfterMissingOnePool());
    }

    // Opnieuw gestart na 2 + metingen te hebben gemist
    if (this.rejoinedAfterMissingMultiple(protocolCompletion, curidx) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.rejoinedAfterMissingMultiplePool());
    }
    return smsPool;
  }

  generateSequence(to, stepSize) {
    const arr = Array.apply(null, {
      length: to / stepSize
    });

    return arr.map((value, index) => {
      return (index + 1) * stepSize;
    });
  }

  missedResponsesConditions(protocolCompletion, curidx) {
    let smsPool = [];
    smsPool = this.push(smsPool, this.onlyMissedLastResponse(protocolCompletion, curidx));

    // Twee of meer vragenlijsten gemist(wel eerder vragenlijsten ingevuld)
    if (this.missedMoreThanOne(protocolCompletion, curidx) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.missedMoreThanOnePool());
    }

    // Alles tot nu toe gemist
    // Een vragenlijst gemist en nog nooit een vragenlijst ingevuld(geldt niet bij de tweede vragenlijst)
    // Only if the previous ones did not apply
    if (this.missedEverything(protocolCompletion, curidx) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.missedEverythingPool());
    }
    return smsPool;
  }

  onlyMissedLastResponse(protocolCompletion, curidx) {
    let smsPool = [];

    // Laatste vragenlijst gemist, zat in streak
    if (this.missedOneAfterStreakPool(protocolCompletion, curidx)) {
      smsPool = this.push(smsPool, this.missedAfterStreakPool());
    }

    // Laatste vragenlijst gemist, maar wel eerder vragenlijsten ingevuld
    if (this.missedLastOnly(protocolCompletion, curidx) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.missedLastPool());
    }

    return smsPool;
  }

  firstResponsesConditions(protocolCompletion, curidx) {
    let smsPool = [];
    if (curidx === 0) {
      smsPool = this.push(smsPool, this.firstResponseConditions(protocolCompletion, curidx));
    }

    // Eerste dagboekmeting
    if (curidx === 1 && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.secondResponsePool());
    }

    // Eerste twee metingen gemist
    if (this.missedFirstTwoResponses(protocolCompletion, curidx) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.firstResponsesMissedPool());
    }

    return smsPool;
  }

  firstResponseConditions(protocolCompletion, Curidx) {
    let smsPool = [];

    // Repeated Voormeting
    if (this.completedSome(protocolCompletion)) {
      smsPool = this.push(smsPool, this.repeatedFirstResponsePool());
    }

    // Voormeting
    if (!completedSome(protocolCompletion) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.firstResponsePool());
    }

    return smsPool;
  }

  truncatedProtocolCompletion(protocolCompletion, curidx) {
    protocolCompletion.slice(0, curidx);
  }

  completedSome(protocolCompletion) {
    protocolCompletion.some((x) => {
      return x.completed;
    });
  }

  missedFirstTwoResponses(protocolCompletion, curidx) {
    // That is: the voormeting and the first periodical measurement
    // Minimal pattern: ..C(V = voormeting, X = completed, C = current)
    // index: 012
    return curidx == 2 &&
      !protocolCompletion[0].completed &&
      !protocolCompletion[1].completed;
  }

  missedLastOnly(protocolCompletion, curidx) {
    // Minimal pattern: VX.C(V = voormeting, X = completed, C = current)
    // index: 0123
    return curidx > 2 &&
      !protocolCompletion[curidx - 1].completed &&
      protocolCompletion[curidx - 2].completed;
  }

  missedOneAfterStreakPool(protocolCompletion, curidx) {
    // Minimal pattern: VXXX.C(V = voormeting, X = completed, C = current)
    // index: 012345
    return curidx > 2 && // only make sure that we can check the index at curidx - 2.
      !protocolCompletion[curidx - 1].completed &&
      protocolCompletion[curidx - 2].completed &&
      protocolCompletion[curidx - 2].streak >= this.streakSize();
  }

  missedMoreThanOne(protocolCompletion, curidx) {
    // Minimal pattern: VX..C(V = voormeting, X = completed, C = current)
    // index: 01234
    curidx > 3 &&
      !protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      protocolCompletion.slice(1, curidx - 3).some((x) => {
        return x.completed;
      });
  }

  missedEverything(protocolCompletion, curidx) {
    // Minimal pattern: V.C(V = voormeting, X = completed, C = current)
    // index: 012
    curidx > 1 &&
      !protocolCompletion.slice(1, curidx - 1).some((x) => {
        return x.completed;
      });
  }

  rejoinedAfterMissingOne(protocolCompletion, curidx) {
    // Minimal pattern: VX.XC(V = voormeting, X = completed, C = current)
    // index: 01234
    curidx > 3 &&
      protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      protocolCompletion[curidx - 3].completed;
  }

  rejoinedAfterMissingMultiple(protocolCompletion, curidx) {
    // Minimal pattern: VX..XC(V = voormeting, X = completed, C = current)
    // index: 012345
    curidx > 4 &&
      protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      !protocolCompletion[curidx - 3].completed &&
      protocolCompletion.slice(1, curidx - 4).some((x) => {
        return x.completed;
      });
  }

  streakSize() {
    // Protocol.findByName('studenten') & .rewards & .second & .threshold || 3
    console.log('WRONG!');
    return 3;
  }

  postAssessment(response) {
    console.log('WRONG!');
    return true;
  }
}
