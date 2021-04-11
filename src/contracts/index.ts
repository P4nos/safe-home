const insurancePool = require("../contracts/abi/InsurancePool.json").abi;
const claimInsurance = require("../contracts/abi/ClaimInsurance.json").abi;

const addresses = {
  INSURANCE_POOL_ADDRESS: process.env.REACT_APP_INSURANCE_POOL_ADDRESS ?? "",
  CLAIM_INSURANCE_ADDRESS: process.env.REACT_APP_CLAIM_INSURANCE_ADDRESS ?? "",
};

export default {
  insurancePool,
  claimInsurance,
  addresses,
};
