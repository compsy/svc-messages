import InvitationTexts from './invitation-texts';

export default class StudentTexts extends InvitationTexts {
  message(response, protocolSubscription) {
    if (this.isAnnouncementWeek()) {
      return this.announcementWeekTexts(response);
    }
    return this.pooledMessage(protocolSubscription.protocol,
      protocolSubscription.protocol_completion);
  }

  pooledMessage(protocol, protocolCompletion) {
    const curidx = this.currentIndex(protocolCompletion);
    let smsPool = [];
    smsPool = this.push(smsPool, this.specialConditions(protocolCompletion, curidx));

    if (smsPool.length === 0) {
      smsPool = this.push(smsPool, this.thresholdConditions(protocol, protocolCompletion, curidx));
    }

    if (smsPool.length === 0) {
      smsPool = this.push(smsPool, this.streakConditions(protocolCompletion, curidx));
    }

    if (smsPool.length === 0) {
      smsPool = this.push(smsPool, this.defaultPool(protocol));
    }
    return this.sampleMessage(smsPool);
  }

  defaultPool(protocol) {
    // TODO: make sure to replace newlines by spaces in the email template.
    let inviteTexts = [
      'Hoi {{deze_student}},\nEr staat een vragenlijst voor je klaar \uD83D\uDE00.',
      'Een u-can-act tip: vul drie vragenlijsten achter elkaar in en verdien een euro extra per vragenlijst!',
      'Hoi {{deze_student}},\nVul direct de volgende vragenlijst in. Het kost maar 3 minuten en je helpt ons enorm!',
      'Hallo {{deze_student}},\nVerdien twee euro! Vul nu de vragenlijst in.',
      'Fijn dat jij meedoet! Door jou kunnen jongeren nog betere begeleiding krijgen in de toekomst!',
      'Help {{je_begeleidingsinitiatief}} nog beter te worden in wat ze doen en vul nu de vragenlijst in \uD83D\uDE00.'
    ];

    if (protocol.name !== undefined && protocol.name !== 'studenten_control') {
      inviteTexts = this.push(inviteTexts, 'Help {{naam_begeleider}} om {{zijn_haar_begeleider}} werk beter te kunnen doen en vul deze vragenlijst in \uD83D\uDE00.');
      inviteTexts = this.push(inviteTexts, 'Heel fijn dat je meedoet, hiermee help je {{naam_begeleider}} {{zijn_haar_begeleider}} begeleiding te verbeteren!');
    }
    return inviteTexts;
  }

  aboutToBeOnStreakPool() {
    return [
      'Je bent goed bezig {{deze_student}}! Vul deze vragenlijst in en bereik de bonus-euro-streak!'
    ];
  }

  onStreakPool() {
    return [
      'Fijn dat je zo behulpzaam bent {{deze_student}}! Vul je opnieuw de vragenlijst in?',
      'Je zit nog steeds in je bonus-euro-streak! Jouw u-can-act spaarpot raakt al behoorlijk vol \uD83D\uDE00.',
      'Bedankt voor je inzet! Ga zo door \uD83D\uDE00.',
      '{{deze_student}}, je bent een topper! Bedankt voor je goede hulp!',
      'Goed bezig met je bonus-euro-streak, ga zo door!',
      'Super dat je de vragenlijst al zo vaak achter elkaar hebt ingevuld, bedankt en ga zo door!',
      'Hoi {{deze_student}},\nVul de vragenlijst in en verdien opnieuw drie euro!'
    ];
  }

  firstResponsesMissedPool() {
    return [
      'Vergeten te starten {{deze_student}}? Geen probleem, dat kan als nog! Start met het helpen van andere jongeren en vul de vragenlijst in.'
    ];
  }

  missedLastPool() {
    return [
      'We hebben je gemist vorige week. Help je deze week weer mee?'
    ];
  }

  missedAfterStreakPool() {
    return [
      'Je was heel goed bezig met het onderzoek {{deze_student}}! Probeer je opnieuw de bonus-euro-streak te halen?'
    ];
  }

