describe('Task Manager E2E Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  describe('Dashboard', () => {
    it('should display the dashboard with header and stats', () => {
      cy.get('h1').should('contain', 'Dashboard');
      cy.get('.stats-grid').should('be.visible');
      cy.get('.stat-card').should('have.length', 3);
    });

    it('should display filter buttons', () => {
      cy.get('.filter-bar').should('be.visible');
      cy.get('.filter-btn').should('have.length', 3);
      cy.get('.filter-btn').contains('All').should('have.class', 'active');
    });
  });

  describe('Create Task Flow', () => {
    it('should open modal when clicking add task button', () => {
      cy.get('[data-testid="add-task-btn"]').click();
      cy.get('[data-testid="modal-overlay"]').should('be.visible');
      cy.get('[data-testid="modal-container"]').should('be.visible');
    });

    it('should close modal when clicking cancel', () => {
      cy.get('[data-testid="add-task-btn"]').click();
      cy.get('[data-testid="modal-overlay"]').should('be.visible');
      cy.get('[data-testid="cancel-btn"]').click();
      cy.get('[data-testid="modal-overlay"]').should('not.exist');
    });

    it('should create a new task with all fields', () => {
      cy.intercept('POST', 'http://localhost:8080/task').as('createTask');

      cy.get('[data-testid="add-task-btn"]').click();
      cy.get('[data-testid="modal-overlay"]').should('be.visible');

      // Fill in the form
      cy.get('[data-testid="task-title-input"]').type('Cypress Test Task');
      cy.get('[data-testid="task-description-input"]').type('This is a test task created by Cypress');
      cy.get('[data-testid="task-priority-select"]').select('ASAP');
      cy.get('[data-testid="task-deadline-input"]').type('2026-02-15');

      // Submit the form
      cy.get('[data-testid="submit-task-btn"]').click();

      // Wait for the API call
      cy.wait('@createTask').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.request.body).to.have.property('title', 'Cypress Test Task');
        expect(interception.request.body).to.have.property('priority', 'ASAP');
      });

      // Modal should close
      cy.get('[data-testid="modal-overlay"]').should('not.exist');

      // New task should appear in the list
      cy.get('[data-testid="task-card"]').should('contain', 'Cypress Test Task');
    });

    it('should create a task with default priority', () => {
      cy.intercept('POST', 'http://localhost:8080/task').as('createTask');

      cy.get('[data-testid="add-task-btn"]').click();
      cy.get('[data-testid="task-title-input"]').type('Simple Task');
      cy.get('[data-testid="task-description-input"]').type('A simple task without priority change');
      cy.get('[data-testid="submit-task-btn"]').click();

      cy.wait('@createTask').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  describe('Task Interactions', () => {
    it('should toggle task completion', () => {
      cy.intercept('PATCH', 'http://localhost:8080/task/*/toggle').as('toggleTask');

      // Get the title of the first task before toggling
      cy.get('[data-testid="task-title"]').first().invoke('text').then((taskTitle) => {
        // Click the first task's checkbox
        cy.get('[data-testid="task-checkbox"]').first().click();

        // Find the task by its title and verify it has the completed class
        // (it may have moved due to sorting)
        cy.contains('[data-testid="task-card"]', taskTitle).should('have.class', 'task-completed');
      });
    });

    it('should delete a task', () => {
      cy.intercept('DELETE', 'http://localhost:8080/task/*').as('deleteTask');

      // Get initial count
      cy.get('[data-testid="task-card"]').then(($cards) => {
        const initialCount = $cards.length;

        // Click delete on first task
        cy.get('[data-testid="delete-task-btn"]').first().click({ force: true });

        // Should have one less task
        cy.get('[data-testid="task-card"]').should('have.length', initialCount - 1);
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should filter active tasks', () => {
      cy.get('.filter-btn').contains('Active').click();
      cy.get('.filter-btn').contains('Active').should('have.class', 'active');
    });

    it('should filter completed tasks', () => {
      cy.get('.filter-btn').contains('Completed').click();
      cy.get('.filter-btn').contains('Completed').should('have.class', 'active');
    });

    it('should show all tasks', () => {
      cy.get('.filter-btn').contains('Completed').click();
      cy.get('.filter-btn').contains('All').click();
      cy.get('.filter-btn').contains('All').should('have.class', 'active');
    });
  });

  describe('Navigation', () => {
    it('should navigate to calendar page', () => {
      cy.get('.nav-link').contains('Calendar').click();
      cy.url().should('include', '/calendar');
      cy.get('h1').should('contain', 'Calendar');
    });

    it('should navigate back to dashboard', () => {
      cy.get('.nav-link').contains('Calendar').click();
      cy.get('.nav-link').contains('Dashboard').click();
      cy.url().should('eq', 'http://localhost:5173/');
      cy.get('h1').should('contain', 'Dashboard');
    });
  });

  describe('Calendar Page', () => {
    beforeEach(() => {
      cy.get('.nav-link').contains('Calendar').click();
    });

    it('should display calendar grid', () => {
      cy.get('.calendar-grid').should('be.visible');
      cy.get('.calendar-weekday').should('have.length', 7);
    });

    it('should navigate between months', () => {
      cy.get('.current-month h2').then(($month) => {
        const currentMonth = $month.text();

        cy.get('.nav-btn').first().click(); // Previous month
        cy.get('.current-month h2').should('not.contain', currentMonth);

        cy.get('.nav-btn').last().click(); // Next month
        cy.get('.current-month h2').should('contain', currentMonth);
      });
    });

    it('should have a today button', () => {
      cy.get('.today-btn').should('be.visible').and('contain', 'Today');
    });

    it('should display upcoming deadlines sidebar', () => {
      cy.get('.calendar-sidebar').should('be.visible');
      cy.get('.calendar-sidebar h3').should('contain', 'Upcoming Deadlines');
    });
  });
});