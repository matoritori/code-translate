type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function Checkbox(props: Props) {
	const { className, ...other } = props

	return (
		<input
			type='checkbox'
			className={`
				w-5 h-5 ml-2
				${className}
			`}
			{...other}
		/>
	)
}
