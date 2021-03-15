import * as React from 'react';

export const usePinnedUserIdList = ({ client, fieldPath, toggleReload }) => {
  console.log('param ', fieldPath);
  console.log('toggleReload ', toggleReload);
  const [sidebarState, setSidebarState] = React.useState({
    pinnedUserEmailList: [],
    hasPinned: false,
    pinIds: [],
    userId: null,
  });

  React.useEffect(() => {
    console.log('usePinnedUserIdList useEffect is called and filePath is', fieldPath);

    // TODO: Using Promise.all for fieldPath and currentUser (Monday)2
    client.get(fieldPath).then(async (data) => {
      const content = data[fieldPath.trim()];
      console.log('content ', content);
      let currentUserId = await client.get('currentUser.id');
      currentUserId = currentUserId['currentUser.id'].toString();
      // setUserId(currentUserId)
      setSidebarState((state) => ({
        ...state,
        userId: currentUserId,
      }));

      if (content != null && content.length > 1) {
        console.log('usePinnedUserIdList::content::', content);
        let userIds = content;
        console.log('usePinnedUserIdList:: ', userIds.split(','));
        userIds = userIds.split(',');
        // setPinIds(userIds)
        setSidebarState((state) => ({
          ...state,
          pinIds: userIds,
        }));
        const isMatch = userIds.includes(currentUserId.toString());
        // console.log('usePinnedUserIdList::hasPinned ', hasPinned)
        // setHasPinned(isMatch)
        setSidebarState((state) => ({
          ...state,
          hasPinned: isMatch,
        }));

        let emails = [];
        for (let id of userIds) {
          console.log('query ', `/api/v2/search.json?query=user:${id.trim()}`);
          const user = await client.request(`/api/v2/search.json?query=user:${id.trim()}`);
          console.log('user ', user);
          let email = user?.results[0];
          if (email !== undefined) {
            console.log('usePinnedUserIdList::email:: ', email['email']);
            emails = [...emails, email['email']];
          }
        }
        // setPinnedUserEmailList(emails)
        setSidebarState((state) => ({
          ...state,
          pinnedUserEmailList: emails,
        }));
      } else {
        console.log('context is null', content);
        // setPinnedUserEmailList([])
        setSidebarState((state) => ({
          ...state,
          pinnedUserEmailList: [],
        }));
      }
    });
  }, [fieldPath, toggleReload]);

  return {
    sidebarState,
    setSidebarState,
  };
};

export const useDisableField = (client) => {
  let path = 'ticketFields:custom_field_360007148615.disable';
  React.useEffect(() => {
    client.invoke(path);
  }, []);
};

export const useCustomFieldListener = (client, fieldPath) => {
  const [toggleReload, setToggleReload] = React.useState(false);
  React.useEffect(() => {
    client.on(fieldPath, (data) => {
      console.log('changed ', data);
      setToggleReload(!toggleReload);
    });
  }, []);
  return toggleReload;
};
