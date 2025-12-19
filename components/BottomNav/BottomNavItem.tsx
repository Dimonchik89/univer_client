import React from 'react'
import { NavigationLink } from '../../common/navigationLinks'
import Link from 'next/link'
import clsx from "clsx"

interface BottomNavItemProps extends NavigationLink {
	pathname: string;
}

const BottomNavItem = ({ Icon, name, path, pathname }: BottomNavItemProps) => {
	return (
		<Link
			href={path}
			className="flex flex-col items-center text-green-600"
		>
			<Icon size={22} className={clsx({
				"fill-green-600 stroke-white": pathname === path
			})}/>
			<span className="text-xs">{name}</span>
		</Link>
	)
}

export default BottomNavItem