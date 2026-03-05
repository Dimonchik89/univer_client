import React from "react";
import {
    AutocompleteInput,
    Edit,
    ReferenceInput,
    SimpleForm,
    TextField,
    TextInput,
} from "react-admin";

const ComplaintRoleEdit = () => {
    return (
        <Edit
            transform={(data) => ({
                ...data,
                userId: data?.userId || data?.user?.id,
            })}
        >
            <SimpleForm>
                <TextInput source="name" label="Вiдповыдальна особа" />
                <ReferenceInput source="userId" reference="user">
                    <AutocompleteInput
                        optionText={(record) =>
                            `${record?.firstName || "-"} ${record?.lastName || "-"} ${record?.email || "-"}`
                        }
                        filterToQuery={(searchText) => ({ q: searchText })}
                    />
                </ReferenceInput>
            </SimpleForm>
        </Edit>
    );
};

export default ComplaintRoleEdit;
