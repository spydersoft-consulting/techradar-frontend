import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav } from "react-bootstrap";
import { AuthenticationMenu } from "../AuthenticationMenu/AuthenticationMenu";

export type NavigationBarProperties = {
  brand?: string;
  children?: React.ReactNode;
};

export const NavigationBar: React.FunctionComponent<NavigationBarProperties> = (
  props: NavigationBarProperties,
): JSX.Element => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand>{props.brand ?? "Brand"}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </Nav.Link>
          {props.children}
        </Nav>
      </Navbar.Collapse>
      <AuthenticationMenu />
    </Navbar>
  );
};
