import { useWeb3React } from "@web3-react/core";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { injected } from "../../common/connectors";
import { squashAccountName } from "../../common/util";
import {
  userUpdated,
  walletConnected,
  fetchInsurance,
  getCurrentUser,
} from "../../redux/actions";
import { getUser } from "../../redux/selectors";
import { ButtonBase } from "../../views/Button";

function ConnectButton({ fetchInsurance }) {
  const defaultText = "Connect with MetaMask";
  const { activate, account, active, library } = useWeb3React();
  const [buttonText, setButtonText] = useState(defaultText);
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();

  let signer = account
    ? library?.getSigner(account).connectUnchecked()
    : library;

  useEffect(() => {
    if (!isNil(account)) {
      setButtonText(squashAccountName(account));
      if (currentUser !== account) {
        dispatch(userUpdated(account));
      }

      fetchInsurance(account, signer);
      dispatch(walletConnected(true));
    } else {
      setButtonText(defaultText);
    }
  }, [account, dispatch, active]);

  return (
    <ButtonBase onClick={() => activate(injected)}>{buttonText}</ButtonBase>
  );
}

const mapDispatchToProps = {
  fetchInsurance,
};
export default connect(null, mapDispatchToProps)(ConnectButton);
