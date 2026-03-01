import React from "react";
import { Datagrid, List, TextField } from "react-admin";

const AcademicGroupList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" label="Назва" />
            </Datagrid>
        </List>
    );
};

export default AcademicGroupList;
