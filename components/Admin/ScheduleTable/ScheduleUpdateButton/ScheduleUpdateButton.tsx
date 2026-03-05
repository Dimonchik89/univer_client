import { useState } from "react";
import { Button, useDataProvider } from "react-admin";
import { CircularProgress } from "@mui/material";
import axiosInstance from "../../../../utils/axios/axios-interceptor";
import { useNotify } from "react-admin";

const ScheduleUpdateButton = () => {
    const dataProvider = useDataProvider();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const notify = useNotify();

    const handleClick = async () => {
        try {
            setLoading(true);
            setSuccess(false);

            await axiosInstance.patch("/api/schedule/parse");

            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            notify("Розклад i группи оновлено", { type: "success" });
        } catch (error) {
            if (error instanceof Error) {
                notify(`Щось пiшло не так ${error.message}`, { type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button label={loading ? "" : "Оновити розклад"} onClick={handleClick} disabled={loading}>
            {loading && <CircularProgress size={20} />}
        </Button>
    );
};
export default ScheduleUpdateButton;
