describe('My first test', () => {
  it('Should do something', () => {
    cy.visit('localhost:4200/');

    cy.contains('span', 'Welcome') ;
  });
});
