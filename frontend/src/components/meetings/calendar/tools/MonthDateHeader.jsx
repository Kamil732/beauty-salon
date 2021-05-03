import moment from 'moment'
import Button from '../../../../layout/buttons/Button'

function MonthDateHeader({ freeSlots, date, label, onDrillDown }) {
	const freeHours = freeSlots[moment(date).format('YYYY-MM-DD')]

	return (
		<>
			<Button extraSmall center role="cell" onClick={onDrillDown}>
				{label}
			</Button>{' '}
			{freeHours > 0 && <h5>({freeHours})</h5>}
		</>
	)
}

export default MonthDateHeader
