import React from 'react'
import ReactDOM from 'react-dom'

export function renderWithLocationComponent ({ Component, entryPoint }) {
  const client = window.ZAFClient.init()
  console.log('client')
  return () => {
    client.on('app.registered', () => {
      ReactDOM.render(
        <Component client={client} />,
        document.getElementById(entryPoint)
      )
    })
  }
}
