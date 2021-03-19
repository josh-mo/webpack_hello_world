import React from 'react';

import { useBootstrap } from './hooks';
import { useClientContext } from '../lib/renderer';

const TicketSidebar = () => {
  const { client } = useClientContext();
  const [state, setState] = useBootstrap();

  console.log('[**Performance test entry ***] TicketSidebar is rendered with state ', state);

  const handleOnClick = React.useCallback(async () => {
    console.log('[Performance test] handleClick is called');

    if (state.hasPinned) {
      const emailToRemove = state.userEmail;

      let newIds = state.pinIds.filter((item) => item !== String(state.userId));
      let emails = state.pinnedUserEmailList.filter(
        (email) => email.trim() !== emailToRemove.trim()
      );

      setState((prevState) => ({
        ...prevState,
        pinIds: newIds,
        hasPinned: false,
        pinnedUserEmailList: emails,
      }));

      await client.set(state.customFieldPath, newIds.join(','));
    } else {
      const newPinIds = [...state.pinIds, String(state.userId)];
      const emailToAppend = state.userEmail;

      setState((prevState) => ({
        ...prevState,
        pinIds: newPinIds,
        hasPinned: true,
        pinnedUserEmailList: [...state.pinnedUserEmailList, emailToAppend],
      }));

      await client.set(state.customFieldPath, newPinIds.toString());
    }
  }, [client, state, setState]);

  return (
    <>
      <button onClick={handleOnClick}>{state.hasPinned ? 'Unpin me' : 'Pin me'}</button>
      {state.pinnedUserEmailList?.map((item, index) => (
        <p key={item}>{item}</p>
      ))}
    </>
  );
};

export default TicketSidebar;

/**
 * Adrian Feedback:
 * - List and keys (https://reactjs.org/docs/lists-and-keys.html)
 * - Better naming of functions and variables to reduce ambiguity
 * - Strike a balance between making your code more readable and over engineering your code
 * - Learn how to use `useCallback` and `useMemo` and why you need them (https://dmitripavlutin.com/dont-overuse-react-usecallback/) and read up again on this https://overreacted.io/a-complete-guide-to-useeffect/#synchronization-not-lifecycle
 */
