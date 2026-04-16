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

      // Get the title of the task we're about to delete
      cy.get('[data-testid="task-title"]').first().invoke('text').then((titleToDelete) => {
        // Trigger hover so the task-actions div becomes visible (opacity: 0 -> 1)
        cy.get('[data-testid="task-card"]').first().trigger('mouseover');
        // Click delete on first task
        cy.get('[data-testid="delete-task-btn"]').first().click();

        // The deleted task's title should no longer appear
        cy.contains('[data-testid="task-card"]', titleToDelete).should('not.exist');
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

  describe('Edit Task', () => {
    it('should show edit button on task card hover', () => {
      cy.get('[data-testid="task-card"]').first().trigger('mouseover');
      cy.get('[data-testid="edit-task-btn"]').first().should('exist');
    });

    it('should open modal pre-filled when clicking edit button', () => {
      cy.get('[data-testid="task-title"]').first().invoke('text').then((originalTitle) => {
        cy.get('[data-testid="edit-task-btn"]').first().click({ force: true });
        cy.get('[data-testid="modal-overlay"]').should('be.visible');
        cy.get('[data-testid="task-title-input"]').should('have.value', originalTitle);
        cy.get('[data-testid="submit-task-btn"]').should('contain', 'Save Changes');
        cy.get('[data-testid="cancel-btn"]').click();
      });
    });

    it('should save edited task via PUT and update the card', () => {
      cy.intercept('PUT', 'http://localhost:8080/task/*').as('updateTask');

      cy.get('[data-testid="edit-task-btn"]').first().click({ force: true });
      cy.get('[data-testid="task-title-input"]').clear().type('Updated Task Title');
      cy.get('[data-testid="submit-task-btn"]').click();

      cy.wait('@updateTask').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.request.body).to.have.property('title', 'Updated Task Title');
      });

      cy.get('[data-testid="task-card"]').should('contain', 'Updated Task Title');
    });
  });

  describe('Multiple Dashboards', () => {
    it('should show the + button in the sidebar', () => {
      cy.get('[data-testid="add-dashboard-btn"]').should('be.visible');
    });

    it('should show name input after clicking +', () => {
      cy.get('[data-testid="add-dashboard-btn"]').click();
      cy.get('[data-testid="dashboard-name-input"]').should('be.visible');
    });

    it('should create a named dashboard and navigate to it', () => {
      cy.intercept('POST', 'http://localhost:8080/dashboard').as('createDashboard');

      cy.get('[data-testid="add-dashboard-btn"]').click();
      cy.get('[data-testid="dashboard-name-input"]').type('My Test Board');
      cy.contains('button', 'Create').click();

      cy.wait('@createDashboard').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.request.body).to.have.property('name', 'My Test Board');
      });

      cy.url().should('include', '/dashboard/');
      cy.get('[data-testid="dashboard-list-item"]').should('contain', 'My Test Board');
    });

    it('should show group dashboard toggle in create form', () => {
      cy.get('[data-testid="add-dashboard-btn"]').click();
      cy.get('[data-testid="group-dashboard-toggle"]').should('exist');
    });
  });

  describe('Group Dashboards', () => {
    it('should display share code after creating a group dashboard', () => {
      cy.intercept('POST', 'http://localhost:8080/dashboard').as('createDashboard');

      cy.get('[data-testid="add-dashboard-btn"]').click();
      cy.get('[data-testid="dashboard-name-input"]').type('Team Board');
      cy.get('[data-testid="group-dashboard-toggle"]').check();
      cy.contains('button', 'Create').click();

      cy.wait('@createDashboard').its('response.body.shareCode').should('have.length', 6);

      cy.get('[data-testid="group-badge"]').should('be.visible');
      cy.get('[data-testid="show-share-code-btn"]').click();
      cy.get('[data-testid="share-code-display"]').should('be.visible').invoke('text').should('have.length', 6);
    });

    it('should show join group button in sidebar', () => {
      cy.get('[data-testid="join-group-btn"]').should('be.visible');
    });

    it('should show join code input after clicking join group', () => {
      cy.get('[data-testid="join-group-btn"]').click();
      cy.get('[data-testid="join-code-input"]').should('be.visible');
    });
  });

  describe('Theming', () => {
    it('should open theme panel from sidebar', () => {
      cy.get('[data-testid="open-theme-btn"]').click();
      cy.get('[data-testid="theme-panel"]').should('be.visible');
    });

    it('should have color pickers for bg and accent', () => {
      cy.get('[data-testid="open-theme-btn"]').click();
      cy.get('[data-testid="color-picker-bg"]').should('exist');
      cy.get('[data-testid="color-picker-accent"]').should('exist');
    });

    it('should have a reset to default button', () => {
      cy.get('[data-testid="open-theme-btn"]').click();
      cy.get('[data-testid="reset-theme-btn"]').should('be.visible').and('contain', 'Reset');
    });

    it('should persist theme in localStorage after applying', () => {
      cy.get('[data-testid="open-theme-btn"]').click();
      // Use the native HTMLInputElement value setter so React's synthetic onChange fires
      cy.get('[data-testid="color-picker-accent"]').then(($el) => {
        const win = $el[0].ownerDocument.defaultView;
        const nativeSetter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call($el[0], '#ff0000');
        $el[0].dispatchEvent(new win.Event('input', { bubbles: true }));
        $el[0].dispatchEvent(new win.Event('change', { bubbles: true }));
      });
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme-accent')).to.eq('#ff0000');
      });
    });

    it('should reset theme on reset button click', () => {
      cy.get('[data-testid="open-theme-btn"]').click();
      cy.get('[data-testid="reset-theme-btn"]').click();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme-bg')).to.eq('#0f0a19');
      });
    });
  });
});