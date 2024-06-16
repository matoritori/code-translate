import { PropsWithChildren, DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

type Props = PropsWithChildren<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>

export function Button(props: Props) {
	const { children, className, ...other } = props
	return (
		<button
			className={`
				bg-gradient-to-b
				from-slate-100
				via-slate-100
				to-slate-200

				hover:from-slate-200
				hover:via-slate-200
				hover:to-slate-200

				active:from-slate-300
				active:via-slate-300
				active:to-slate-300
				

				dark:from-slate-600
				dark:via-slate-600
				dark:to-slate-700

				dark:hover:from-slate-500
				dark:hover:via-slate-500
				dark:hover:to-slate-600

				dark:active:from-slate-700
				dark:active:via-slate-700
				dark:active:to-slate-700

				
				border
				border-gray-500
				dark:border-gray-700

				rounded-md
				
				p-1.5
				px-4
				
				${className ?? ''}`}
			{...other}
		>
			{children}
		</button>
	)
}
