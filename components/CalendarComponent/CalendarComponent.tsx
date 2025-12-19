"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useDayEvents, useMonthEvents } from "../../utils/query/event-query";
import Loader from "../Loader/Loader";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { UniversityEvent } from "../../types/event";
import { useRouter } from "next/navigation";
import EventModal from "../Modal/EventModal/EventModal";

import "./calendar.css";
import "react-calendar/dist/Calendar.css";
import UniversityEventList from "../UniversityEvent/UniversityEventList/UniversityEventList";

interface CalendarComponentProps {
    searchParamsDate: Date;
}

const CalendarComponent = ({ searchParamsDate }: CalendarComponentProps) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(searchParamsDate || null);
    const [month, setMonth] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const formatted = `${year}-${month}`;

        return formatted;
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UniversityEvent | null>(null);
    const router = useRouter();

    const {
        data: highlightedDays,
        isError,
        error,
        isLoading: isMonthLoading,
        refetch,
    } = useMonthEvents(month);

    const { data: dayEvents, isLoading } = useDayEvents(selectedDay);

    // ----------------------------------

    useEffect(() => {
        const dateWithUpdatedHours = currentDate.setHours(0, 0, 0, 0);
        const date = new Date(dateWithUpdatedHours);
        setSelectedDay(date);

        router.push(`/events?date=${date.toISOString()}`);
    }, []);

    // -----------------------------------

    const handleDayClick = (date: Date) => {
        const searchDate = date.toISOString();
        router.push(`/events?date=${searchDate}`);

        setSelectedDay(date);
    };

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            //   const dateString = date.toISOString().split('T')[0];
            const dateString = date.toLocaleDateString("uk-UA");
            // Если дата есть в массиве, подсвечиваем

            if (highlightedDays) {
                const formalDateArr = highlightedDays.map((item) =>
                    new Date(item).toLocaleDateString("uk-UA")
                );

                if (formalDateArr.includes(dateString)) {
                    return "highlight-day";
                }
            }
        }
        return null;
    };

    const onModalOpen = () => setOpenModal(true);
    const onModalClose = () => setOpenModal(false);

    const handleSelectEvent = async (data: UniversityEvent) => {
        // для теста задаю время на одну минуту после клика
        setSelectedEvent(data);
        onModalOpen();
    };

    useEffect(() => {
        setMonth(() => {
            const now = new Date(currentDate);
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // добавляем 0 если меньше 10
            const formatted = `${year}-${month}`;

            return formatted;
        });
    }, [currentDate]);

    if (isMonthLoading) {
        return <Loader />;
    }

    if (isError) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        } else {
            toast.error("Щось пiшло не так. Спробуйте пiзнiше");
        }
    }

    return (
        <div className="mt-4">
            <div className="flex justify-center">
                <Calendar
                    locale="uk-UA"
                    onClickDay={handleDayClick}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        if (activeStartDate) {
                            setCurrentDate(activeStartDate);
                        }
                    }}
                    tileClassName={tileClassName}
                    value={currentDate}
                    className="rounded-xl shadow-md p-4 bg-white"
                />
            </div>
            <div className="mt-3 w-full max-w-md mx-auto">
                <button className="button-primary" onClick={() => refetch()}>
                    Оновити
                </button>
            </div>

            {isLoading && <Loader />}
            {dayEvents && (
                <div className="event-list flex flex-col items-center mt-6 w-full">
                    <h3 className="text-lg font-semibold mb-3">
                        Події на обрану дату{" "}
                        {currentDate.toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                        :
                    </h3>
                    <UniversityEventList
                        dayEvents={dayEvents}
                        handleSelectEvent={handleSelectEvent}
                    />
                </div>
            )}
            <EventModal
                open={openModal}
                onClose={onModalClose}
                event={selectedEvent}
                onSaveReminder={() => {
                    // тут отправляем на сервер
                    console.log("onSaveReminder", selectedEvent);
                    onModalClose();
                }}
            />
        </div>
    );
};

export default CalendarComponent;
