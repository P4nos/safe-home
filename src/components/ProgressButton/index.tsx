import * as React from "react";
import Box from "@material-ui/core/Box";
import LoadingButton from "@material-ui/lab/LoadingButton";
import SaveIcon from "@material-ui/icons/Save";

function _Button({ children, ...props }, ref) {
  return (
    <Box
      mx={{
        "& > button": {
          m: 1,
        },
      }}
    >
      <LoadingButton
        ref={ref}
        progressSize="1rem"
        variant="contained"
        color="secondary"
        {...props}
      >
        {children}
      </LoadingButton>
    </Box>
  );
}

export const ProgressButton = React.forwardRef(_Button);
export default React.forwardRef(_Button);
