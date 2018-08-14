import InvitationTexts from './invitation-texts';

export default class MentorTexts extends InvitationTexts {
  message(response, protocolSubscription) {
    if (this.isAnnouncementWeek()) {
      return this.announcementWeekTexts(response);
    }
    return this.normalTexts(response, protocolSubscription);
  }

  announcementWeekTexts(response) {
    if (this.isPostAssessment(response)) {
      console.log('target still missing!');
      // @Ando: volgens mij klopt dit wel gewoon, met naam begeleider. Dit moeten we alleen
      // niet vergeten goed te testen.
      return 'Hoi {{deze_student}}, wij willen net als jij graag vsv voorkomen.' +
        ' Wil jij ons voor de laatste keer helpen en de laatste, maar cruciale,' +
        ' u-can-act vragenlijst invullen?';
    }
    return 'Hoi {{deze_student}}, de allerlaatste vragenlijsten' +
      ' staan voor je klaar. Voor ons is het ontzettend belangrijk dat deze' +
      ' wordt ingevuld. Help jij ons voor de laatste keer?\n' +
      'Ps. Door aan te geven dat je inmiddels vakantie hebt, wordt de' +
      ' vragenlijst een stuk korter dan je gewend bent \uD83D\uDE00.';
  }

  normalTexts(response, protocolSubscription) {
    if (this.openQuestionnaire(response, 'voormeting mentoren')) {
      return this.preAssessmentQuestionnaireTexts(protocolSubscription);
    }

    // voormeting is in different protsub
    const hasOneInvite = 1;
    // if (response.protocol_subscription.responses.invited.count === hasOneInvite) {
    if (protocolSubscription.invitations === hasOneInvite) {
      return this.wasInvitedMessage();
    }
    return this.defaultMessage();
  }

  wasInvitedMessage() {
    return 'Fijn dat je wilt helpen om inzicht te krijgen in de ontwikkeling van jongeren! ' +
      'Vul nu de eerste wekelijkse vragenlijst in.';
  }

  defaultMessage() {
    return 'Hoi {{deze_student}}, je wekelijkse vragenlijsten staan weer voor je klaar!';
  }

  preAssessmentQuestionnaireTexts(protocolSubscription) {
    if (this.completedSome(protocolSubscription)) {
      return 'Hartelijk dank voor je inzet! Naast de wekelijkse vragenlijst sturen we je deze ' +
        'week ook nog even de allereerste vragenlijst (de voormeting), die had je nog niet ' +
        'ingevuld. Na het invullen hiervan kom je weer bij de wekelijkse vragenlijst.';
    }
    return 'Welkom bij de kick-off van het onderzoek \'u-can-act\'. Vandaag staat ' +
      'informatie over het onderzoek en een korte voormeting voor je klaar. ' +
      'Morgen start de eerste wekelijkse vragenlijst. Succes!';
  }

  openQuestionnaire(response, questionnaireName) {
    return response.open_questionnaires.some((questionnaire) => {
      return questionnaire === questionnaireName;
    });
  }

  completedSome(protocolSubscription) {
    return protocolSubscription.protocol_completion.some((elem) => {
      return elem.completed;
    });
  }
}
