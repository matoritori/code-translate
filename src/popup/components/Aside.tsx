import { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>

export function Aside(props: Props) {
	const { children, className, ...other } = props

	return (
		<aside className={`text-sm ${className ?? ''}`} {...other}>
			{children}
		</aside>
	)
}
