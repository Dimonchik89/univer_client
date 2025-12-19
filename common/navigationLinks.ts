import { Calendar, Home, LucideProps, User, MailCheck } from 'lucide-react';

export interface NavigationLink {
	name: string;
	path: string;
	Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export const navigationLinks: NavigationLink[] = [
	{
		name: "Події",
		path: "/events",
		Icon: Calendar
	},
	{
		name: "Підписатися",
		path: "/dashboard",
		Icon: MailCheck
	},
	{
		name: "Профiль",
		path: "/profile",
		Icon: User
	}
]