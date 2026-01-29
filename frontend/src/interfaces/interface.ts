export type Priority = 'ASAP' | 'SOON' | 'SOMETIME_IN_FUTURE';

export interface CreatePost {
    title: string;
    description: string;
    priority: Priority;
    deadline: string | null;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    deadline: string | null;
}