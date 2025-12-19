import Wrapper from "../components/Wrapper/Wrapper";
import { getDecodedUserFromCookies } from "../utils/auth.server";
import ProfileBody from "../components/ProfileBody/ProfileBody";
import NotEnter from "../components/NotEnter/NotEnter";
import UniversityEventList from "../components/UniversityEvent/UniversityEventList/UniversityEventList";
import MainWrapper from "../components/Wrapper/MainWrapper/MainWrapper";

export default async function Home() {
    const decode = await getDecodedUserFromCookies();

    return (
        <Wrapper decodeToken={decode}>
            {decode ? <MainWrapper decode={decode} /> : <NotEnter />}
        </Wrapper>
    );
}
