import * as React from 'react';

const ClientContext = React.createContext();

ClientContext.displayName = 'ClientContext';

export function ClientProvider(props) {
  const client = window.ZAFClient.init();

  return <ClientContext.Provider value={client} {...props} />;
}

export function useClient() {
  const context = React.useContext(ClientContext);
  if (context === undefined) {
    throw new Error(`useClient must be used within a ClientProvider`);
  }
  return context;
}
