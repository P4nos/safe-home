import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const ButtonBase = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #f50057;
  color: #f50057;
  margin: 0 1em;
  padding: 0.25em 1em;
  :hover {
    background: #f50057;
    opacity: 0.4;
    color: white;
  }
`;

export const ButtonLarge = styled.button`
  border-radius: 5px;
  height: 150px;
  width: 200px;
  font-size: 20px;
  background: transparent;
  opacity: 0.3;
  border: 2px solid #f50057;
  color: #f50057;
  margin-bottom: 5px;
  padding: 0.25em 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

export const StyledNavLink = styled(NavLink)`
  border-radius: 5px;
  height: 150px;
  width: 200px;
  font-size: 20px;
  background: transparent;
  border: 2px solid #f50057;
  color: #f50057;
  margin-bottom: 5px;
  padding: 0.25em 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  :hover {
    background: #fc4585;
    opacity: 0.4;
    color: white;
  }
`;
