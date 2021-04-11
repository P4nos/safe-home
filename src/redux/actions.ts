import {
  CONNECT_MINUT_ACCOUNT_FAILURE,
  CONNECT_MINUT_ACCOUNT_REQUEST,
  CONNECT_MINUT_ACCOUNT_SUCCESS,
  CREATE_INSURANCE_FAILURE,
  CREATE_INSURANCE_REQUEST,
  CREATE_INSURANCE_SUCCESS,
  FETCH_INSURANCE_FAILURE,
  FETCH_INSURANCE_REQUEST,
  FETCH_INSURANCE_SUCCESS,
  NEW_USER_CONNECTED,
  UPDATE_INSURANCE_FAILURE,
  UPDATE_INSURANCE_REQUEST,
  UPDATE_INSURANCE_SUCCESS,
  WALLET_CONNECTED,
  WALLET_DISCONNECTED,
} from "./actionTypes";
import axios from "axios";
import { Contract } from "ethers";
import contracts from "../contracts";
export const connectMinutAccountRequest = () => ({
  type: CONNECT_MINUT_ACCOUNT_REQUEST,
});

export const connectMinutAccountSuccess = () => ({
  type: CONNECT_MINUT_ACCOUNT_SUCCESS,
});

export const connectMinutAccountFailure = (payload) => ({
  type: CONNECT_MINUT_ACCOUNT_FAILURE,
  payload,
});

export const walletConnected = (payload) => ({
  type: WALLET_CONNECTED,
  payload,
});

export const walletDisconnected = () => ({
  type: WALLET_DISCONNECTED,
});

export const createInsuranceSuccess = () => ({
  type: CREATE_INSURANCE_SUCCESS,
});

export const createInsuranceRequest = () => ({
  type: CREATE_INSURANCE_REQUEST,
});

export const createInsuranceFailure = (payload) => ({
  type: CREATE_INSURANCE_FAILURE,
  payload,
});

export const updateInsuranceSuccess = () => ({
  type: UPDATE_INSURANCE_SUCCESS,
});

export const updateInsuranceRequest = () => ({
  type: UPDATE_INSURANCE_REQUEST,
});

export const updateInsuranceFailure = (payload) => ({
  type: UPDATE_INSURANCE_FAILURE,
  payload,
});

export const fetchInsuranceRequest = () => ({
  type: FETCH_INSURANCE_REQUEST,
});

export const fetchInsuranceSucess = (payload) => ({
  type: FETCH_INSURANCE_SUCCESS,
  payload,
});

export const fetchInsuranceFailure = (payload) => ({
  type: FETCH_INSURANCE_FAILURE,
  payload,
});

export const newUser = (payload) => ({
  type: NEW_USER_CONNECTED,
  payload,
});

export const fetchInsurance = (userAddress, signer) => async (dispatch) => {
  // fetch account balance
  const contract = new Contract(
    contracts.addresses.INSURANCE_POOL_ADDRESS,
    contracts.insurancePool,
    signer
  );

  dispatch(fetchInsuranceRequest());
  try {
    const res = await contract.getInsuranceInformation(userAddress);
    // convert to number format
    const formattedRes = res.map((v) => Number(v));
    dispatch(fetchInsuranceSucess(formattedRes));

    return res;
  } catch (error) {
    dispatch(fetchInsuranceFailure(error));
    return null;
  }
};

const storeAccessTokens = (accessToken, refreshToken) => {
  localStorage.setItem("minutAccessToken", accessToken);
  localStorage.setItem("minutRefreshToken", refreshToken);
};

export const getAccessTokens = () => {
  return {
    minutAccessToken: localStorage.getItem("minutAccessToken"),
    minutRefreshToken: localStorage.getItem("minutRefreshToken"),
  };
};

const clearAccessTokens = () => {
  localStorage.removeItem("minutAccessToken");
  localStorage.removeItem("minutRefreshToken");
};

export const connectToMinut = (username, password) => async (dispatch) => {
  const { minutAccessToken, minutRefreshToken } = getAccessTokens();
  const isSignInAttempt = username && password;
  if (minutAccessToken && minutRefreshToken && !isSignInAttempt) {
    dispatch(connectMinutAccountSuccess());
    return;
  }
  // check if we have a token already
  dispatch(connectMinutAccountRequest());

  try {
    const response = await axios.post(
      "https://api.staging.minut.com/v5/oauth/token",
      {
        username,
        password,
        client_id: process.env.REACT_APP_MINUT_CLIENT_ID,
        client_secret: process.env.REACT_APP_MINUT_CLIENT_SECRET,
        grant_type: "password",
      }
    );
    const { data } = response;
    storeAccessTokens(data.access_token, data.refresh_token);
    dispatch(connectMinutAccountSuccess());
    return;
  } catch (error) {
    // Handle refresh token exchange
    if (error.response && error.response.status === 401) {
      dispatch(connectMinutAccountRequest());

      try {
        const response = await axios.post(
          "https://api.staging.minut.com/v5/oauth/token",
          {
            client_id: process.env.REACT_APP_MINUT_CLIENT_ID,
            client_secret: process.env.REACT_APP_MINUT_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: minutRefreshToken,
          }
        );
        const { data } = response;
        storeAccessTokens(data.access_token, data.refresh_token);
      } catch (error) {
        dispatch(connectMinutAccountFailure(error));
        return;
      }
    }
    dispatch(connectMinutAccountFailure(error));
  }
};

const clearCurrentUserData = () => {
  clearAccessTokens();
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
  return localStorage.getItem("currentUser");
};

export const userUpdated = (userAddress: string) => (dispatch) => {
  clearCurrentUserData();
  localStorage.setItem("currentUser", userAddress);
  dispatch(newUser(userAddress));
};
