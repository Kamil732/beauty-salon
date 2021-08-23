import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useId } from 'react-id-generator'

import FormControl from '../../../../../layout/forms/FormControl'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'
import FormGroup from '../../../../../layout/forms/FormGroup'

export const options = [
	{
		name: 'Dzień',
		id: 0,
	},
	{
		name: 'Tydzień',
		id: 1,
	},
	{
		name: 'Miesiąc',
		id: 2,
	},
	{
		name: 'Rok',
		id: 3,
	},
]

const REPEAPT_TYPES = [0, 1]

function RepeatEventInput({
	value,
	resources,
	eventStartDate,
	updateValue,
	...props
}) {
	const [repeatType, setRepeatType] = useState(REPEAPT_TYPES[0])
	const [repeatTimesId] = useId(1, 'repeat-times-')
	const [repeatEndId] = useId(1, 'repeat-end-')

	return (
		<FormGroup wrap>
			<FormControl
				style={{
					fontSize: '0.8em',
					userSelect: 'none',
					marginRight: '1rem',
				}}
			>
				<label
					style={{
						marginLeft: 'auto',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '0.2rem',
					}}
				>
					<input
						type="radio"
						checked={repeatType === REPEAPT_TYPES[0]}
						onChange={() => setRepeatType(REPEAPT_TYPES[0])}
					/>{' '}
					Liczba wystąpień
				</label>
				<label
					style={{
						marginLeft: '1rem',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '0.2rem',
					}}
					className="icon-container"
				>
					<input
						type="radio"
						checked={repeatType === REPEAPT_TYPES[1]}
						onChange={() => setRepeatType(REPEAPT_TYPES[1])}
					/>{' '}
					Data zakończenia
				</label>
			</FormControl>

			<FormGroup style={{ margin: '0' }}>
				<FormControl style={{ width: '8em' }}>
					<FormControl.Label
						htmlFor={repeatTimesId}
						inputValue={value.repeatTimes}
					>
						Powtarzaj co
					</FormControl.Label>
					<FormControl.Input
						required
						id={repeatTimesId}
						type="number"
						value={value.repeatTimes}
						onChange={(e) =>
							updateValue('repeatTimes', e.target.value)
						}
						min="1"
					/>
				</FormControl>

				<FormControl style={{ width: '10em' }}>
					<Dropdown
						required
						value={value.unit}
						getOptionLabel={(option) => option.name}
						getOptionValue={(option) => option.id}
						getValuesValue={(option) => option.id}
						onChange={(option) => updateValue('unit', option)}
						options={options}
						{...props}
					/>
				</FormControl>

				{repeatType === REPEAPT_TYPES[0] ? (
					<FormControl style={{ width: '10em' }}>
						<FormControl.Label
							htmlFor={repeatEndId}
							inputValue={value.appearancesNum}
						>
							Liczba wystąpień
						</FormControl.Label>
						<FormControl.Input
							required
							id={repeatEndId}
							type="number"
							value={value.appearancesNum}
							onChange={(e) =>
								updateValue('appearancesNum', e.target.value)
							}
							min="1"
						/>
					</FormControl>
				) : (
					<FormControl style={{ width: '10em' }}>
						<FormControl.Label
							htmlFor={repeatEndId}
							inputValue={value.endDate != null}
						>
							Data zakończenia
						</FormControl.Label>
						<FormControl.DatePicker
							required
							id={repeatEndId}
							value={value.endDate}
							onChange={(date) => updateValue('endDate', date)}
							minDate={eventStartDate}
						/>
					</FormControl>
				)}
			</FormGroup>
		</FormGroup>
	)
}

RepeatEventInput.prototype.propTypes = {
	value: PropTypes.shape({
		repeatTimes: PropTypes.number.isRequired,
		unit: PropTypes.object.isRequired,
		appearancesNum: PropTypes.number.isRequired,
		endDate: PropTypes.instanceOf(Date).isRequired,
	}),
	eventStartDate: PropTypes.instanceOf(Date).isRequired,
	updateValue: PropTypes.func.isRequired,
}

export default RepeatEventInput
