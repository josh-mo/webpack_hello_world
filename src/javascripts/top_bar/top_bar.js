import React from 'react';

import { useFetchPinnedTickets } from './hooks';
import { useClientContext } from '../lib/renderer';

const TopBarContainer = () => {
  console.log('[**Performance test entry ***] TopBarContainer is rendered with state ');

  const { client } = useClientContext();
  const tickets = useFetchPinnedTickets();

  const routeToTicket = (ticketId) => {
    console.log('TopBar route to ', ticketId);
    client.invoke('routeTo', 'ticket', ticketId);
  };

  return (
    <>
      {tickets.map((item) => {
        return (
          <div key={item.ticketId}>
            <button type="submit" onClick={() => routeToTicket(item.ticketId)}>
              {item.ticketId}
            </button>
          </div>
        );
      })}
    </>
  );
};

export { TopBarContainer };
