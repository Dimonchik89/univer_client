import SignupWrapper from '../../components/Wrapper/SignupWrapper/SignupWrapper'
import Wrapper from '../../components/Wrapper/Wrapper'
import { getDecodedUserFromCookies } from '../../utils/auth.server'

const page = async () => {
	const decode = await getDecodedUserFromCookies();

	return (
		<Wrapper decodeToken={decode}>
			<SignupWrapper/>
		</Wrapper>
	)
}

export default page