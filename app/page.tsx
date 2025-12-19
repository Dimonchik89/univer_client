import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import Wrapper from '../components/Wrapper/Wrapper';
import { getDecodedUserFromCookies } from '../utils/auth.server';


export default async function Home() {
	const decode = await getDecodedUserFromCookies();

	return (
		<Wrapper decodeToken={decode}>
			<div className="flex min-h-screen items-center justify-center">
			<h1>Main</h1>
			</div>
		</Wrapper>
	);
}
