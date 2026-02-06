import React from "react";
import { Datagrid, List, TextField } from "react-admin";

const AdminChatList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="academicGroup.name" label="Chat name" />
            </Datagrid>
        </List>
    );
};

export default AdminChatList;
