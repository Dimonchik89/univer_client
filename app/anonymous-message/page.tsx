import React from "react";
import Wrapper from "../../components/Wrapper/Wrapper";
import { getDecodedUserFromCookies } from "../../utils/auth.server";
import AnonymousMessageForm from "../../components/AnonymousMessage/AnonymousMessageForm/AnonymousMessageForm";

const page = async () => {
    const decode = await getDecodedUserFromCookies();

    return (
        <Wrapper decodeToken={decode}>
            <AnonymousMessageForm />
        </Wrapper>
    );
};

export default page;
