import React from "react";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";
import { getDecodedUserFromCookies } from "../../utils/auth.server";
import Wrapper from "../../components/Wrapper/Wrapper";
import NotEnter from "../../components/NotEnter/NotEnter";

interface PageParams {
    searchParams: {
        date: Date;
    };
}

const page = async ({ searchParams }: PageParams) => {
    const decode = await getDecodedUserFromCookies();
    const { date } = await searchParams;
    console.log("searchParams", date);

    return (
        <Wrapper decodeToken={decode}>
            {decode ? <CalendarComponent searchParamsDate={date} /> : <NotEnter />}
        </Wrapper>
    );
};

export default page;
