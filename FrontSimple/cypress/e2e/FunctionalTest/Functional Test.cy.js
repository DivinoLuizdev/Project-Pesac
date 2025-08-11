describe('Homepage', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('should load successfully', () => {
    cy.contains('Usuários');
  });




  it('should display the list of users', () => {
     
    cy.contains('th', 'Usuário').should('be.visible');
    cy.contains('th', 'Email').should('be.visible');
    cy.contains('th', 'Localização').should('be.visible');
    cy.contains('th', 'Ações').should('be.visible');

    cy.get('tbody tr').should('have.length.greaterThan', 0);

 
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('be.visible'); // User column
      cy.get('td').eq(1).should('be.visible'); // Email column
    });
  });

  it('should generate users and increase the table length', () => {
    
 
    // get current number of rows
    cy.get('tbody tr').then($rowsBefore => {
      const countBefore = $rowsBefore.length;

       
      cy.get('.flex-col > .flex.gap-2 > :nth-child(2)').click();
 
      cy.get('tbody tr', { timeout: 10000 })
        .its('length')
        .should('be.gt', countBefore);
    });
  });

  it('should delete the first user and decrease the table length', () => {
   

   
    cy.get('tbody tr').then($rowsBefore => {
      const countBefore = $rowsBefore.length;
      expect(countBefore).to.be.greaterThan(0); 
      cy.get(':nth-child(1) > :nth-child(4) > .flex > .hover\\:bg-destructive\\/10').click();
      cy.get('.bg-destructive').click();
      cy.get('tbody tr', { timeout: 10000 })
        .its('length')
        .should('equal', countBefore - 1);
    });
  });


});

