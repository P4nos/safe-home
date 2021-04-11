import { Box } from "@material-ui/core";
import React from "react";
import logo from "../images/home_safe_logo.png";

function HomeSafeLogo() {
  return (
    <Box>
      <img src={logo} alt="" height="90" />
    </Box>
  );
}

export default HomeSafeLogo;
