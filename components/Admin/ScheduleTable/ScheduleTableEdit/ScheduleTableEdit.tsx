import React from "react";
import { Edit, SimpleForm, TextInput, useEditController, useNotify } from "react-admin";

const ScheduleTableEdit = () => {
    const controller = useEditController();
    const { record: originalRecord, isLoading, error, refetch } = controller;
    const notify = useNotify();

    let indexBeginningDaysOfWeekInTable;
    try {
        indexBeginningDaysOfWeekInTable = JSON.parse(
            originalRecord?.indexBeginningDaysOfWeekInTable
        );
    } catch (error) {
        if (error instanceof Error) {
            notify(`Щось пiшло не так ${error.message}`, { type: "error" });
        }
    }

    const record = {
        ...originalRecord,
        Monday: indexBeginningDaysOfWeekInTable?.Monday,
        Tuesday: indexBeginningDaysOfWeekInTable?.Tuesday,
        Wednesday: indexBeginningDaysOfWeekInTable?.Wednesday,
        Thursday: indexBeginningDaysOfWeekInTable?.Thursday,
        Friday: indexBeginningDaysOfWeekInTable?.Friday,
        Saturday: indexBeginningDaysOfWeekInTable?.Saturday,
    };

    return (
        <Edit>
            <SimpleForm record={record}>
                <TextInput source="tableId" label="ID таблицi" />
                <TextInput
                    source="groupRowIndex"
                    label="Номер рядка на якому назва групп -1 (вiдняти 1)"
                />
                <TextInput
                    source="Monday"
                    label="Номер рядка з якого починаеться понедiлок -1 (вiдняти 1)"
                />
                <TextInput
                    source="Tuesday"
                    label="Номер рядка з якого починаеться вiвторок -1 (вiдняти 1)"
                />
                <TextInput
                    source="Wednesday"
                    label="Номер рядка з якого починаеться середа -1 (вiдняти 1)"
                />
                <TextInput
                    source="Thursday"
                    label="Номер рядка з якого починаеться четвер -1 (вiдняти 1)"
                />
                <TextInput
                    source="Friday"
                    label="Номер рядка з якого починаеться п'ятниця -1 (вiдняти 1)"
                />
                <TextInput
                    source="Saturday"
                    label="Номер рядка з якого починаеться суботу -1 (вiдняти 1)"
                />
            </SimpleForm>
        </Edit>
    );
};

export default ScheduleTableEdit;
