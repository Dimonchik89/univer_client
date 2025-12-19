"use client";
import { useState } from "react";
import { Modal, Box, Typography, Button, Stack, IconButton } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axiosInstance from "../../../utils/axios/axios-interceptor";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import "dayjs/locale/uk";
import { UniversityEvent } from "../../../types/event";
import Link from "next/link";

interface EventModalProps {
    open: boolean;
    onClose: () => void;
    event: UniversityEvent | null;
    onSaveReminder: (eventId: string, time: Date) => void;
}

const EventModal = ({ open, onClose, event, onSaveReminder }: EventModalProps) => {
    const [reminderTime, setReminderTime] = useState<Dayjs | null>(dayjs());

    if (!event) return null;

    const senderName =
        event.sender?.firstName || event.sender?.lastName
            ? `${event.sender.firstName ?? ""} ${event.sender.lastName ?? ""}`.trim()
            : null;

    const handleSave = async () => {
        if (!reminderTime) return;
        onSaveReminder(event.id, reminderTime.toDate());
        onClose();

        const obj = {
            eventId: event.id,
            reminderTime: reminderTime?.toISOString(),
        };

        try {
            const result = await axiosInstance("/api/reminder", {
                method: "POST",
                data: obj,
            });
            toast.success("Нагадування успiшно створено");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.message || "Щось пiшло не так");
            } else {
                toast.error("Щось пiшло не так");
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 4,
                    width: 400,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Box className="flex items-start justify-between mb-2">
                    <Typography variant="h6" className="leading-[1.3]!">
                        {event.title}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="body1" mb={2}>
                    {event.message}
                </Typography>

                {event.sender && (senderName || event.sender.email) && (
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                        👤 Відправник: {senderName ?? event.sender.email}
                    </Typography>
                )}

                {(event.location || event.registrationLink) && (
                    <Box mb={2}>
                        {event.location && (
                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                                📍 Аудиторія: {event.location}
                            </Typography>
                        )}

                        {event.registrationLink && (
                            <Typography variant="body2" color="text.secondary">
                                🔗 Онлайн-реєстрація:{" "}
                                <Link href={event.registrationLink} target="_blank">
                                    Перейти
                                </Link>
                            </Typography>
                        )}
                    </Box>
                )}

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Дата події: {new Date(event.scheduledAt).toLocaleString("uk-UA")}
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <DateTimePicker
                        label="Нагадати о"
                        value={reminderTime}
                        onChange={(val) => {
                            setReminderTime(val as Dayjs);
                        }}
                    />
                </LocalizationProvider>

                <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                        Скасувати
                    </Button>

                    <Button variant="contained" onClick={handleSave}>
                        Зберегти
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default EventModal;
