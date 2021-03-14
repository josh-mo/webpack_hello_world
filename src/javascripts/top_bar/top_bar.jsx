import * as React from 'react'

const useUserId = (client) => {
  const [id, setId] = React.useState();
  React.useEffect(() => {
    client.get('currentUser.id').then((data) => {
      console.log('TopBar data from current user', data);
      let currentUserId = data['currentUser.id'].toString();
      setId(currentUserId);
    });
  }, []);

  return id;
};

const useFetchPinnedTickets = (client, id, setTickets) => {
  React.useEffect(() => {
    console.log('TopBar id is ', id);

    const fetchTicketList = async () => {
      const pinnedTickets = await client.request(
        `/api/v2/search.json?query=type:ticket+fieldvalue:${id}`
      );

      if (pinnedTickets['count'] > 0) {
        console.log('TopBar result custom_fields', pinnedTickets['results']);

        const myPinnedTickets = pinnedTickets['results']
          .map((ticketObject) => {
            let customField = ticketObject['custom_fields'];
            let ticketId = ticketObject['id'];
            return customField.map((field) => ({...field, ticketId}));
          })
          .map((ticketFields) => {
            console.log('TopBar ticket **', ticketFields);
            return ticketFields.filter((field) => {
              console.log('TopBar field', field);
              const {id, value} = field;
              return id === 360007148615 && value !== null && value !== '';
            });
          })
          .reduce(
            (accumulator, currentValue) => accumulator.concat(currentValue),
            []
          );

        setTickets(myPinnedTickets);
      }
    };

    if (id) {
      fetchTicketList().then();
      client.on('pane.activated', fetchTicketList);
    }

    return () => client.off('pane.activated', fetchTicketList);
  }, [id]);
}

/*
 * Container
 **/
const TopBarContainer = ({client}) => {
  const [tickets, setTickets] = React.useState([]);
  const id = useUserId(client);

  useFetchPinnedTickets(client, id, setTickets)

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
            <button
              type="submit"
              onClick={() => routeToTicket(client, item.ticketId)}
            >
              {item.ticketId}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export {TopBarContainer}