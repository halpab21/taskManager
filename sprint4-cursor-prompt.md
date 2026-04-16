# Task Manager — Sprint 4 Implementation

## Project Overview
Full-stack task manager: Spring Boot 4 backend (Java 17, PostgreSQL, JPA/Hibernate, Lombok) +
React + Vite + TypeScript frontend.

**Current architecture:**
- Backend REST: GET `/`, GET/PUT/PATCH/DELETE `/task/{id}`, POST `/task`
- Entity: `Task` (id, title, description, completed, priority[ASAP/SOON/SOMETIME_IN_FUTURE], startDate, deadline)
- Frontend: `App.tsx` (router), `Dashboard.tsx`, `Calendar.tsx`, `TaskCard.tsx`, `TaskModal.tsx`, `Sidebar.tsx`
- Tests: `TaskServiceTest` (Mockito), `TaskControllerTest` (MockMvc), `TaskServiceIT` (Testcontainers + real Postgres), Cypress E2E (`systemTests.cy.js`)
- CI/CD: `.github/workflows/testRelease.yml` — backend tests → frontend build → Cypress E2E → Docker build/push

---

## Sprint 4 User Stories

### 1. edit/delete function (2 SP)
- The user is able to edit an already existing task.
- The user is able to delete an already existing task.

**Notes:**
- Delete is already wired in the backend (`DELETE /task/{id}`) and frontend (`deleteTask`).
  Verify it works end-to-end and add any missing test coverage.
- Edit is missing from the frontend. The backend `PUT /task/{id}` already exists.
  Add an edit flow: clicking a task card opens the existing `TaskModal` pre-filled with
  the task's current values. On submit, call `PUT /task/{id}` instead of `POST /task`.
  Add an edit button (pencil icon) next to the delete button on `TaskCard`.
  Add `data-testid="edit-task-btn"` to the edit button.

### 2. more Dashboards (6 SP)
- The user is able to add more Dashboards.
- The user is able to see and use a plus (+) button in the dashboard sidebar.
- The user is able to name the Dashboards.

**Implementation:**
- Add a `Dashboard` entity to the backend: id, name. A `Task` belongs to a `Dashboard`
  (add `dashboardId: Long` to `Task` entity and `TaskDTO`, nullable for backwards compatibility —
  tasks without a dashboardId belong to the default dashboard).
- New REST endpoints:
  - `GET /dashboards` — list all dashboards
  - `POST /dashboard` — create a dashboard (body: `{ "name": "..." }`)
  - `DELETE /dashboard/{id}` — delete dashboard and its tasks
  - `GET /dashboard/{id}/tasks` — get tasks for a specific dashboard
- Frontend: In `Sidebar.tsx`, add a list of dashboards below the existing nav links,
  with a `+` button (`data-testid="add-dashboard-btn"`) to create a new one (inline name input).
  Each dashboard name in the sidebar is a nav link navigating to `/dashboard/:id`.
  Add a new route `/dashboard/:id` that renders `Dashboard.tsx` scoped to that dashboard's tasks.
  The existing `/` route remains as the default "All Tasks" dashboard.
  Add `data-testid="dashboard-list-item"` and `data-testid="dashboard-name-input"`.

### 3. groups (9 SP)
- The user can create a group Dashboard.
- The user can see the changes from other users in that group.

**Implementation:**
- Extend the `Dashboard` entity: add `isGroup: boolean` and `shareCode: String`
  (a short random alphanumeric code generated on creation, e.g. 6 chars).
- New REST endpoints:
  - `POST /dashboard/join` — body: `{ "shareCode": "ABC123" }` — returns the matching dashboard
  - `GET /dashboard/{id}/tasks` already serves the shared task list
- Frontend: In the dashboard creation flow, add a toggle "Make this a group dashboard".
  If group, after creation show the `shareCode` so the user can share it with others.
  Add a "Join group" button (`data-testid="join-group-btn"`) in the sidebar that prompts
  for a share code and navigates to that dashboard.
- For real-time updates: implement polling — every 5 seconds, re-fetch tasks for the
  current dashboard if it is a group dashboard (`setInterval` in a `useEffect`, clear on unmount).
  Add `data-testid="group-badge"` indicator on group dashboards in the sidebar.

### 4. theming (3 SP)
- The user is able to go into a theming menu.
- The user is able to choose custom colors.
- The user can instantly see the changes made (live preview).

**Implementation:**
- Store the theme in `localStorage` as a JSON object with at minimum these CSS variables:
  `--bg-primary`, `--bg-secondary`, `--accent-color`, `--text-primary`.
