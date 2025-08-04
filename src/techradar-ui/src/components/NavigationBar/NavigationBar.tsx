import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationMenu } from "../AuthenticationMenu/AuthenticationMenu";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

export interface NavigationBarProperties {
  brand?: string;
  children?: React.ReactNode;
}

export const NavigationBar: React.FunctionComponent<NavigationBarProperties> = (
  props: NavigationBarProperties,
): React.JSX.Element => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const menuItems = [
    {
      label: "Home",
      icon: <FontAwesomeIcon icon={faHome} className="mr-1" />,
      command: () => {
        window.location.href = "/";
      },
    },
  ];

  const brandTemplate = (
    <div className="flex items-center">
      <span className="text-xl font-bold">{props.brand ?? "Brand"}</span>
    </div>
  );

  const endTemplate = (
    <div className="flex items-center gap-2">
      <div className="hidden md:block">
        <AuthenticationMenu />
      </div>
      <div className="md:hidden">
        <Button
          icon={<FontAwesomeIcon icon={faBars} />}
          className="p-button-text p-button-plain"
          onClick={() => setIsSidebarVisible(true)}
          aria-label="Open menu"
        />
      </div>
    </div>
  );

  return (
    <>
      <Menubar model={menuItems} start={brandTemplate} end={endTemplate} />

      <Sidebar visible={isSidebarVisible} onHide={() => setIsSidebarVisible(false)} position="right" className="w-80">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <div className="space-y-2">
            <a
              href="/"
              className="flex items-center p-3 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsSidebarVisible(false)}
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </a>
            {props.children}
          </div>
          <div className="border-t pt-4">
            <AuthenticationMenu />
          </div>
        </div>
      </Sidebar>
    </>
  );
};
