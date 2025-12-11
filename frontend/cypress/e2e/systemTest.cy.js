describe('Popup + POST Flow', () => {
    it('füllt Popup aus, sendet POST und prüft die Response', () => {

        // POST überwachen (nicht mocken!)
        cy.intercept('POST', '/api/dein-endpoint').as('postRequest');

        cy.visit('/');

        // 1️⃣ Button klicken der das Popup öffnet
        cy.get('#openPopupBtn').click();

        // 2️⃣ Sicherstellen, dass das Popup sichtbar ist
        cy.get('#myPopup').should('be.visible');

        // 3️⃣ Textfelder im Popup ausfüllen
        cy.get('#textField1').type('Testwert A');
        cy.get('#textField2').type('Testwert B');

        // 4️⃣ Finalen Button klicken → dieser löst POST aus
        cy.get('#submitPopupBtn').click();

        // 5️⃣ Response abfangen und prüfen
        cy.wait('@postRequest').then((interception) => {
            const { statusCode, body } = interception.response;

            // Beispiel-Assertions
            expect(statusCode).to.eq(200);
            expect(body).to.have.property('success', true);

            cy.log('Response Body:', JSON.stringify(body));
        });
    });
});