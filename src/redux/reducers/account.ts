/* eslint-disable import/no-anonymous-default-export */
import {
  WALLET_CONNECTED,
  WALLET_DISCONNECTED,
  CLAIM_INSURANCE_FAILURE,
  CLAIM_INSURANCE_REQUEST,
  CLAIM_INSURANCE_SUCCESS,
  CONNECT_MINUT_ACCOUNT_FAILURE,
  CONNECT_MINUT_ACCOUNT_REQUEST,
  CONNECT_MINUT_ACCOUNT_SUCCESS,
  CREATE_INSURANCE_FAILURE,
  CREATE_INSURANCE_REQUEST,
  CREATE_INSURANCE_SUCCESS,
  FETCH_INSURANCE_REQUEST,
  FETCH_INSURANCE_FAILURE,
  FETCH_INSURANCE_SUCCESS,
  NEW_USER_CONNECTED,
  UPDATE_INSURANCE_REQUEST,
  UPDATE_INSURANCE_SUCCESS,
  UPDATE_INSURANCE_FAILURE,
} from "../actionTypes";

const intialState = {
  walletConnected: false,
  creatingInsurance: false,
  createdInsurance: false,
  updatingInsurance: false,
  updatedInsurance: false,
  claimingInsurance: false,
  claimedInsurance: false,
  connectingMinutAccount: false,
  connectedMinutAccount: false,
  user: null,
  fetchingInsurance: false,
  fetchedInsurance: false,
  insuranceInfo: null,
  error: null,
};

export default (state = intialState, action) => {
  switch (action.type) {
    case WALLET_CONNECTED: {
      return {
        ...state,
        walletConnected: action.payload,
      };
    }
    case WALLET_DISCONNECTED: {
      return {
        ...state,
        walletConnected: false,
        user: null,
        insuranceInfo: null,
      };
    }
    case CREATE_INSURANCE_REQUEST: {
      return {
        ...state,
        creatingInsurance: true,
        createdInsurance: false,
      };
    }
    case CREATE_INSURANCE_SUCCESS: {
      return {
        ...state,
        creatingInsurance: false,
        createdInsurance: true,
      };
    }
    case CREATE_INSURANCE_FAILURE: {
      return {
        ...state,
        creatingInsurance: false,
        createdInsurance: false,
      };
    }
    case UPDATE_INSURANCE_REQUEST: {
      return {
        ...state,
        updatingInsurance: true,
        updatedInsurance: false,
      };
    }
    case UPDATE_INSURANCE_SUCCESS: {
      return {
        ...state,
        updatingInsurance: false,
        updatedInsurance: true,
        error: null,
      };
    }
    case UPDATE_INSURANCE_FAILURE: {
      return {
        ...state,
        updatingInsurance: false,
        updatedInsurance: false,
        error: action.payload,
      };
    }
    case CLAIM_INSURANCE_REQUEST: {
      return {
        ...state,
        claimingInsurance: true,
        claimedInsurance: false,
      };
    }
    case CLAIM_INSURANCE_SUCCESS: {
      return {
        ...state,
        claimingInsurance: false,
        claimedInsurance: true,
        error: null,
      };
    }
    case CLAIM_INSURANCE_FAILURE: {
      return {
        ...state,
        claimingInsurance: false,
        claimedInsurance: false,
      };
    }
    case CONNECT_MINUT_ACCOUNT_REQUEST: {
      return {
        ...state,
        connectingMinutAccount: true,
        connectedMinutAccount: false,
      };
    }
    case CONNECT_MINUT_ACCOUNT_SUCCESS: {
      return {
        ...state,
        connectingMinutAccount: false,
        connectedMinutAccount: true,
      };
    }
    case CONNECT_MINUT_ACCOUNT_FAILURE: {
      return {
        ...state,
        connectingMinutAccount: false,
        connectedMinutAccount: false,
        error: action.payload,
      };
    }

    case FETCH_INSURANCE_REQUEST: {
      return {
        ...state,
        fetchingInsurance: true,
        fetchedInsurance: false,
      };
    }
    case FETCH_INSURANCE_SUCCESS: {
      return {
        ...state,
        fetchingInsurance: false,
        fetchedInsurance: true,
        insuranceInfo: action.payload,
      };
    }
    case FETCH_INSURANCE_FAILURE: {
      return {
        ...state,
        fetchingInsurance: false,
        fetchedInsurance: false,
        insuranceInfo: null,
        error: action.payload,
      };
    }
    case NEW_USER_CONNECTED: {
      return {
        ...state,
        user: action.payload,
        insuranceInfo: null,
        fetchingInsurance: false,
        fetchedInsurance: false,
        connectingMinutAccount: false,
        connectedMinutAccount: false,
      };
    }

    default:
      return state;
  }
};