  missedMoreThanOnePool() {
    return [
      'Je hebt ons al enorm geholpen met de vragenlijsten die je hebt ingevuld {{deze_student}}. Wil je ons weer helpen?'
    ];
  }

  missedEverythingPool() {
    return [
      'Start met u-can-act en help jouw begeleiders en andere jongeren terwijl jij €2,- per drie minuten verdient!'
    ];
  }

  rejoinedAfterMissingOnePool() {
    return [
      'Na een weekje rust ben je er sinds de vorige week weer bij. Fijn dat je weer mee doet!'
    ];
  }

  rejoinedAfterMissingMultiplePool() {
    return [
      'Sinds vorige week ben je er weer bij. Super! Vul nog twee vragenlijsten in en jaag op de bonus euro\'s!'
    ];
  }

  announcementWeekTexts(response) {
    if (this.isPostAssessment(response)) {
      return '{{deze_student}}, wil jij jouw beloning ontvangen? Dit is de laatste' +
        ' kans om jouw IBAN in te vullen en alleen dan kunnen wij jou uitbetalen.' +
        ' Het zou zonde zijn om jouw gevulde u-can-act spaarpot niet te innen,' +
        ' toch?';
    }

    return 'Hoi {{deze_student}}, wil je je beloning ontvangen? Geef dan je IBAN' +
    ' nummer aan ons door. Alleen dan kunnen wij jouw beloning uitbetalen.' +
    ' Dit kan je doen door de laatste vragenlijst in te vullen.\n' +
    'Ps. Door aan te geven dat je inmiddels vakantie hebt, wordt de' +
    ' vragenlijst een stuk korter dan je gewend bent \uD83D\uDE00.';
  }

  repeatedFirstResponse_pool() {
    // Voormeting (repeated)
    return [
      'Hartelijk dank voor je inzet! Naast de wekelijkse vragenlijst sturen we je deze week ' +
      'ook nog even de allereerste vragenlijst (de voormeting), die had je nog niet ingevuld. ' +
      'Je beloning loopt gewoon door natuurlijk!'
    ];
  }
  firstResponsePool() {
    // Voormeting
    return [
      'Welkom bij de kick-off van het onderzoek \'u-can-act\'. Fijn dat je meedoet! ' +
      'Vandaag starten we met een aantal korte vragen, morgen begint de wekelijkse vragenlijst. ' +
      'Via de link kom je bij de vragen en een filmpje met meer info over u-can-act. Succes!'
    ];
  }

  secondResponsePool() {
    // Eerste wekelijkse vragenlijst
    return [
      'Vul jouw eerste wekelijkse vragenlijst in en verdien twee euro!'
    ];
  }

  rewardsThresholdPool(threshold) {
    switch (threshold) {
    case 1000: // 10 euro
      return [
        'Whoop! Na deze vragenlijst heb je €10,- verdiend. Ga zo door!'
      ];
    case 2000: // 20 euro
      return [
        'Je gaat hard {{deze_student}}! Na deze vragenlijst heb je al €20,- gespaard.'
      ];
    case 3000: // 30 euro
      return [
        'De teller blijft lopen! Na deze vragenlijst passeer jij de €30,- 😃'
      ];
    case 4000: // 40 euro
      return [
        'Hé {{deze_student}}. Door jouw goede inzet heb je bijna €40,- verdiend!'
      ];
    case 5000: // 50 euro
      return [
        'Geweldig, na deze vragenlijst heb je al €50,- verdiend!'
      ];
    case 6000: // 60 euro
      return [
        'Door jouw fantastische hulp heb jij al bijna €60,- verdiend!'
      ];
    case 7000: // 70 euro
      return [
        'Weet jij al wat je gaat doen met de €70,- die jij na deze vragenlijst hebt verdiend?'
      ];
    case 8000: // 80 euro
      return [
        'Wat heb jij je al ontzettend goed ingezet {{deze_student}}! Inmiddels heb je bijna €80,- verdiend.'
      ];
    default:
      return [];
    }
  }
}
