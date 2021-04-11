import React from "react";
import styled from "styled-components";
import ConnectButton from "../ConnectButton";
import AccountBalance from "../AccountBalance";
import HomeSafeLogo from "../../assets/HomeSafeLogo";

const MainView = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  justify-content: space-between;
`;

const WalletContainer = styled.div`
  display: flex;
  direction: row;
  align-items: center;
`;
export function AppLayout({ children }) {
  return (
    <MainView>
      <Header>
        <HomeSafeLogo />
        <WalletContainer>
          <AccountBalance />
          <ConnectButton />
        </WalletContainer>
      </Header>
      <Container>{children}</Container>
    </MainView>
  );
}
