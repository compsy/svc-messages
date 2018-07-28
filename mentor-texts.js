import InvitationTexts from './invitation-texts';

export default class StudentTexts extends InvitationTexts {
  message(response, protocolSubscription) {
    if (this.inAnnouncementWeek()) {
      return this.announcementWeekTexts(response);
    }
    return this.normalTexts(response);
  }

  announcementWeekTexts(response) {
    if (this.postAssessment(response)) {
      console.log('target still missing!');
      return 'Hoi #{target_first_name(response)}, wij willen net als jij graag vsv voorkomen.' +
        ' Wil jij ons voor de laatste keer helpen en de laatste, maar cruciale,' +
        ' u-can-act vragenlijst invullen?';
    }
    return 'Hoi #{target_first_name(response)}, de allerlaatste vragenlijsten' +
      ' staan voor je klaar. Voor ons is het ontzettend belangrijk dat deze' +
      ' wordt ingevuld. Help jij ons voor de laatste keer?\n' +
      'Ps. Door aan te geven dat je inmiddels vakantie hebt, wordt de' +
      ' vragenlijst een stuk korter dan je gewend bent .';
  }

  normalTexts(response) {
    if (this.openQuestionnaire(response, 'voormeting mentoren')) {
      return this.preAssessmentQuestionnaireTexts(response);
    }

    // voormeting is in different protsub
    if (response.protocol_subscription.responses.invited.count === 1) {
      return this.wasInvitedMessage();
    }
    return this.defaultMessage(response);
  }

  wasInvitedMessage() {
    return 'Fijn dat je wilt helpen om inzicht te krijgen in de ontwikkeling van jongeren! ' +
      'Vul nu de eerste wekelijkse vragenlijst in.';
  }

  defaultMessage(response) {
    return 'Hoi #{target_first_name(response)}, je wekelijkse vragenlijsten staan weer voor je klaar!';
  }

  preAssessmentQuestionnaireTexts(response) {
    if (this.completedSome(response)) {
      return 'Hartelijk dank voor je inzet! Naast de wekelijkse vragenlijst sturen we je deze ' +
        'week ook nog even de allereerste vragenlijst (de voormeting), die had je nog niet ' +
        'ingevuld. Na het invullen hiervan kom je weer bij de wekelijkse vragenlijst.';
    }
    return 'Welkom bij de kick-off van het onderzoek \'u-can-act\'. Vandaag staat ' +
      'informatie over het onderzoek en een korte voormeting voor je klaar. ' +
      'Morgen start de eerste wekelijkse vragenlijst. Succes!';
  }

  openQuestionnaire(response, questionnaireName) {
    return this.getPerson(response).openQuestionnaire(questionnaireName);
  }

  completedSome(response) {
    const positive = 1;
    return this.getPerson(response).responses.completed.count >= positive;
  }

  targetFirstName(response) {
    return response.protocolSubscription.person.firstName;
  }

  getPerson(response) {
    return response.protocolSubscription.person;
  }
}
