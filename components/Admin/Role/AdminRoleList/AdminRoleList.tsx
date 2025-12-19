import React from "react";
import { Datagrid, List, TextField } from "react-admin";

const AdminRoleList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" label="Назва" />
            </Datagrid>
        </List>
    );
};

export default AdminRoleList;
