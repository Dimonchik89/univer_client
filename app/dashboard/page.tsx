import { getDecodedUserFromCookies } from "../../utils/auth.server";
import Wrapper from "../../components/Wrapper/Wrapper";
import NotEnter from "../../components/NotEnter/NotEnter";

const Dashboard = async () => {
    const decode = await getDecodedUserFromCookies();

    return (
        <Wrapper decodeToken={decode}>
            <h2>Dashboard</h2>
        </Wrapper>
    );
};
export default Dashboard;
