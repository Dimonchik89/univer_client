import SigninWrapper from '../../components/Wrapper/SigninWrapper/SigninWrapper';
import { getDecodedUserFromCookies } from '../../utils/auth.server';
import Wrapper from '../../components/Wrapper/Wrapper';

const LoginPage = async () => {
	const decode = await getDecodedUserFromCookies();

	return (
		<Wrapper decodeToken={decode}>
			<SigninWrapper/>
		</Wrapper>
	);
}

export default LoginPage;
