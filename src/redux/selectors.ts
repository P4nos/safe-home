import { utils } from "ethers";

export const getMinutAccessToken = (state) =>
  state.account.minutAccessToken?.access_token;
export const getUser = (state) => state.account.user;
export const getBalance = (state) =>
  state.account.insuranceInfo?.[1]
    ? utils.formatEther(state.account.insuranceInfo?.[1].toString())
    : 0;
export const getMinutAccountError = (state) => state.account.error;
export const getMinutAccountConnecting = (state) =>
  state.account.connectingMinutAccount;
export const getMinutAccountConnected = (state) =>
  state.account.connectedMinutAccount;
export const getInsuranceInfo = (state) => {
  return {
    insuranceType: state.account.insuranceInfo?.[0],
    balance: state.account.insuranceInfo?.[1]
      ? utils.formatEther(state.account.insuranceInfo?.[1].toString())
      : 0,
    claims: Number(state.account.insuranceInfo?.[2]),
    createdAt: Number(state.account.insuranceInfo?.[3]),
    lastUpdatedAt: Number(state.account.insuranceInfo?.[4]),
  };
};
export const getWalletConnected = (state) => state.account.walletConnected;
export const userHasInsurance = (state) => {
  return Number(
    state.account.insuranceInfo?.[1]
      ? utils.formatEther(state.account.insuranceInfo?.[1].toString())
      : 0
  ) > 0
    ? true
    : false;
};
export const createdInsurance = (state) => state.account.createdInsurance;
export const updatingInsurance = (state) => state.account.updatingInsurance;
