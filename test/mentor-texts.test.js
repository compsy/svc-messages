import MentorTexts from '../src/mentor-texts';
describe('MentorTexts', () => {
  const subject = new MentorTexts();
  describe('in announcement week', () => {

    // it 'should send the correct message if the response ois a post_assessment' do
    // response = FactoryBot.create(:response, protocol_subscription: protocol_subscription,
    // completed_at: nil,
    // measurement: measurement3,
    // open_from: 1.minute.ago)
    // expected = 'Hoi Jane, wij willen net als jij graag vsv voorkomen.' +
    // ' Wil jij ons voor de laatste keer helpen en de laatste, maar cruciale, u-can-act vragenlijst invullen?'
    // result = described_class.message(response)
    // expect(result).to eq(expected)
    // )};

    // it 'should send the correct message if the response is not a post_assessment' do
    // response = FactoryBot.create(:response, protocol_subscription: protocol_subscription,
    // completed_at: nil,
    // measurement: measurement1,
    // open_from: 1.minute.ago)
    // expected = 'Hoi Jane, de allerlaatste vragenlijsten staan voor je klaar. Voor ons is het ontzettend belangrijk' +
    // " dat deze wordt ingevuld. Help jij ons voor de laatste keer?\n"+
    // 'Ps. Door aan te geven dat je inmiddels vakantie hebt, wordt de'+
    // ' vragenlijst een stuk korter dan je gewend bent .'
    // result = described_class.message(response)
    // expect(result).to eq(expected)
    // )};
  });

  describe('not in announcement week', () => {
    test('should return the correct text when there are open voormeting questionnaires and completed some', () => {
      const response = {
        questionnaire_name: 'nameting',
        open_questionnaires: [ 'voormeting mentoren' ]
      };
      const protocolSubscription = {
        invitations: 2,
        protocol: {
          name: 'Name of the protocol',
          current_reward: 100,
          maximum_reward: 2000,
          streak_threshold: 3
        },
        protocol_completion: [ {
          completed: true,
          periodical: false,
          reward_points: 0,
          future: false,
          streak: -1,
          future_or_current: true
        } ]
      };
      let result = subject.message(response, protocolSubscription);
      expect(result).toEqual('Hartelijk dank voor je inzet! Naast de wekelijkse vragenlijst sturen we je deze ' +
        'week ook nog even de allereerste vragenlijst (de voormeting), die had je nog niet ' +
        'ingevuld. Na het invullen hiervan kom je weer bij de wekelijkse vragenlijst.');
    });

    test('should return the correct text when there are open voormeting questionnaires and not completed some', () => {
      const response = {
        questionnaire_name: 'nameting',
        open_questionnaires: [ 'voormeting mentoren' ]
      };
      const protocolSubscription = {
        invitations: 2,
        protocol: {
          name: 'Name of the protocol',
          current_reward: 100,
          maximum_reward: 2000,
          streak_threshold: 3
        },
        protocol_completion: [ {
          completed: false,
          periodical: false,
          reward_points: 0,
          future: false,
          streak: -1,
          future_or_current: true
        } ]
      };
      let result = subject.message(response, protocolSubscription);
      expect(result).toEqual('Welkom bij de kick-off van het onderzoek \'u-can-act\'. Vandaag staat ' +
        'informatie over het onderzoek en een korte voormeting voor je klaar. ' +
        'Morgen start de eerste wekelijkse vragenlijst. Succes!');
    });

    test('should return the correct text when the the voormeting is in a different protocol subscription', () => {
      const response = {
        questionnaire_name: 'nameting',
        open_questionnaires: []
      };
      const protocolSubscription = {
        invitations: 1,
        protocol: {
          name: 'Name of the protocol',
          current_reward: 100,
          maximum_reward: 2000,
          streak_threshold: 3
        },
        protocol_completion: [ {
          completed: false,
          periodical: false,
          reward_points: 0,
          future: false,
          streak: -1,
          future_or_current: true
        } ]
      };
      let result = subject.message(response, protocolSubscription);
      expect(result).toEqual('Fijn dat je wilt helpen om inzicht te krijgen in de ontwikkeling van jongeren! ' +
        'Vul nu de eerste wekelijkse vragenlijst in.');
    });

    test('should return the default text otherwise', () => {
      const response = {
        questionnaire_name: 'nameting',
        open_questionnaires: []
      };
      const protocolSubscription = {
        invitations: 2,
        protocol: {
          name: 'Name of the protocol',
          current_reward: 100,
          maximum_reward: 2000,
          streak_threshold: 3
        },
        protocol_completion: [ {
          completed: true,
          periodical: false,
          reward_points: 0,
          future: false,
          streak: -1,
          future_or_current: true
        } ]
      };
      let result = subject.message(response, protocolSubscription);
      expect(result).toEqual('Hoi {{deze_student}}, je wekelijkse vragenlijsten staan weer voor je klaar!');
    });
  });
});
