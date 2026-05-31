describe('Position Page Load E2E', () => {
  beforeEach(() => {
    cy.fixture('position-page-e2e.json').as('e2eData');
  });

  it('valida carga, fases en orden y candidatos en su fase', function () {
    cy.loginAsRecruiter();

    cy.contains('Ir a Posiciones').click();

    cy.contains('.card-title', this.e2eData.positionTitle)
      .should('be.visible')
      .closest('.card')
      .within(() => {
        cy.contains('button', 'Ver proceso').click();
      });

    cy.get('[data-testid="position-title"]')
      .should('be.visible')
      .and('contain.text', this.e2eData.positionTitle);

    cy.get('[data-testid^="phase-title-"]')
      .then(($titles) => {
        const uiPhaseTitles = [...$titles].map((el) => el.textContent.trim());
        expect(uiPhaseTitles).to.deep.equal(this.e2eData.phases);
      });

    Object.entries(this.e2eData.candidatesByPhase).forEach(([phaseName, candidates]) => {
      cy.contains('[data-testid^="phase-title-"]', phaseName)
        .closest('[data-testid^="phase-column-"]')
        .within(() => {
          candidates.forEach((candidateName) => {
            cy.contains('[data-testid^="candidate-name-"]', candidateName).should('exist');
          });
        });
    });

    Object.values(this.e2eData.candidatesByPhase)
      .flat()
      .forEach((candidateName) => {
        cy.contains('[data-testid^="candidate-name-"]', candidateName)
          .should('have.length', 1);
      });
  });

  it('mantiene columnas visibles aunque haya fases vacias', function () {
    cy.loginAsRecruiter();
    cy.contains('Ir a Posiciones').click();

    cy.contains('.card-title', this.e2eData.positionTitle)
      .should('be.visible')
      .closest('.card')
      .within(() => {
        cy.contains('button', 'Ver proceso').click();
      });

    cy.contains('[data-testid^="phase-title-"]', 'Final Decision')
      .closest('[data-testid^="phase-column-"]')
      .within(() => {
        cy.get('[data-testid^="phase-empty-"]').should('be.visible');
      });
  });
});
