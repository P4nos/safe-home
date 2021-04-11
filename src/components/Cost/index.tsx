import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { EthereumLogo } from "../../assets/EthereumLogo";

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  padding: 5px;
`;

const LogoContainer = styled.div`
  padding: 5px;
`;
export function Cost({ costValue }: { costValue: string }) {
  return (
    <Grid container alignItems="center">
      <TextContainer>
        <span style={{ flex: 1 }}></span>
        <Typography component="h2" variant="h3">
          {costValue}
        </Typography>
      </TextContainer>
      <LogoContainer>
        <EthereumLogo width="50" height="50" />
      </LogoContainer>
    </Grid>
  );
}
