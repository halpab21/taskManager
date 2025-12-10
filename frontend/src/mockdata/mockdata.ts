const mockdata = [
    {
        id: 1,
        title: 'Einkaufen gehen',
        description: 'Milch, Eier, Brot und Obst besorgen',
        completed: false,
        createdAt: '2025-12-01T09:15:00.000Z',
        dueDate: '2025-12-03T18:00:00.000Z',
        priority: 'medium'
    },
    {
        id: 2,
        title: 'Projektbericht fertigstellen',
        description: 'Abschnitt Einleitung und Ergebnisdarstellung überarbeiten',
        completed: false,
        createdAt: '2025-11-25T14:30:00.000Z',
        dueDate: '2025-12-10T23:59:00.000Z',
        priority: 'high'
    },
    {
        id: 3,
        title: 'Wohnung putzen',
        description: 'Staubsaugen, Bad reinigen, Müll entsorgen',
        completed: true,
        createdAt: '2025-11-28T08:00:00.000Z',
        dueDate: null,
        priority: 'low'
    },
    {
        id: 4,
        title: 'Termin beim Zahnarzt vereinbaren',
        description: 'Routinekontrolle für Januar 2026 anfragen',
        completed: false,
        createdAt: '2025-12-05T11:45:00.000Z',
        dueDate: '2026-01-15T10:00:00.000Z',
        priority: 'low'
    },
    {
        id: 5,
        title: 'Geschenk für Geburtstag besorgen',
        description: 'Kleine Aufmerksamkeit für Marie besorgen (Buch oder Gutschein)',
        completed: false,
        createdAt: '2025-12-07T16:20:00.000Z',
        dueDate: '2025-12-20T12:00:00.000Z',
        priority: 'medium'
    },
    {
        id: 6,
        title: 'Code-Review durchführen',
        description: 'Pull Request #42 prüfen und Feedback geben',
        completed: false,
        createdAt: '2025-12-08T09:00:00.000Z',
        dueDate: '2025-12-09T17:00:00.000Z',
        priority: 'high'
    }
];

export default mockdata;
