type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>

export function Hr(props: Props) {
	const { className, ...other } = props

	return (
		<hr
			className={`
                my-2
                -mx-3 ${/* コンテナのmargin:8px;をちょっと打ち消す */ ''}
				border-slate-500
				dark:border-slate-400
                ${className}
            `}
			{...other}
		/>
	)
}
