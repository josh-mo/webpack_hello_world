import * as React from 'react';

import { useUserId, useFetchPinnedTickets } from './hooks';

/*
 * Container
 **/
const TopBarContainer = ({ client }) => {
  const [tickets, setTickets] = React.useState([]);
  const id = useUserId(client);

  useFetchPinnedTickets(client, id, setTickets);

  const routeToTicket = (client, ticketId) => {
    console.log('TopBar route to ', ticketId);
    client.invoke('routeTo', 'ticket', ticketId);
  };

  return (
    <div>
      {tickets.map((item) => {
        console.log('TopBar item is ', item);
        return (
          <div key={item.ticketId}>
            <button type="submit" onClick={() => routeToTicket(client, item.ticketId)}>
              {item.ticketId}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export { TopBarContainer };