- On app load, read from `localStorage` and apply via `document.documentElement.style.setProperty`.
- Add a `ThemePanel.tsx` component: a slide-in panel (not a separate page) triggered by a
  palette icon button in the sidebar (`data-testid="open-theme-btn"`).
  Inside the panel, show a color picker for each CSS variable
  (`data-testid="color-picker-bg"`, `data-testid="color-picker-accent"`, etc.).
  Changes apply instantly (live preview) and are saved to `localStorage`.
- Add a "Reset to default" button (`data-testid="reset-theme-btn"`).
- No backend changes needed — theme is client-side only.

---

## Test Coverage — Target ≥ 90% line/branch coverage (JaCoCo)

### Before you start
Run the baseline and save a snapshot:
```bash
cd backend && mvn clean verify
cp -r backend/target/site/jacoco backend/coverage-history/$(date +%Y-%m-%d_%H-%M-%S)_before_sprint4
```
Note the line% and branch% from `backend/target/site/jacoco/index.html`.

### Backend unit tests — add to `TaskServiceTest.java`
For every new service method (dashboard CRUD, join by code, etc.):
- Happy path with mocked repository
- Not-found / null result path
- Edge case: duplicate share code, null dashboardId on task

### Backend unit tests — add to `TaskControllerTest.java`
For every new endpoint:
- 200/201 success with JSON path assertions
- 404 not-found
- 400 bad-request (invalid share code, missing name)

### Backend integration tests — add to `TaskServiceIT.java`
- Create dashboard → create tasks in it → fetch by dashboardId → assert
- Join group dashboard by share code → assert returned dashboard matches
- Delete dashboard → assert tasks are also gone
- Always clean up with `@AfterEach taskRepository.deleteAll()` + `dashboardRepository.deleteAll()`

### Frontend E2E — add to `frontend/cypress/e2e/systemTests.cy.js`
```js
describe('Edit Task', () => {
  it('should open modal pre-filled when clicking edit button', ...)
  it('should save edited task via PUT and update the card', ...)
})

describe('Multiple Dashboards', () => {
  it('should show + button in sidebar', ...)
  it('should create a named dashboard and navigate to it', ...)
  it('should show only that dashboard\'s tasks', ...)
})

describe('Group Dashboards', () => {
  it('should display share code after creating a group dashboard', ...)
  it('should join a group dashboard via share code', ...)
})

describe('Theming', () => {
  it('should open theme panel from sidebar', ...)
  it('should apply color change instantly', ...)
  it('should persist theme after page reload', ...)
  it('should reset to default theme', ...)
})
```

### After implementation
```bash
cd backend && mvn clean verify
cp -r backend/target/site/jacoco backend/coverage-history/$(date +%Y-%m-%d_%H-%M-%S)_after_sprint4
```
Compare the two snapshots in `backend/coverage-history/` — line% and branch% must be ≥ baseline.

---

## CI/CD Pipeline — update `.github/workflows/testRelease.yml`

Keep all existing jobs. Make the following changes:

### Add `coverage-gate` job after `backend-tests`:
```yaml
coverage-gate:
  runs-on: ubuntu-latest
  needs: backend-tests
  steps:
    - name: Download JaCoCo report
      uses: actions/download-artifact@v4
      with:
        name: jacoco-report
        path: jacoco-report

    - name: Enforce 85% line coverage minimum
      run: |
        awk -F',' 'NR>1 {missed+=$4; covered+=$5} END {
          pct=(covered/(missed+covered))*100;
          printf "Line coverage: %.1f%%\n", pct;
          if(pct < 85) {print "FAILED: coverage below 85%"; exit 1}
          else {print "PASSED"}
        }' jacoco-report/jacoco.csv
```

### Update `cypress-e2e` job's `needs`:
```yaml
needs: [coverage-gate, frontend-build]
```

### Final pipeline order:
`backend-tests` → `coverage-gate` → (in parallel) `frontend-build`  
Both → `cypress-e2e` → `docker-build`

---

## Definition of Done
- [ ] Edit task: pre-filled modal opens, PUT is called, card updates in place
- [ ] Delete task: existing functionality confirmed with test coverage
- [ ] Multiple dashboards: create, name, navigate, tasks scoped per dashboard
- [ ] Group dashboards: share code generated, join by code works, polling refreshes tasks every 5s
- [ ] Theming: panel opens, color pickers apply live, persists in localStorage, resets to default
- [ ] `mvn clean verify` passes; line coverage ≥ 90% (or ≥ baseline if already above 90%)
- [ ] Before/after JaCoCo snapshots saved in `backend/coverage-history/`
- [ ] All new endpoints covered by unit (Mockito + MockMvc) AND integration (Testcontainers) tests
- [ ] All new UI flows covered by Cypress E2E tests with `data-testid` selectors
- [ ] GitHub Actions pipeline runs all stages; coverage gate blocks build if coverage drops below 85%
- [ ] No existing tests broken
