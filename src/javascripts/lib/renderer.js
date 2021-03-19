import React from 'react';
import ReactDOM from 'react-dom';

const ClientContext = React.createContext();
const client = window.ZAFClient.init();

export function renderWithLocationComponent({ Component, entryPoint, callback }) {
  return () => {
    client.on('app.registered', async () => {
      let callbackValue = null;
      if (callback) callbackValue = await callback(client);

      ReactDOM.render(
        <ClientContext.Provider value={{ client, callbackValue }}>
          <Component />
        </ClientContext.Provider>,
        document.getElementById(entryPoint)
      );
    });
  };
}

export function useClientContext() {
  const context = React.useContext(ClientContext);
  if (context === undefined) {
    throw new Error(`useClientContext must be used within a ClientProvider`);
  }
  return context;
}
