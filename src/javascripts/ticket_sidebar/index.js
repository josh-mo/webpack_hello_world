import {TicketSidebar} from './TicketSidebar'
import {renderWithLocationComponent} from "../lib/renderer";

const entryPoint = 'ticketSidebarEntry'

const renderTicketSidebar = renderWithLocationComponent({
  Component: TicketSidebar,
  entryPoint
})

renderTicketSidebar()
