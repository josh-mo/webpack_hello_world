import * as React from 'react'

const usePinnedUserIdList = ({client, fieldPath, toggleReload}) => {
  console.log('param ', fieldPath);
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
  const [pinnedUserEmailList, setPinnedUserEmailList] = React.useState([]);
  const [hasPinned, setHasPinned] = React.useState(false);
  const [pinIds, setPinIds] = React.useState([]);
  const [userId, setUserId] = React.useState('');

  React.useEffect(() => {
    console.log('usePinnedUserIdList useEffect is called and filePath is', fieldPath);

    // TODO: Using Promise.all for fieldPath and currentUser (Monday)2
    client.get(fieldPath).then(async (data) => {
      const content = data[fieldPath.trim()];
      console.log('content ', content);
      let currentUserId = await client.get('currentUser.id')
      currentUserId = currentUserId['currentUser.id'].toString()
      setUserId(currentUserId)

      if (content!=null && content.length>1) {
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
          const user = await client.request(`/api/v2/search.json?query=user:${id.trim()}`)
          console.log('user ', user)
          let email = user?.results[0]
          if (email !== undefined) {
            console.log('usePinnedUserIdList::email:: ', email['email'])
            emails = ([...emails, email['email']])
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
    });


  }, [fieldPath, toggleReload]);

  return {pinnedUserEmailList, setPinnedUserEmailList, hasPinned, setHasPinned, pinIds, setPinIds, userId};
};

const useDisableField = (client) => {
  let path = 'ticketFields:custom_field_360007148615.disable'
  React.useEffect(() => {
    client.invoke(path)
  }, [])
}

/**
 * Container
 */
const TicketSidebarContainer = ({client}) => {
  //hard code
  const [toggleReload, setToggleReload] = React.useState(false)
  let fieldPath = 'ticket.customField:custom_field_360007148615'
  const {pinnedUserEmailList, setPinnedUserEmailList, hasPinned, setHasPinned, pinIds, setPinIds, userId} = usePinnedUserIdList({
    client,
    fieldPath,
    toggleReload
  });
  // useListener(client, fieldPath, setPinnedUserEmailList)
  // TODO: useEffect when toggleReload
  client.on('ticket.custom_field_360007148615.changed',  (data) => {
    console.log('changed ', data)
    setToggleReload(!toggleReload)
  })

  // TODO: useCallback here (Monday)
  const handleClick = async () => {
    let data;
    console.log('user id ', userId)
    if (hasPinned) {
      console.log('hasPinned !!!! ',  pinIds, ' remove ', userId, ' of type ', typeof userId)
      let newIds = pinIds.filter(item => item !== userId)
      console.log('newIds ', newIds)
      setPinIds(newIds)
      setHasPinned(false)
      data = await client.get('currentUser');
      const emailToRemove = data?.currentUser?.email
      let emails = pinnedUserEmailList.filter(email => email.trim() !== emailToRemove.trim())
      console.log('new emails ', emails)
      setPinnedUserEmailList(emails)
      console.log('pinIds.toString()', newIds.join(','))
      await client.set(fieldPath, newIds.join(','))
    } else {
      console.log('new add ', pinIds)
      const newPinIds = [...pinIds, userId]
      setPinIds(newPinIds)
      setHasPinned(true)
      //Append
      data = await client.get('currentUser');
      const emailToAppend = data?.currentUser?.email
      let test = [...pinnedUserEmailList, emailToAppend]
      console.log('handleClick::test ', test)
      setPinnedUserEmailList([...pinnedUserEmailList, emailToAppend])
      console.log('pinIds.toString()', newPinIds.join(','))
      await client.set(fieldPath, newPinIds.toString())
    }
  };

  return (
    <div>
      <PinButton
        message={hasPinned ? 'unpin me' : 'pin me' }
        onClick={handleClick}
      />
      <UserEmailList pinnedUserEmailList={pinnedUserEmailList}/>
    </div>
  );
};

/**
 * Components
 */
// TODO: Simplified
const PinButton = ({message, onClick}) => {
  return <button onClick={onClick}>{message}</button>;
};

// TODO: Simplified
const UserEmailList = ({pinnedUserEmailList}) => {
  return pinnedUserEmailList.map((item, index) => {
    return<p key={index}>{item}</p>
  })
};

/**
 * Helper functions
 */
// TODO: Extract into a helpers file
async function getTicketFieldId(client) {
  let customFieldPath = null;
  let data = await client.get('ticketFields');
  let fields = data['ticketFields'];

  // Iterate through each field
  for (let field in fields) {
    // TODO: Want to get the value from the requirements API and add the ticket field in the requirements.json
    // Find the one that match
    if (fields[field].label == 'Sample app ticket field') {
      customFieldPath = fields[field].name;
      // console.log('Sample app ticket field ', customFieldPath);
    }
  }
  return customFieldPath;
}

export {TicketSidebarContainer}