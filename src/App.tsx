import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";
import Web3ConnectionManager from "./components/Web3ConnectionManager/Web3ConnectionManager";
import { AppLayout } from "./components/AppLayout";
import { StyledNavLink } from "./views/Button";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ClaimInsurance from "./components/ClaimInsurance";
import CreateInsurance from "./components/CreateInsurance";
import UpdateInsurance from "./components/UpdateInsurance";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { userHasInsurance } from "./redux/selectors";

function getLibrary(provider: any, connector: any) {
  return new providers.Web3Provider(provider, "any"); // this will vary according to whether you use e.g. ethers or web3.js
}

function App({ hasInsurance }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ConnectionManager>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <AppLayout>
                <Grid container justify="center" spacing={2}>
                  <Grid item>
                    {hasInsurance ? (
                      <StyledNavLink to="/update">
                        Update Insurance
                      </StyledNavLink>
                    ) : (
                      <StyledNavLink to="/create">
                        Create Insurance
                      </StyledNavLink>
                    )}
                  </Grid>
                  <Grid item>
                    <StyledNavLink to="/claim">Claim Insurance</StyledNavLink>
                  </Grid>
                </Grid>
              </AppLayout>
            </Route>

            <Route path="/create">
              <AppLayout>
                <CreateInsurance />
              </AppLayout>
            </Route>

            <Route path="/claim">
              <AppLayout>
                <ClaimInsurance />
              </AppLayout>
            </Route>

            <Route path="/update">
              <AppLayout>
                <UpdateInsurance />
              </AppLayout>
            </Route>
          </Switch>
        </BrowserRouter>
      </Web3ConnectionManager>
    </Web3ReactProvider>
  );
}

const mapStateToProps = (state) => ({
  hasInsurance: userHasInsurance(state),
});
export default connect(mapStateToProps)(App);
