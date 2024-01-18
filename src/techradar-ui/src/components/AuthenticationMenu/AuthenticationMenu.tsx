//import AzureAuthenticationContext from "../../utils/authProvider";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "../../store/hooks";
// import { RootState } from "../../store/store";
import { Dropdown, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons/faMicrosoft";
import { useAuth } from "../../context";

// Log In, Log Out button
export const AuthenticationMenu = (): JSX.Element => {
  const { isAuthenticated, user } = useAuth();

  const getDropdownContent = (): JSX.Element => {
    if (isAuthenticated) {
      return (
        <>
          <Dropdown.Item id="authenticationButton" href="/profile">
            {user?.name}
          </Dropdown.Item>
          <Dropdown.Item id="authenticationButton" href="/auth/logout">
            Log out
          </Dropdown.Item>
        </>
      );
    }

    return (
      <Dropdown.Item id="authenticationButton" href="/auth/login">
        Login
      </Dropdown.Item>
    );
  };

  return (
    <Nav>
      <Dropdown id="profileNav" align="end">
        <Dropdown.Toggle id="profile">
          <FontAwesomeIcon icon={faMicrosoft}></FontAwesomeIcon>
        </Dropdown.Toggle>
        <Dropdown.Menu>{getDropdownContent()}</Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
};
