import * as React from 'react'

export const usePinnedUserIdList = ({client, fieldPath, toggleReload}) => {
  console.log('param ', fieldPath)
  console.log('toggleReload ', toggleReload)
  // TODO: Use useSate once and we want to use functional state update (Monday)
  /**
   * setHasPinned((state) => {
   *   return {
   *     ...state,
   *     hasPinned: !state.hasPinned
   *   }
   * });
   */
  const [pinnedUserEmailList, setPinnedUserEmailList] = React.useState([])
  const [hasPinned, setHasPinned] = React.useState(false)
  const [pinIds, setPinIds] = React.useState([])
  const [userId, setUserId] = React.useState('')

  React.useEffect(() => {
    console.log(
      'usePinnedUserIdList useEffect is called and filePath is',
      fieldPath,
    )

    // TODO: Using Promise.all for fieldPath and currentUser (Monday)2
    client.get(fieldPath).then(async data => {
      const content = data[fieldPath.trim()]
      console.log('content ', content)
      let currentUserId = await client.get('currentUser.id')
      currentUserId = currentUserId['currentUser.id'].toString()
      setUserId(currentUserId)

      if (content != null && content.length > 1) {
        console.log('usePinnedUserIdList::content::', content)
        let userIds = content
        console.log('usePinnedUserIdList:: ', userIds.split(','))
        userIds = userIds.split(',')
        setPinIds(userIds)
        const isMatch = userIds.includes(currentUserId.toString())
        console.log('usePinnedUserIdList::hasPinned ', hasPinned)
        setHasPinned(isMatch)

        let emails = []
        for (let id of userIds) {
          console.log('query ', `/api/v2/search.json?query=user:${id.trim()}`)
          const user = await client.request(
            `/api/v2/search.json?query=user:${id.trim()}`,
          )
          console.log('user ', user)
          let email = user?.results[0]
          if (email !== undefined) {
            console.log('usePinnedUserIdList::email:: ', email['email'])
            emails = [...emails, email['email']]
          }
        }
        setPinnedUserEmailList(emails)

        // const requestData = await client.request(`/api/v2/search.json?query=fieldvalue:${currentUserId}`)
        // let currentTicketId =  await client.get('ticket.id')
        // currentTicketId = currentTicketId['ticket.id']
        // const hasPinnedItem = requestData?.results.find(item=>item.id === currentUserId) != null
        // console.log('usePinnedUserIdList::REST::hasPinnedItem', hasPinnedItem)
        // console.log('usePinnedUserIdList::REST::', requestData?.results)
        // console.log('usePinnedUserIdList::REST::ticket ', currentTicketId)
      } else {
        console.log('context is null', content)
        setPinnedUserEmailList([])
      }
    })
  }, [fieldPath, toggleReload])

  return {
    pinnedUserEmailList,
    setPinnedUserEmailList,
    hasPinned,
    setHasPinned,
    pinIds,
    setPinIds,
    userId,
  }
}

export const useDisableField = client => {
  let path = 'ticketFields:custom_field_360007148615.disable'
  React.useEffect(() => {
    client.invoke(path)
  }, [])
}
