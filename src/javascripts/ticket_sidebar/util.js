// const fieldKey = 'custom_field_99640322';
const _tilte = 'Pinned by';

const fieldPath = (fieldKey) => `ticket.customField:${fieldKey}`;
const fieldPathListener = (fieldKey) => `ticket.${fieldKey}.changed`;

async function getTicketFieldId(client) {
  const data = await client.get('ticketFields');
  const fields = data['ticketFields'];
  let customFieldPath = null;

  // Iterate through each field
  for (let field in fields) {
    // TODO: Want to get the value from the requirements API and add the ticket field in the requirements.json
    // Find the one that match
    if (fields[field].label === _tilte) {
      customFieldPath = fields[field].name?.trim();
    }
  }
  return customFieldPath;
}

export { fieldPath, fieldPathListener, getTicketFieldId };

/**
 * Adrian Feedback:
 * - Know when to use `const` vs `let`.
 * - Also use template literals (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
 * - Named vs default exports (https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910#:~:text=Named%20exports%20are%20useful%20to,an%20object%20or%20anything%20else.)
 */
