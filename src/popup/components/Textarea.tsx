import { PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<
	React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
>

type Props = BaseProps & {
	forExample?: boolean
}

export function Textarea(props: Props) {
	const { className, forExample, ...other } = props

	return (
		<textarea
			className={`
				block

				border
				border-gray-700
				dark:border-gray-400

				${forExample ? 'bg-gray-200 dark:bg-black' : 'dark:bg-gray-900'}

				rounded-sm

				resize

				font-mono

				p-1

				${className ?? ''}
			`}
			{...other}
		/>
	)
}
