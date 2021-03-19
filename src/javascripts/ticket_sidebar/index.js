import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { renderWithLocationComponent } from '../lib/renderer';
import TicketSidebar from './TicketSidebar';
import { getTicketFieldId } from './util';

const entryPoint = 'ticketSidebarEntry';

const renderTicketSidebar = renderWithLocationComponent({
  Component: TicketSidebar,
  entryPoint,
  callback: getTicketFieldId,
});

renderTicketSidebar();
