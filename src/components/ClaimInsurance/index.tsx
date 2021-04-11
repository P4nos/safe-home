import {
  Button,
  IconButton,
  Grid,
  makeStyles,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { connectToMinut, getAccessTokens } from "../../redux/actions";
import {
  getMinutAccountConnected,
  getMinutAccountConnecting,
  getMinutAccountError,
} from "../../redux/selectors";
import { MinutLogo } from "../../assets/MinutLogo";
import moment from "moment";
import { useEffect } from "react";
import { getAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract, utils } from "ethers";
import contracts from "../../contracts";
import { ProgressButton } from "../ProgressButton";
import { useHistory } from "react-router-dom";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const minutClaims = [
  { name: "Break in", value: "silence_alarm" },
  { name: "Fire damage", value: "temperature_rapid_rise" },
  { name: "Heating malfunction", value: "almost_freezing" },
  { name: "Water leak", value: "risk_of_mould" },
];

const dateRanges = [
  { name: "Today", value: "today" },
  { name: "Yesterday", value: "yesterday" },
  { name: "1 week ago", value: "week" },
  { name: "1 month ago", value: "month" },
];

function createDateRange(endDateString: string): [string, string] {
  const dateEnd = moment();
  let dateStart: moment.Moment;

  switch (endDateString) {
    case "today":
      dateStart = moment().startOf("day");
      break;
    case "yesterday":
      dateStart = moment().subtract(1, "day");
      break;
    case "week":
      dateStart = moment().subtract(1, "week");
      break;
    case "month":
      dateStart = moment().subtract(1, "month");
      break;
    default:
      dateStart = moment().startOf("day");
  }

  return [dateStart.toISOString(), dateEnd.toISOString()];
}

export function ClaimInsurance({ connectToMinut, connectedMinut }) {
  const classes = useStyles();

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [minutClaim, setMinutClaim] = useState("");
  const [endDate, setEndDate] = useState("");
  const [blockRequest, setBlockRequest] = useState(true);
  const [eventFound, setEventFound] = useState(false);
  const [eventTime, setEventTime] = useState("");
  const { account, library } = useWeb3React<Web3Provider>();
  const [estimatedClaim, setEstimatedClaim] = useState("0");
  const [pendingEventRequest, setPendingEventRequest] = useState(false);
  const [pendingClaimRequest, setClaimEventRequest] = useState(false);

  let signer = account
    ? library?.getSigner(account).connectUnchecked()
    : library;

  const contract = new Contract(
    contracts.addresses.CLAIM_INSURANCE_ADDRESS,
    contracts.claimInsurance,
    signer
  );

  const insurancePoolContract = new Contract(
    contracts.addresses.INSURANCE_POOL_ADDRESS,
    contracts.insurancePool,
    signer
  );

  useLayoutEffect(() => {
    connectToMinut();
  }, [connectToMinut]);

  useEffect(() => {
    shouldBlockRequest();
  }, [minutClaim, endDate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceed = async (event: any) => {
    connectToMinut(username, password);
    setOpen(false);
    setUsername("");
    setPassword("");
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const shouldBlockRequest = () => {
    if (endDate.length > 0 && minutClaim.length > 0) {
      setBlockRequest(false);
    } else {
      setBlockRequest(true);
    }
  };

  const handleSelectDate = (event) => {
    setEndDate(event.target.value);
  };

  const handleSelectClaim = (event) => {
    setMinutClaim(event.target.value as string);
  };

  const handleClaim = async (event) => {
    try {
      setClaimEventRequest(true);

      insurancePoolContract.once("Claim", () => {
        setClaimEventRequest(false);
        // Redirect back to home
        history.push("/");
      });

      await insurancePoolContract.makeClaim(
        utils.parseUnits(estimatedClaim).toString()
      );
    } catch (error) {
      setClaimEventRequest(false);

      console.log(error);
    }
  };

  const fetchEventMinutEvents = async (e) => {
    e.preventDefault();

    if (!getAddress(account as string)) {
      throw Error("not valid address");
    }

    const [startDateISO, endDateISO] = createDateRange(endDate);
    const { minutAccessToken } = getAccessTokens();

    const urlParams = `limit=1&${encodeURIComponent(
      "start_at=" + startDateISO + "&end_at=" + endDateISO
    )}&access_token=${minutAccessToken}&order=desc`;

    contract.once("ReceivedEvent", async (requestId, createdAt) => {
      try {
        setPendingEventRequest(false);
        const isoDate = utils.parseBytes32String(createdAt);
        setEventTime(new Date(isoDate).toLocaleString());
        const estimatedClaim = await insurancePoolContract.estimateClaimAmount(
          account
        );

        setEventFound(true);
        setEstimatedClaim(utils.formatEther(estimatedClaim));
      } catch (error) {
        console.log(error);
      }
    });

    try {
      setPendingEventRequest(true);
      await contract.requestEventFromProvider(urlParams);
    } catch (error) {
      setPendingEventRequest(false);
      console.log(error);
    }
  };
  return (
    <div className={classes.layout}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <Typography variant="h6">Select Integration</Typography>
            <IconButton onClick={handleClickOpen} color="secondary">
              <MinutLogo width="90" height="90" />
            </IconButton>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Login to your Minut account
              </DialogTitle>
              <DialogContent>
                <TextField
                  onChange={handleUsernameChange}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Username"
                  type="email"
                  fullWidth
                  color="secondary"
                />
                <TextField
                  onChange={handlePasswordChange}
                  margin="dense"
                  id="name"
                  label="Password"
                  type="password"
                  fullWidth
                  color="secondary"
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceed}
                  color="secondary"
                  variant="contained"
                >
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Paper>
      {/* move to separate component */}
      {connectedMinut ? (
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Typography variant="h6">
                Select the incident you want to make a claim
              </Typography>
              <form onSubmit={fetchEventMinutEvents}>
                <Grid item sm={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Event</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={minutClaim}
                      onChange={handleSelectClaim}
                    >
                      <MenuItem value={minutClaims[0].value}>
                        {minutClaims[0].name}
                      </MenuItem>
                      <MenuItem value={minutClaims[1].value}>
                        {minutClaims[1].name}
                      </MenuItem>
                      <MenuItem value={minutClaims[2].value}>
                        {minutClaims[2].name}
                      </MenuItem>
                      <MenuItem value={minutClaims[3].value}>
                        {minutClaims[3].name}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Occurence
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={endDate}
                      onChange={handleSelectDate}
                    >
                      <MenuItem value={dateRanges[0].value}>
                        {dateRanges[0].name}
                      </MenuItem>
                      <MenuItem value={dateRanges[1].value}>
                        {dateRanges[1].name}
                      </MenuItem>
                      <MenuItem value={dateRanges[2].value}>
                        {dateRanges[2].name}
                      </MenuItem>
                      <MenuItem value={dateRanges[3].value}>
                        {dateRanges[3].name}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid container justify="flex-end">
                  <Grid item sm={3}>
                    <ProgressButton
                      type="submit"
                      pending={pendingEventRequest}
                      disabled={blockRequest}
                    >
                      Check
                    </ProgressButton>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
      {connectedMinut && eventFound ? (
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Typography variant="h6">
                Found a matching event for the incident
              </Typography>
            </Grid>
            <Grid item sm={6}>
              {minutClaims.filter((c) => c.value === minutClaim)?.[0]?.name}
            </Grid>
            <Grid item sm={6}>
              {eventTime}
            </Grid>
            <Grid item sm={12}>
              Your estimated claim amount is {estimatedClaim}
            </Grid>
            <Grid container justify="flex-end">
              <Grid item sm={3}>
                <ProgressButton
                  type="submit"
                  pending={pendingClaimRequest}
                  onClick={handleClaim}
                >
                  Accept
                </ProgressButton>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  connectingMinut: getMinutAccountConnecting(state),
  connectedMinut: getMinutAccountConnected(state),
  error: getMinutAccountError(state),
});

const mapDispatchToProps = {
  connectToMinut,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimInsurance);
