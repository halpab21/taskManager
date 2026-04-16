const KEY = 'my-dashboard-ids';

export function getMyDashboardIds(): number[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveMyDashboardId(id: number) {
    const existing = getMyDashboardIds();
    if (!existing.includes(id)) {
        localStorage.setItem(KEY, JSON.stringify([...existing, id]));
    }
}

export function removeMyDashboardId(id: number) {
    const existing = getMyDashboardIds();
    localStorage.setItem(KEY, JSON.stringify(existing.filter(i => i !== id)));
}
