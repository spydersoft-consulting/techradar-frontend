import React from "react";
import { NavigationBar } from "../components/NavigationBar/NavigationBar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const EditorLayout: React.FunctionComponent = () => {
  return (
    <Container fluid as="main" className="px-0">
      <NavigationBar brand="Tech Radar"></NavigationBar>
      <Container fluid>
        <Outlet />
      </Container>
    </Container>
  );
};
export default EditorLayout;
