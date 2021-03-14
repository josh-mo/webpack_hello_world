import { TopBarContainer as TopBar } from './top_bar'
import {renderWithLocationComponent} from "lib/renderer";

const entryPoint = 'topBarEntry'

const renderTopBar = renderWithLocationComponent({
  Component: TopBar,
  entryPoint
})

renderTopBar()
