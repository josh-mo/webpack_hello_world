import React from 'react';
import { useClientContext } from '../lib/renderer';

const useFetchPinnedTickets = () => {
  const id = useUserId();
  const { client } = useClientContext();
  const [tickets, setTickets] = React.useState([]);

  React.useEffect(() => {
    console.log('[performance useEffect test - useFetchPinnedTickets] ', id);

    const fetchTicketList = async () => {
      const pinnedTickets = await client.request(
        `/api/v2/search.json?query=type:ticket+fieldvalue:${id}`
      );

      if (pinnedTickets['count'] > 0) {
        console.log('TopBar result custom_fields', pinnedTickets['results']);
        const myPinnedTickets = retrieveTickets(pinnedTickets['results']);

        setTickets(myPinnedTickets);
      }
    };

    if (id) {
      fetchTicketList();
      client.on('pane.activated', fetchTicketList);
    }

    return () => {
      console.log('TopBar ** client off is called');
      client.off('pane.activated', fetchTicketList);
    };
  }, [client, id]);

  return tickets;
};

function retrieveTickets(pinnedTicketsQueryResult) {
  console.log('pinnedTicketsQueryResult', pinnedTicketsQueryResult);
  return pinnedTicketsQueryResult
    .map((ticketObject) => {
      let customField = ticketObject['custom_fields'];
      let ticketId = ticketObject['id'];
      return customField.map((field) => ({ ...field, ticketId }));
    })
    .map((ticketFields) => {
      return ticketFields.filter((field) => {
        console.log('TopBar field', field);
        const { id, value } = field;
        return id === 360007148615 && value !== null && value !== '';
      });
    })
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
}

const useUserId = () => {
  const { client } = useClientContext();
  const [id, setId] = React.useState();
  React.useEffect(() => {
    client.get('currentUser.id').then((data) => {
      console.log('[performance useEffect test - useUserId]', data);
      let currentUserId = data['currentUser.id'].toString();
      setId(currentUserId);
    });
  }, [client]);

  return id;
};

export { useFetchPinnedTickets };
