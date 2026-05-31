Cypress.Commands.add('loginAsRecruiter', () => {
  cy.visit('/');
  cy.contains('Dashboard del Reclutador').should('be.visible');
});

Cypress.Commands.add('openPositionPipeline', (positionTitle) => {
  cy.loginAsRecruiter();
  cy.contains('Ir a Posiciones').click();

  cy.contains('.card-title', positionTitle)
    .should('be.visible')
    .closest('.card')
    .within(() => {
      cy.contains('button', 'Ver proceso').click();
    });

  cy.get('[data-testid="position-title"]')
    .should('be.visible')
    .and('contain.text', positionTitle);
});

Cypress.Commands.add('dragCandidateToPhase', (candidateName, sourcePhaseTitle, destinationPhaseTitle) => {
  cy.contains('[data-testid^="phase-title-"]', sourcePhaseTitle)
    .closest('[data-testid^="phase-column-"]')
    .within(() => {
      cy.contains('[data-testid^="candidate-name-"]', candidateName)
        .closest('[data-testid^="candidate-card-"]')
        .as('dragCandidateCard');
    });

  cy.get('[data-testid^="phase-title-"]').then(($titles) => {
    const titles = [...$titles].map((el) => el.textContent.trim());
    const sourceIndex = titles.indexOf(sourcePhaseTitle);
    const destinationIndex = titles.indexOf(destinationPhaseTitle);

    expect(sourceIndex, `source phase index for ${sourcePhaseTitle}`).to.be.gte(0);
    expect(destinationIndex, `destination phase index for ${destinationPhaseTitle}`).to.be.gte(0);

    const key = destinationIndex >= sourceIndex ? 'ArrowRight' : 'ArrowLeft';
    const keyCode = destinationIndex >= sourceIndex ? 39 : 37;
    const moves = Math.abs(destinationIndex - sourceIndex);

    cy.get('@dragCandidateCard').should('be.visible').focus();
    cy.focused().trigger('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      force: true,
    });

    for (let i = 0; i < moves; i += 1) {
      cy.focused().trigger('keydown', {
        key,
        code: key,
        keyCode,
        which: keyCode,
        force: true,
      });
    }

    cy.focused().trigger('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      force: true,
    });
  });
});
