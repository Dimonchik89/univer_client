"use client";

import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useProfileFromCache } from "../../utils/query/profile-query-cache";
import NotEnter from "../NotEnter/NotEnter";
import UpdateProfileModal from "../Modal/UpdateProfileModal/UpdateProfileModal";
import PushSubscriptionComponent from "../PushSubscriptionComponent/PushSubscriptionComponent";
import { ProfileContext } from "../Wrapper/Wrapper";
import UniversityEventList from "../UniversityEvent/UniversityEventList/UniversityEventList";
import EventModal from "../Modal/EventModal/EventModal";
import { UniversityEvent } from "../../types/event";
import { useDayEvents } from "../../utils/query/event-query";

interface ProfileBodyProps {
    decodeToken: { id: string };
}

const ProfileBody = ({ decodeToken }: ProfileBodyProps) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // const profile = useProfileFromCache();
    const profile = useContext(ProfileContext);

    // -----------------------------

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

    // --------------------------------

    if (!profile) {
        return <NotEnter />;
    }

    return (
        <div className="flex flex-col items-center p-6">
            <Card className="w-full mx-auto max-w-xl rounded-2xl shadow-lg border border-gray-200 bg-white">
                <CardContent className="flex flex-col gap-6 p-6">
                    <div className="flex items-center gap-4">
                        <Avatar src={profile?.avatarUrl || ""} sx={{ width: 80, height: 80 }} />
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {profile?.firstName} {profile?.lastName}
                            </h2>
                            <p className="text-gray-500 long-text-3">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">Рол</h3>
                            <ul className="mt-2 list-disc list-inside text-gray-600">
                                {profile?.roles.map((role) => (
                                    <li key={role.id}>{role.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">Групи</h3>
                            <ul className="mt-2 list-disc list-inside text-gray-600">
                                {profile?.academic_groups.map((group) => (
                                    <li key={group.id}>{group.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button className="button-primary" onClick={handleOpen}>
                        Редагувати профіль
                    </button>
                </CardContent>
            </Card>
            <PushSubscriptionComponent id={decodeToken?.id || null} />

            {/* ----------------------------------------- */}
            <div className="mx-auto mt-3">
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
            {/* ----------------------------------------- */}

            <UpdateProfileModal handleClose={handleClose} isOpen={open} profile={profile} />
        </div>
    );
};

export default ProfileBody;
