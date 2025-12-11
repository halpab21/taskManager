describe('Popup + POST Flow', () => {
  it('füllt Popup aus, sendet POST und prüft die Response', () => {

    cy.visit("http://localhost:5173/")
    cy.intercept('POST', 'http://localhost:8080/task').as('postRequest');


    cy.get('#openPopupBtn').click();

    cy.get('#myPopup').should('be.visible');

    cy.get('#textField1').type('Syp');
    cy.get('#textField2').type('Mache den Cypress Test');

    cy.get('#submitPopupBtn').click();

    cy.wait('@postRequest').then((interception) => {
      const { statusCode, body } = interception.response;

      expect(statusCode).to.eq(200);

      cy.log('Response Body:', JSON.stringify(body));
    });
  });
});