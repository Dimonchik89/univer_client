import React from "react";
import { CreateButton, Datagrid, ExportButton, List, TextField, TopToolbar } from "react-admin";
import ScheduleUpdateButton from "../ScheduleUpdateButton/ScheduleUpdateButton";

const ScheduleTableListAction = () => (
    <TopToolbar>
        <ScheduleUpdateButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const ScheduleTableList = () => {
    return (
        <List actions={<ScheduleTableListAction />}>
            <Datagrid rowClick="edit">
                <TextField label="ID таблицi" source="tableId" />
                <TextField
                    label="Номер рядка на якому назва групп -1 (вiдняти 1)"
                    source="groupRowIndex"
                />
                {/* <TextField label="Номер рядка з якого починаеться понедiлок -1 (вiдняти 1)" source="Monday" />
                <TextField label="Номер рядка на якому назва групп" source="Tuesday" />
                <TextField label="Номер рядка на якому назва групп" source="Wednesday" />
                <TextField label="Номер рядка на якому назва групп" source="Thursday" />
                <TextField label="Номер рядка на якому назва групп" source="Friday" />
                <TextField label="Номер рядка на якому назва групп" source="Saturday" /> */}
            </Datagrid>
        </List>
    );
};

export default ScheduleTableList;
