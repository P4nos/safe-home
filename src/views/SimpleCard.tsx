import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    height: 250,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
