"use client";
import React, { useState } from "react";
import { UniversityEvent } from "../../../types/event";
import { useDayEvents } from "../../../utils/query/event-query";
import ProfileBody from "../../ProfileBody/ProfileBody";
import UniversityEventList from "../../UniversityEvent/UniversityEventList/UniversityEventList";
import EventModal from "../../Modal/EventModal/EventModal";

interface MainWrapperProps {
    decode: {
        id: string;
    };
}

const MainWrapper = ({ decode }: MainWrapperProps) => {
    const [currentDate, setCurrentDate] = useState<Date>(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    });
    const [selectedEvent, setSelectedEvent] = useState<UniversityEvent | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const { data: dayEvents, isLoading } = useDayEvents(currentDate);

    const onModalOpen = () => setOpenModal(true);
    const onModalClose = () => setOpenModal(false);

    const handleSelectEvent = async (data: UniversityEvent) => {
        setSelectedEvent(data);
        onModalOpen();
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <ProfileBody decodeToken={decode} />
            <div className="mx-auto">
                <h1 className="mb-2 text-center font-bold text-xl">
                    Події заплановані на сьогодні:
                </h1>
                <UniversityEventList dayEvents={dayEvents} handleSelectEvent={handleSelectEvent} />
            </div>
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

export default MainWrapper;
