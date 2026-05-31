describe('Candidate Phase Drag E2E', () => {
  beforeEach(function () {
    cy.fixture('candidate-phase-drag-e2e.json').as('e2eData');
  });

  const getPhaseColumnByTitle = (phaseTitle) =>
    cy.contains('[data-testid^="phase-title-"]', phaseTitle)
      .closest('[data-testid^="phase-column-"]');

  const captureCandidateCurrentPhase = (candidateName, aliasName) => {
    cy.contains('[data-testid^="candidate-name-"]', candidateName)
      .closest('[data-testid^="phase-column-"]')
      .find('[data-testid^="phase-title-"]')
      .invoke('text')
      .then((phaseTitle) => {
        cy.wrap(phaseTitle.trim()).as(aliasName);
      });
  };

  it('mueve visualmente un candidato entre fases sin duplicidad', function () {
    cy.intercept('PUT', '**/candidates/*').as('updateCandidateStage');

    cy.openPositionPipeline(this.e2eData.positionTitle);

    captureCandidateCurrentPhase(this.e2eData.candidateName, 'sourcePhaseTitle');

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      const destinationPhase = sourcePhaseTitle === this.e2eData.destinationPhase
        ? this.e2eData.fallbackDestinationPhase
        : this.e2eData.destinationPhase;

      cy.wrap(destinationPhase).as('destinationPhaseTitle');
    });

    cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
      getPhaseColumnByTitle(destinationPhaseTitle)
        .invoke('attr', 'data-testid')
        .then((dataTestId) => {
          const destinationStepId = Number(dataTestId.replace('phase-column-', ''));
          cy.wrap(destinationStepId).as('destinationStepId');
        });
    });

    cy.contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
      .closest('[data-testid^="candidate-card-"]')
      .as('candidateCardBeforeDrag');

    cy.get('@candidateCardBeforeDrag')
      .invoke('attr', 'data-testid')
      .then((dataTestId) => {
        const candidateId = Number(dataTestId.replace('candidate-card-', ''));
        cy.wrap(candidateId).as('candidateId');
      });

    cy.get('@candidateCardBeforeDrag')
      .invoke('attr', 'data-application-id')
      .then((applicationId) => {
        cy.wrap(Number(applicationId)).as('applicationId');
      });

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
        cy.dragCandidateToPhase(
          this.e2eData.candidateName,
          sourcePhaseTitle,
          destinationPhaseTitle,
        );
      });
    });

    cy.wait('@updateCandidateStage').then((interception) => {
      expect(interception.request.method).to.equal('PUT');

      cy.get('@candidateId').then((candidateId) => {
        expect(interception.request.url).to.match(new RegExp(`/candidates/${candidateId}$`));
      });

      cy.get('@applicationId').then((applicationId) => {
        expect(interception.request.body.applicationId).to.equal(applicationId);
      });

      cy.get('@destinationStepId').then((destinationStepId) => {
        expect(interception.request.body.currentInterviewStep).to.equal(destinationStepId);
      });

      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      getPhaseColumnByTitle(sourcePhaseTitle)
        .contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
        .should('not.exist');
    });

    cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
      getPhaseColumnByTitle(destinationPhaseTitle)
        .contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
        .should('be.visible');
    });

    cy.contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
      .should('have.length', 1);

      cy.reload();

      cy.openPositionPipeline(this.e2eData.positionTitle);

      cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
        getPhaseColumnByTitle(destinationPhaseTitle)
          .contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
          .should('be.visible');
      });

      cy.contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
        .should('have.length', 1);
  });

  it('hace rollback visual cuando falla la actualización backend', function () {
    cy.intercept('PUT', '**/candidates/*', {
      statusCode: 500,
      body: {
        message: 'Error updating candidate stage',
        errorCode: 'UPDATE_CANDIDATE_STAGE_FAILED',
      },
    }).as('updateCandidateStageFail');

    cy.openPositionPipeline(this.e2eData.positionTitle);

    captureCandidateCurrentPhase(this.e2eData.candidateName, 'sourcePhaseTitle');

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      const destinationPhase = sourcePhaseTitle === this.e2eData.destinationPhase
        ? this.e2eData.fallbackDestinationPhase
        : this.e2eData.destinationPhase;

      cy.wrap(destinationPhase).as('destinationPhaseTitle');
    });

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
        cy.dragCandidateToPhase(
          this.e2eData.candidateName,
          sourcePhaseTitle,
          destinationPhaseTitle,
        );
      });
    });

    cy.wait('@updateCandidateStageFail')
      .its('response.statusCode')
      .should('equal', 500);

    cy.get('[data-testid="drag-update-error"]').should('be.visible');

    cy.get('@sourcePhaseTitle').then((sourcePhaseTitle) => {
      getPhaseColumnByTitle(sourcePhaseTitle)
        .contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
        .should('be.visible');
    });

    cy.get('@destinationPhaseTitle').then((destinationPhaseTitle) => {
      getPhaseColumnByTitle(destinationPhaseTitle)
        .contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
        .should('not.exist');
    });

    cy.contains('[data-testid^="candidate-name-"]', this.e2eData.candidateName)
      .should('have.length', 1);
  });
});
