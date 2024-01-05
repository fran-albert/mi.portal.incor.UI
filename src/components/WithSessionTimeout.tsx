import React, { useEffect, ComponentType } from "react";
import { signOut } from "next-auth/react";

type WithSessionTimeoutProps = {};

const withSessionTimeout = <P extends object>(Component: ComponentType<P>) => {
  return function WithSessionTimeoutComponent(
    props: P & WithSessionTimeoutProps
  ) {
    useEffect(() => {
      let inactivityTimer: NodeJS.Timeout;

      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          signOut();
        }, 10 * 60 * 1000); // 10 minutos
      };

      window.onload = resetTimer;
      window.onmousemove = resetTimer;
      window.onmousedown = resetTimer;
      window.ontouchstart = resetTimer;
      window.onclick = resetTimer;
      window.onkeypress = resetTimer;

      return () => clearTimeout(inactivityTimer);
    }, []);

    return <Component {...(props as P)} />;
  };
};

export default withSessionTimeout;
