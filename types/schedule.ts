export interface Group {
    name: string;
}

export interface ScheduleResponse {
    ok: boolean;
    group: ScheduleGroup;
    schedule: Schedule;
}

export interface ScheduleGroup {
    id: number;
    name: string;
}

export interface Schedule {
    monday: Day[];
    tuesday: Day[];
    wednesday: Day[];
    thursday: Day[];
    friday: Day[];
    saturday: Day[];
}

export interface Day {
    lesson: string;
    lessonType: string;
    color: string;
    lessonNumber: number;
    link: string;
    portal: boolean;
    dayOfWeek: string;
}
