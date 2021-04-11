import { Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { getBalance, getUser } from "../../redux/selectors";

function AccountBalance({ user, balance }) {
  return <Typography>Current balance: {balance}</Typography>;
}

const mapStateToProps = (state) => ({
  user: getUser(state),
  balance: getBalance(state),
});

export default connect(mapStateToProps)(AccountBalance);
