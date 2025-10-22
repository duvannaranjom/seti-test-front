export type TaskStatus = 'pending' | 'done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    categoryId?: string
    status: TaskStatus;
    createdAt: number;
    updatedAt: number;
}
