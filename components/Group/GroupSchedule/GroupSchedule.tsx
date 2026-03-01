"use client";
import React, { useState } from "react";
import { Schedule } from "../../../types/schedule";
import { useSearchParams } from "next/navigation";

const order = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
};

type WeekType = "red" | "green" | "black";

interface Props {
    groupName: string;
    schedule: Schedule;
}

function getCurrentWeekType(): WeekType {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = Math.floor((+now - +start) / (1000 * 60 * 60 * 24));
    const week = Math.ceil((diff + start.getDay() + 1) / 7);
    return week % 2 === 0 ? "red" : "green";
}

const dayNames: Record<keyof Schedule, string> = {
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П'ятниця",
    saturday: "Субота",
};
const GroupSchedule = ({ groupName, schedule }: Props) => {
    const [weekType, setWeekType] = useState<WeekType>(getCurrentWeekType());

    let days = Object.keys(schedule) as (keyof Schedule)[];
    days = days.sort((a, b) => order[a] - order[b]);

    const getLesson = (day: keyof Schedule, lessonNumber: number) => {
        const lesson = schedule[day]?.filter((l) => l.lessonNumber === lessonNumber);

        if (!lesson.length) return null;

        return (
            lesson.find((item) => item.color === weekType) ||
            lesson.find((item) => item.color === "black")
        );
    };

    const lastPair = Math.max(
        0,
        ...days.flatMap((day) => schedule[day].map((item) => item.lessonNumber))
    );
    console.log("schedule", schedule);

    return (
        <div className="wrapper">
            <h1 className="title">📅 Розклад — {groupName}</h1>

            <div className="week-toggle">
                <button
                    className={weekType === "red" ? "active red" : ""}
                    onClick={() => setWeekType("red")}
                >
                    🔴 Красная
                </button>
                <button
                    className={weekType === "green" ? "active green" : ""}
                    onClick={() => setWeekType("green")}
                >
                    🟢 Зеленая
                </button>
            </div>

            <div className={`week-indicator`}>
                {getCurrentWeekType() === "red" ? "🔴 Красная неделя" : "🟢 Зеленая неделя"}
            </div>

            <div className="table">
                <div className="cell header empty"></div>
                {days.map((day) => (
                    <div key={`day-${day}`} className="cell header">
                        {dayNames[day]}
                    </div>
                ))}

                {/* Rows */}
                {Array.from({ length: lastPair + 1 }).map((_, index) => {
                    const lessonNumber = index + 1;

                    return (
                        <React.Fragment key={`num-${lessonNumber}`}>
                            <div className="cell number">{lessonNumber}</div>

                            {days.map((day) => {
                                const lesson = getLesson(day, lessonNumber);

                                return (
                                    <div
                                        key={`${day}-${lessonNumber}`}
                                        className={`cell lesson ${lesson?.color || ""}`}
                                    >
                                        {lesson && (
                                            <>
                                                <div className="lesson-title">{lesson.lesson}</div>
                                                {/* <div className="lesson-type">
                                                    {lesson.lessonType === "practice"
                                                        ? "практика"
                                                        : "лекція"}
                                                </div> */}
                                                {lesson?.link && (
                                                    <a
                                                        className="text-xs text-sky-500"
                                                        href={lesson.link}
                                                        target="_blank"
                                                    >
                                                        Посилання
                                                    </a>
                                                )}
                                                {lesson?.portal && (
                                                    <p className="text-xs text-yellow-500">
                                                        Портал
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default GroupSchedule;
