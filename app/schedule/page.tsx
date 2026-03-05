import React from "react";
import Wrapper from "../../components/Wrapper/Wrapper";
import { getDecodedUserFromCookies } from "../../utils/auth.server";
import { toast } from "react-toastify";
import ScheduleWrapper from "../../components/Wrapper/ScheduleWrapper/ScheduleWrapper";
import { redirect } from "next/navigation";

const SchedulePage = async ({ searchParams }: any) => {
    const resolvedSearchParams = await searchParams;
    const decode = await getDecodedUserFromCookies();

    // const groups = await fetchGroups();
    // const schedule = await fetchSchedule(resolvedSearchParams?.group);

    return (
        <Wrapper decodeToken={decode}>
            <ScheduleWrapper decodeToken={decode} />
        </Wrapper>
    );
};

export default SchedulePage;
