import { PropsWithChildren, DetailedHTMLProps, AnchorHTMLAttributes } from 'react'

type Props = PropsWithChildren<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>

export function Link(props: Props) {
	const { children, className, ...other } = props
	return (
		<a
			className={`
            text-blue-500
            hover:text-blue-400

			dark:text-blue-300
			dark:hover:text-blue-200
			
            hover:underline
            
            ${className ?? ''}`}
			{...other}
		>
			{children}
		</a>
	)
}
