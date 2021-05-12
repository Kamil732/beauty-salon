import moment from 'moment'
import Button from '../../../../layout/buttons/Button'

function MonthDateHeader({ freeSlots, date, label, onDrillDown }) {
	freeSlots = freeSlots[moment(date).format('YYYY-MM-DD')]

	return (
		<div>
			<Button extraSmall center role="cell" onClick={onDrillDown}>
				{label}
			</Button>{' '}
			{freeSlots > 0 && <h5>({freeSlots})</h5>}
		</div>
	)
}

export default MonthDateHeader
