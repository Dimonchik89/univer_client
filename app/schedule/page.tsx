import React from "react";
import Wrapper from "../../components/Wrapper/Wrapper";
import { getDecodedUserFromCookies } from "../../utils/auth.server";
import { toast } from "react-toastify";
import ScheduleWrapper from "../../components/Wrapper/ScheduleWrapper/ScheduleWrapper";
import { redirect } from "next/navigation";

const fetchGroups = async () => {
    try {
        // const response = await fetch("https://api.oss-tsatu.com.ua/shedule/groups", {
        //     next: {
        //         tags: ["groups"],
        //         revalidate: 120,
        //     },
        // });
        const response = await fetch("http://localhost:3005/api/academic-group?limit=200", {
            next: {
                tags: ["groups"],
                revalidate: 120,
            },
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Щось пiшло не так. Спробуйте пiзнiше. ${response.statusText}`);
        }

        return { data, error: null };
    } catch (error) {
        console.log(error);
        return { data: null, error: error?.message };
    }
};

export const fetchSchedule = async (group: string) => {
    if (!group) {
        return null;
    }

    try {
        // const response = await fetch(`https://api.oss-tsatu.com.ua/shedule/schedule/${group}`, {
        //     next: {
        //         tags: ["schedule", group],
        //         revalidate: 120,
        //     },
        // });
        const response = await fetch(`http://localhost:3005/api/schedule/${group}`, {
            next: {
                tags: ["schedule", group],
                revalidate: 120,
            },
        });

        if (!response.ok) {
            throw new Error("Щось пiшло не так. Спробуйте пiзнiше");
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: "Щось пiшло не так. Спробуйте пiзнiше" };
    }
};

const SchedulePage = async ({ searchParams }: any) => {
    const resolvedSearchParams = await searchParams;
    const decode = await getDecodedUserFromCookies();

    const groups = await fetchGroups();
    const schedule = await fetchSchedule(resolvedSearchParams?.group);

    return (
        <Wrapper decodeToken={decode}>
            <ScheduleWrapper groups={groups} schedule={schedule} decodeToken={decode} />
        </Wrapper>
    );
};

export default SchedulePage;
