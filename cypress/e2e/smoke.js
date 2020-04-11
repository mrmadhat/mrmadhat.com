describe('app', () => {
  it('works', () => {
    cy.visit('/')
    cy.wait(500) // wait for rehydration
    cy.findAllByRole('link', {name: /articles/i})
      .last()
      .click()
  })
})
