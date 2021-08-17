import React from 'react';

import { fieldPath } from './util';
import { useClientContext } from '../lib/renderer';

const fetchUserFromApi = async (client, userId) => {
  const { results } = await client.request(
    `/api/v2/search.json?query=user:${String(userId).trim()}`
  );

  return results[0];
};

const initialState = {
  hasPinned: false,
  pinIds: [],
  pinnedUserEmailList: [],
  userEmail: null,
  userId: null,
  toggleReload: false,
  customFieldPath: null,
};

export const useBootstrap = () => {
  const { client, callbackValue: fieldKey } = useClientContext();
  const [state, setState] = React.useState(initialState);

  const path = React.useMemo(() => `ticketFields:${fieldKey}.disable`, [fieldKey]);
  const customFieldPath = React.useMemo(() => fieldPath(fieldKey)?.trim(), [fieldKey]);

  React.useEffect(() => {
    let bootstrapData = { customFieldPath };

    // Disable Custom Field
    client.invoke(path);

    //Get user and custom data in order to generate the email list for the TicketSidebar
    Promise.all([client.get('currentUser'), client.get(bootstrapData.customFieldPath)]).then(
      async ([userData, customFieldData]) => {
        //Get user data
        const {
          currentUser: { id: userId, email: userEmail },
        } = userData;

        //Get custom field data
        if (userId && userEmail) {
          const content = customFieldData[bootstrapData.customFieldPath] ?? '';
          const pinIds = (Boolean(content) && content.split(',')) || [];
          const hasPinned = pinIds.includes(String(userId));

          bootstrapData = {
            ...bootstrapData,
            userId,
            userEmail,
            pinIds,
            hasPinned,
          };
        }

        // Generate the email list
        let pinnedUserEmailList = [];
        for (let userId of bootstrapData.pinIds) {
          const userData = await fetchUserFromApi(client, userId);
          const userEmail = userData['email'];

          if (userEmail) {
            pinnedUserEmailList = [...pinnedUserEmailList, userEmail];
          }
        }

        console.log('[Performance test]: Effect is called to setState', {
          ...bootstrapData,
          pinnedUserEmailList,
        });

        setState({
          ...bootstrapData,
          pinnedUserEmailList,
        });
      }
    );
  }, [client, customFieldPath, path]);

  return [state, setState];
};
