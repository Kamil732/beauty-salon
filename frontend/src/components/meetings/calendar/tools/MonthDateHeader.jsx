import moment from 'moment'
import { useEffect, useState } from 'react'
import Button from '../../../../layout/buttons/Button'

function MonthDateHeader({
	freeSlots,
	date,
	label,
	drilldownView,
	onDrillDown,
}) {
	const [freeHours, setFreeHours] = useState(0)

	useEffect(
		() => setFreeHours(freeSlots[moment(date).format('YYYY-MM-DD')]),
		[date, freeSlots]
	)

	return (
		<>
			<Button extraSmall center role="cell" onClick={onDrillDown}>
				{label}
			</Button>{' '}
			{freeHours > 0 && `(${freeHours})`}
		</>
	)
}

export default MonthDateHeader
