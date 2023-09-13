import { PaymentProps, EventType, PaymentData, Reducer, ReduxEvent } from "./types.d";

export const unityEventReducer: Reducer<PaymentProps, ReduxEvent<EventType, PaymentData>> = (state, action) => {
  switch (action.type) {
    case EventType.UNITY_PLAYER_PAY: {
      console.debug('UNITY_PLAYER_PAY', action);
      return { ...state, price: action.payload.price, message: action.payload.message };
    }
    case EventType.UNITY_PLAYER_AFTER_PAY: {
      console.debug('UNITY_PLAYER_AFTER_PAY', action);
      return { ...state, paymentSessionID: action.payload.sessionID, paymentStatus: action.payload.status };
    }
    default: {
      console.debug('Unknown action type received', action.type);
      return state;
    }
  }
}