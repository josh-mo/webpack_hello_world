import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { TicketSidebarContainer as TicketSidebar } from './TicketSidebar';
import { renderWithLocationComponent } from '../lib/renderer';

const entryPoint = 'ticketSidebarEntry';

const renderTicketSidebar = renderWithLocationComponent({
  Component: TicketSidebar,
  entryPoint,
});

renderTicketSidebar();
