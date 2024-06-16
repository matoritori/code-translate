import { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>

export function H2(props: Props) {
	const { children, className, ...other } = props
	return (
		<h2
			className={`
			text-2xl
			target:before:content-["*"]
			before:text-yellow-300
			before:bg-yellow-300
			target:before:mr-1
			
			${className ?? ''}`}
			{...other}
		>
			{children}
		</h2>
	)
}
