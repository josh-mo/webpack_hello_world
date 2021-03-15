import * as React from 'react';

import { useCustomFieldListener, useDisableField, usePinnedUserIdList } from './hooks';

/**
 * Container
 */
const TicketSidebarContainer = ({ client }) => {
  let fieldPath = 'ticket.customField:custom_field_360007148615';
  let fieldPath_listener = 'ticket.custom_field_360007148615.changed';

  const toggleReload = useCustomFieldListener(client, (fieldPath = fieldPath_listener));

  const { sidebarState, setSidebarState } = usePinnedUserIdList({
    client,
    fieldPath,
    toggleReload,
  });

  // TODO: useCallback here (Monday)
  const handleClick = async () => {
    let data;
    console.log('user id ', sidebarState.userId);
    if (sidebarState.hasPinned) {
      let newIds = sidebarState.pinIds.filter((item) => item !== sidebarState.userId);
      // console.log('newIds ', newIds)
      data = await client.get('currentUser');
      const emailToRemove = data?.currentUser?.email;
      let emails = sidebarState.pinnedUserEmailList.filter(
        (email) => email.trim() !== emailToRemove.trim()
      );
      console.log('new emails ', emails);
      setSidebarState((state) => ({
        ...state,
        pinIds: newIds,
        hasPinned: false,
        pinnedUserEmailList: emails,
      }));
      console.log('pinIds.toString()', newIds.join(','));
      await client.set(fieldPath, newIds.join(','));
    } else {
      console.log('new add ', sidebarState.pinIds);
      const newPinIds = [...sidebarState.pinIds, sidebarState.userId];

      //Append
      data = await client.get('currentUser');
      const emailToAppend = data?.currentUser?.email;
      let test = [...sidebarState.pinnedUserEmailList, emailToAppend];
      console.log('handleClick::test ', test);
      setSidebarState((state) => ({
        ...state,
        pinIds: newPinIds,
        hasPinned: true,
        pinnedUserEmailList: [...sidebarState.pinnedUserEmailList, emailToAppend],
      }));
      console.log('pinIds.toString()', newPinIds.join(','));
      await client.set(fieldPath, newPinIds.toString());
    }
  };

  return (
    <div>
      <PinButton message={sidebarState.hasPinned ? 'unpin me' : 'pin me'} onClick={handleClick} />
      <UserEmailList pinnedUserEmailList={sidebarState.pinnedUserEmailList} />
    </div>
  );
};

/**
 * Components
 */
// TODO: Simplified
const PinButton = ({ message, onClick }) => {
  return <button onClick={onClick}>{message}</button>;
};

// TODO: Simplified
const UserEmailList = ({ pinnedUserEmailList }) => {
  console.log('UserEmailList::** ', pinnedUserEmailList);
  return pinnedUserEmailList.map((item, index) => {
    return <p key={index}>{item}</p>;
  });
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
    if (fields[field].label === 'Sample app ticket field') {
      customFieldPath = fields[field].name;
      // console.log('Sample app ticket field ', customFieldPath);
    }
  }
  return customFieldPath;
}

export { TicketSidebarContainer };
