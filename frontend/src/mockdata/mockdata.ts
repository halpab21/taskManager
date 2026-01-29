import type { Task } from '../interfaces/interface';

const mockdata: Task[] = [
    {
        id: 1,
        title: 'Einkaufen gehen',
        description: 'Milch, Eier, Brot und Obst besorgen',
        completed: false,
        priority: 'SOON',
        deadline: '2025-12-03'
    },
    {
        id: 2,
        title: 'Projektbericht fertigstellen',
        description: 'Abschnitt Einleitung und Ergebnisdarstellung überarbeiten',
        completed: false,
        priority: 'ASAP',
        deadline: '2025-12-10'
    },
    {
        id: 3,
        title: 'Wohnung putzen',
        description: 'Staubsaugen, Bad reinigen, Müll entsorgen',
        completed: true,
        priority: 'SOMETIME_IN_FUTURE',
        deadline: null
    },
    {
        id: 4,
        title: 'Termin beim Zahnarzt vereinbaren',
        description: 'Routinekontrolle für Januar 2026 anfragen',
        completed: false,
        priority: 'SOMETIME_IN_FUTURE',
        deadline: '2026-01-15'
    },
    {
        id: 5,
        title: 'Geschenk für Geburtstag besorgen',
        description: 'Kleine Aufmerksamkeit für Marie besorgen (Buch oder Gutschein)',
        completed: false,
        priority: 'SOON',
        deadline: '2025-12-20'
    },
    {
        id: 6,
        title: 'Code-Review durchführen',
        description: 'Pull Request #42 prüfen und Feedback geben',
        completed: false,
        priority: 'ASAP',
        deadline: '2025-12-09'
    }
];

export default mockdata;
