import React from "react";
import { Datagrid, FunctionField, List, TextField } from "react-admin";
import { UniversityEvent } from "../../../../types/event";

const AdminEventList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField label="Заголовок" source="title" />
                <TextField label="Повiдомлення" source="message" />
                <TextField label="Локацiя" source="location" />
                <TextField label="Посилання" source="registrationLink" />
                <FunctionField
                    label="Час проведення"
                    render={(item: UniversityEvent) => {
                        const localDate = new Date(item.scheduledAt);
                        return localDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                    }}
                />
                <FunctionField
                    label="Ролi"
                    render={(item: UniversityEvent) => item.roles.map((el) => el.name).join(", ")}
                />
                <FunctionField
                    label="Групи"
                    render={(item: UniversityEvent) =>
                        item.academic_groups.map((el) => el.name).join(", ")
                    }
                />
            </Datagrid>
        </List>
    );
};

export default AdminEventList;
