import { registerRootComponent } from "expo";
import React from "react";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { createActorContext } from "@xstate/react";
import { SolvesMachine } from "@/solves-machine/solves-machine";
import { App } from "@/components/app";

export const SolvesMachineContext = createActorContext(SolvesMachine);

const AppComponent = gestureHandlerRootHOC(() => {
  return (
    <>
      <SolvesMachineContext.Provider logic={SolvesMachine}>
        <MenuProvider>
          <App />
        </MenuProvider>
      </SolvesMachineContext.Provider>
    </>
  );
});
export default registerRootComponent(AppComponent);
