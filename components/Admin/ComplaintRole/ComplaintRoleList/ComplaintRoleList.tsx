import React from "react";
import { Datagrid, FunctionField, List, TextField } from "react-admin";

const ComplaintRoleList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" label="Посада" />
                <FunctionField
                    label="Вiдповыдальна особа"
                    render={(item) =>
                        `${item?.user?.firstName || "-"} ${item?.user?.lastName || "-"}`
                    }
                />
                <FunctionField label="Пошта" render={(item) => item?.user?.email} />
            </Datagrid>
        </List>
    );
};

export default ComplaintRoleList;
