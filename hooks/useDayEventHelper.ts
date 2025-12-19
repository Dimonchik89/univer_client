import { useState } from "react";
import { UniversityEvent } from "../types/event";
import { useDayEvents } from "../utils/query/event-query";

export const useDayEventHelper = () => {
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

    return {
        currentDate,
        selectedEvent,
        openModal,
        onModalOpen,
        onModalClose,
        dayEvents,
        isLoading,
        handleSelectEvent,
        setCurrentDate,
    };
};
