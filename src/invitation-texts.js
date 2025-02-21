export default class InvitationTexts {
  constructor() {
    this.MAX_REWARD_THRESHOLD = 8000;
    this.protocol = undefined;
  }

  message(_response, _protocolSubscription) {
    throw new Error('method message not implemented by subclass!');
  }

  firstResponsePool() {
    throw new Error('method firstResponsePool not implemented by subclass!');
  }

  repeatedFirstResponsePool() {
    throw new Error('method repeatedFirstResponsePool not implemented by subclass!');
  }

  secondResponsePool() {
    throw new Error('method secondResponsePool not implemented by subclass!');
  }

  rewardsThresholdPool(_threshold) {
    throw new Error('method rewardsThresholdPool not implemented by subclass!');
  }

  defaultPool() {
    throw new Error('method defaultPool not implemented by subclass!');
  }

  aboutToBeOnStreakPool() {
    throw new Error('method aboutToBeOnStreakPool not implemented by subclass!');
  }

  onStreakPool() {
    throw new Error('method onStreakPool not implemented by subclass!');
  }

  firstResponsesMissedPool() {
    throw new Error('method firstResponsesMissedPool not implemented by subclass!');
  }

  missedLastPool() {
    throw new Error('method missedLastPool not implemented by subclass!');
  }

  missedMoreThanOnePool() {
    throw new Error('method missedMoreThanOnePool not implemented by subclass!');
  }


  missedEverythingPool() {
    throw new Error('method missedEverythingPool not implemented by subclass!');
  }

  rejoinedAfterMissingOnePool() {
    throw new Error('method rejoinedAfterMissingOnePool not implemented by subclass!');
  }

  rejoinedAfterMissingMultiplePool() {
    throw new Error('method rejoinedAfterMissingMultiplePool not implemented by subclass!');
  }

  missedAfterStreakPool() {
    throw new Error('method missedAfterStreakPool not implemented by subclass!');
  }

  isAnnouncementWeek() {
    // Time.zone.now > Time.new(2018, 7, 24).inTimeZone &&
    // Time.zone.now < Time.new(2018, 8, 1).inTimeZone
    const fromDate = Date.parse('7/24/2018');
    const toDate = Date.parse('8/1/2018');
    const today = new Date();

    if (today < toDate && today >= fromDate) {
      return true;
    }
    return false;
  }

  targetFirstName(response) {
    return response.person.first_name;
  }

  currentIndex(protocolCompletion) {
    const val= protocolCompletion.findIndex((elem) => {
      return elem.future;
    });
    return val;
  }

  specialConditions(protocolCompletion, curidx) {
    let smsPool = [];
    const empty = 0;
    smsPool = this.push(smsPool, this.firstResponsesConditions(protocolCompletion, curidx));

    if (smsPool.length === empty) {
      smsPool = this.push(smsPool, this.missedResponsesConditions(protocolCompletion, curidx));
    }

    if (smsPool.length === empty) {
      smsPool = this.push(smsPool, this.rejoinedConditions(protocolCompletion, curidx));
    }

    return smsPool;
  }

  thresholdConditions() {
    const rewardsBefore = this.protocol.current_reward;
    const rewardsAfter = this.protocol.maximum_reward;

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
    if (protocolCompletion[curidx].streak === this.streakThreshold()) {
      smsPool = this.push(smsPool, this.aboutToBeOnStreakPool());
    }

    // On bonus streak( == on streak > 3)
    if (protocolCompletion[curidx].streak > this.streakThreshold() && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.onStreakPool());
    }

    return smsPool;
  }

  sampleMessage(messages) {
    //console.log(Math.floor(Math.random() * messages.length));
    return messages[Math.floor(Math.random() * messages.length)];
  }

  push(arr, value) {
    if (value === undefined || value === [ undefined ]) {
      return [];
    }
    return arr.concat(value);
  }

  rubySlice(arr, from, to) {
    if (from === to) { return [arr[from]]; }
    return arr.slice(from, to);
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
    if (!this.completedSome(protocolCompletion) && smsPool.length === 0) {
      smsPool = this.push(smsPool, this.firstResponsePool());
    }

    return smsPool;
  }

  truncatedProtocolCompletion(protocolCompletion, curidx) {
    return this.rubySlice(protocolCompletion, 0, curidx);
  }

  completedSome(protocolCompletion) {
    return protocolCompletion.some((x) => {
      return x.completed;
    });
  }

  missedFirstTwoResponses(protocolCompletion, curidx) {
    // That is: the voormeting and the first periodical measurement
    // Minimal pattern: ..C(V = voormeting, X = completed, C = current)
    // index: 012
    return curidx === 2 &&
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
      protocolCompletion[curidx - 2].streak >= this.streakThreshold();
  }

  missedMoreThanOne(protocolCompletion, curidx) {
    // Minimal pattern: VX..C(V = voormeting, X = completed, C = current)
    // index: 01234
    return curidx > 3 &&
      !protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      this.rubySlice(protocolCompletion, 1, curidx - 3).some((x) => {
        return x.completed;
      });
  }

  missedEverything(protocolCompletion, curidx) {
    // Minimal pattern: V.C(V = voormeting, X = completed, C = current)
    // index: 012
    return curidx > 1 &&
      !this.rubySlice(protocolCompletion, 1, curidx - 1).some((x) => {
        return x.completed;
      });
  }

  rejoinedAfterMissingOne(protocolCompletion, curidx) {
    // Minimal pattern: VX.XC(V = voormeting, X = completed, C = current)
    // index: 01234
    return curidx > 3 &&
      protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      protocolCompletion[curidx - 3].completed;
  }

  rejoinedAfterMissingMultiple(protocolCompletion, curidx) {
    // Minimal pattern: VX..XC(V = voormeting, X = completed, C = current)
    // index: 012345
    return curidx > 4 &&
      protocolCompletion[curidx - 1].completed &&
      !protocolCompletion[curidx - 2].completed &&
      !protocolCompletion[curidx - 3].completed &&
      this.rubySlice(protocolCompletion, 1, curidx - 4).some((x) => {
        return x.completed;
      });
  }

  streakThreshold() {
    //Protocol.findByName('studenten') & .rewards & .second & .threshold || 3
    const defaultStreak = 3;
    return this.protocol.streak_threshold || 3;
  }

  isPostAssessment(response) {
    return response.questionnaire_name.toLowerCase().indexOf('nameting');
  }
}
