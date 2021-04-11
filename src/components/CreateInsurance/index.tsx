import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { Grid, makeStyles, Paper, Radio, Typography } from "@material-ui/core";
import { Cost } from "../Cost";
import { ethers } from "ethers";
import contracts from "../../contracts";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  createInsuranceFailure,
  createInsuranceRequest,
  createInsuranceSuccess,
  fetchInsurance,
} from "../../redux/actions";
import { ProgressButton } from "../ProgressButton";
import { ethDecimals } from "../../common/util";

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
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));
const CreateInsurance = () => {
  const classes = useStyles();
  const { account, library } = useWeb3React<Web3Provider>();
  const [selection, setSelection] = useState("standard" as string);
  const [processingRequest, setProcessingRequest] = useState(false);

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
  // Get signer in order to send ether.
  async function createNewCustomer() {
    if (!getAddress(account as string)) {
      throw Error("not valid address");
    }
    const encodedFunctionCall = contract.interface.encodeFunctionData(
      contract.interface.getFunction("createNewCustomer"),
      [account, InsurancePlans[selection].type]
    );

    setProcessingRequest(true);
    dispatch(createInsuranceRequest());
    try {
      const txt = await signer?.sendTransaction({
        to: contracts.addresses.INSURANCE_POOL_ADDRESS,
        value: ethers.utils.parseUnits(
          InsurancePlans[selection].price,
          ethDecimals
        ),
        data: encodedFunctionCall,
      } as any);

      txt?.wait().then(() => {
        dispatch(createInsuranceSuccess());
        dispatch(fetchInsurance(account, signer));
        setProcessingRequest(false);

        // Redirect back to home
        history.push("/");
      });
    } catch (error) {
      console.log(error);
      setProcessingRequest(false);
      dispatch(createInsuranceFailure(error));
    }
  }

  const InsurancePlans: { [key: string]: { type: string; price: string } } = {
    standard: { type: "0", price: "0.02" },
    extended: { type: "1", price: "0.04" },
  };

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelection(event.target.value);
  };

  return (
    <div className={classes.layout}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <Typography variant="h6">Select Insurance model</Typography>
          </Grid>
          <Grid
            item
            spacing={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Grid item spacing={3}>
              <Radio
                value="standard"
                checked={selection === "standard"}
                onChange={handleSelection}
              />
              Standard
            </Grid>
            <Grid item spacing={3}>
              <Radio
                value="extended"
                checked={selection === "extended"}
                onChange={handleSelection}
              />
              Extended
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Cost costValue={InsurancePlans[selection].price} />
          </Grid>
          <Grid item sm={12} className={classes.buttonContainer}>
            <ProgressButton
              type="submit"
              pending={processingRequest}
              onClick={createNewCustomer}
            >
              Accept
            </ProgressButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CreateInsurance;
