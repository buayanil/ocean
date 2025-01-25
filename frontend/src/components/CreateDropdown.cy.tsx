import React from 'react'
import CreateDropdown from './CreateDropdown'

describe('<CreateDropdown />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CreateDropdown />)
  })
})