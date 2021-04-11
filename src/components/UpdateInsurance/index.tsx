import React, { useState, useEffect } from "react";
import { Grid, makeStyles, Paper, Typography, Input } from "@material-ui/core";
import { isNil } from "lodash";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInsurance,
  updateInsuranceFailure,
  updateInsuranceRequest,
  updateInsuranceSuccess,
} from "../../redux/actions";
import { utils } from "ethers";
import contracts from "../../contracts";
import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethDecimals } from "../../common/util";
import { getBalance } from "../../redux/selectors";
import { ProgressButton } from "../ProgressButton";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

function UpdateInsurance() {
  const currentBalance = useSelector(getBalance);
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [processingRequest, setProcessingRequest] = useState(false);
  const [disableSubmission, setDisableSubmission] = useState(true);
  const { account, library } = useWeb3React<Web3Provider>();

  const dispatch = useDispatch();
  const history = useHistory();

  let signer = account
    ? library?.getSigner(account).connectUnchecked()
    : library;

  const contract = new Contract(
    contracts.addresses.INSURANCE_POOL_ADDRESS,
    contracts.insurancePool,
    signer
  );

  useEffect(() => {
    if (!isNil(inputValue) && Number(inputValue) > 0) {
      setDisableSubmission(false);
    } else {
      setDisableSubmission(true);
    }
  }, [inputValue]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!getAddress(account as string)) {
      throw Error("not valid address");
    }

    const encodedFunctionCall = contract.interface.encodeFunctionData(
      contract.interface.getFunction("depositToInsurance"),
      [account]
    );

    setProcessingRequest(true);
    dispatch(updateInsuranceRequest());
    try {
      await signer?.sendTransaction({
        to: contracts.addresses.INSURANCE_POOL_ADDRESS,
        value: utils.parseUnits(inputValue, ethDecimals),
        data: encodedFunctionCall,
      } as any);

      contract.once("Received", () => {
        dispatch(updateInsuranceSuccess());
        dispatch(fetchInsurance(account, signer));
        setProcessingRequest(false);

        // Redirect back to home
        history.push("/");
      });
    } catch (error) {
      console.log(error);
      setProcessingRequest(false);
      dispatch(updateInsuranceFailure(error));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Typography variant="h6">Add funds</Typography>
            </Grid>
            <Grid item sm={6}>
              <Input
                required
                onChange={(e) => setInputValue(e.target.value)}
              ></Input>
            </Grid>
            <Grid item sm={12}>
              <Grid container className={classes.buttonContainer}>
                <Typography>Current balance: {currentBalance}</Typography>
                <ProgressButton
                  type="submit"
                  disabled={disableSubmission}
                  pending={processingRequest}
                >
                  Accept
                </ProgressButton>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </form>
  );
}

export default UpdateInsurance;
