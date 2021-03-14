import * as React from 'react'

export const useUserId = client => {
  const [id, setId] = React.useState()
  React.useEffect(() => {
    client.get('currentUser.id').then(data => {
      console.log('TopBar data from current user', data)
      let currentUserId = data['currentUser.id'].toString()
      setId(currentUserId)
    })
  }, [])

  return id
}

export const useFetchPinnedTickets = (client, id, setTickets) => {
  React.useEffect(() => {
    console.log('TopBar id is ', id)

    const fetchTicketList = async () => {
      const pinnedTickets = await client.request(
        `/api/v2/search.json?query=type:ticket+fieldvalue:${id}`,
      )

      if (pinnedTickets['count'] > 0) {
        console.log('TopBar result custom_fields', pinnedTickets['results'])

        const myPinnedTickets = pinnedTickets['results']
          .map(ticketObject => {
            let customField = ticketObject['custom_fields']
            let ticketId = ticketObject['id']
            return customField.map(field => ({...field, ticketId}))
          })
          .map(ticketFields => {
            return ticketFields.filter(field => {
              console.log('TopBar field', field)
              const {id, value} = field
              return id === 360007148615 && value !== null && value !== ''
            })
          })
          .reduce(
            (accumulator, currentValue) => accumulator.concat(currentValue),
            [],
          )
        console.log('TopBar setTickets **', myPinnedTickets)
        setTickets(myPinnedTickets)
      }
    }

    if (id) {
      fetchTicketList().then()
      console.log('TopBar ** client on is called')
      client.on('pane.activated', fetchTicketList)
    }

    return () => {
      console.log('TopBar ** client off is called')
      client.off('pane.activated', fetchTicketList)
    }
  }, [id])
}
