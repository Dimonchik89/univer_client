import ProfileBody from "../../components/ProfileBody/ProfileBody";
import NotEnter from "../../components/NotEnter/NotEnter";
import Wrapper from "../../components/Wrapper/Wrapper";
import { getDecodedUserFromCookies } from "../../utils/auth.server";

const ProfilePage = async () => {
    const decode = await getDecodedUserFromCookies();
    return (
        <Wrapper decodeToken={decode}>
            {decode ? <ProfileBody decodeToken={decode} /> : <NotEnter />}
        </Wrapper>
    );
};

export default ProfilePage;
