import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const ScheduleTableCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="tableId" label="ID таблицi" />
                <TextInput source="groupRowIndex" label="Номер рядка на якому назва групп" />
                <TextInput
                    label="Номер рядка з якого починается розклад на понедiлок"
                    source="Monday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на вiвторок"
                    source="Tuesday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на середу"
                    source="Wednesday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на четвер"
                    source="Thursday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на п'ятницю"
                    source="Friday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на суботу"
                    source="Saturday"
                />
            </SimpleForm>
        </Create>
    );
};

export default ScheduleTableCreate;
