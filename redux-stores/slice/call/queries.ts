const Queries = {
  requestForCallInput: `mutation RequestForCall($requestForCallInput: RequestForCallInput!) {
    requestForCall(requestForCallInput: $requestForCallInput) {
      data
      message
    }
  }
  `,
  incomingCallAnswer: `mutation IncomingCallAnswer($incomingCallAnswer: IncomingCallAnswerInput!) {
    incomingCallAnswer(incomingCallAnswer: $incomingCallAnswer) {
      data
      message
    }
  }`,
  
}

export const callQueries = Object.freeze(Queries)