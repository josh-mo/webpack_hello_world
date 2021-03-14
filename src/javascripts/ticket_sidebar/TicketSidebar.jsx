import * as React from 'react'

import {useDisableField, usePinnedUserIdList} from './hooks'

/**
 * Container
 */
const TicketSidebarContainer = ({client}) => {
  //hard code
  const [toggleReload, setToggleReload] = React.useState(false)
  let fieldPath = 'ticket.customField:custom_field_360007148615'
  const {
    pinnedUserEmailList,
    setPinnedUserEmailList,
    hasPinned,
    setHasPinned,
    pinIds,
    setPinIds,
    userId,
  } = usePinnedUserIdList({
    client,
    fieldPath,
    toggleReload,
  })
  // useListener(client, fieldPath, setPinnedUserEmailList)
  // TODO: useEffect when toggleReload
  client.on('ticket.custom_field_360007148615.changed', data => {
    console.log('changed ', data)
    setToggleReload(!toggleReload)
  })

  // TODO: useCallback here (Monday)
  const handleClick = async () => {
    let data
    console.log('user id ', userId)
    if (hasPinned) {
      console.log(
        'hasPinned !!!! ',
        pinIds,
        ' remove ',
        userId,
        ' of type ',
        typeof userId,
      )
      let newIds = pinIds.filter(item => item !== userId)
      console.log('newIds ', newIds)
      setPinIds(newIds)
      setHasPinned(false)
      data = await client.get('currentUser')
      const emailToRemove = data?.currentUser?.email
      let emails = pinnedUserEmailList.filter(
        email => email.trim() !== emailToRemove.trim(),
      )
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
      data = await client.get('currentUser')
      const emailToAppend = data?.currentUser?.email
      let test = [...pinnedUserEmailList, emailToAppend]
      console.log('handleClick::test ', test)
      setPinnedUserEmailList([...pinnedUserEmailList, emailToAppend])
      console.log('pinIds.toString()', newPinIds.join(','))
      await client.set(fieldPath, newPinIds.toString())
    }
  }

  return (
    <div>
      <PinButton
        message={hasPinned ? 'unpin me' : 'pin me'}
        onClick={handleClick}
      />
      <UserEmailList pinnedUserEmailList={pinnedUserEmailList} />
    </div>
  )
}

/**
 * Components
 */
// TODO: Simplified
const PinButton = ({message, onClick}) => {
  return <button onClick={onClick}>{message}</button>
}

// TODO: Simplified
const UserEmailList = ({pinnedUserEmailList}) => {
  return pinnedUserEmailList.map((item, index) => {
    return <p key={index}>{item}</p>
  })
}

/**
 * Helper functions
 */
// TODO: Extract into a helpers file
async function getTicketFieldId(client) {
  let customFieldPath = null
  let data = await client.get('ticketFields')
  let fields = data['ticketFields']

  // Iterate through each field
  for (let field in fields) {
    // TODO: Want to get the value from the requirements API and add the ticket field in the requirements.json
    // Find the one that match
    if (fields[field].label == 'Sample app ticket field') {
      customFieldPath = fields[field].name
      // console.log('Sample app ticket field ', customFieldPath);
    }
  }
  return customFieldPath
}

export {TicketSidebarContainer}
