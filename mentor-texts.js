import InvitationTexts from './invitation-texts';

export default class StudentTexts extends InvitationTexts {
  message(response, protocolSubscription) {
    return 'no messages yet';
  }
}
