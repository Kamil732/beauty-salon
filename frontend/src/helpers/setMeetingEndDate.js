import moment from 'moment'

function setMeetingEndDate(
	prevState,
	state,
	startDate,
	calendarStep,
	changeEndDate
) {
	if (
		prevState.services.length !== state.services.length ||
		(prevState.blocked !== state.blocked && prevState.blocked)
	) {
		changeEndDate(
			moment(startDate).add(
				state.services.length === 0
					? calendarStep
					: state.services.reduce(
							(prev, { barber, value: { id, time } }) => {
								time =
									barber?.services_data.find(
										({ service }) => service === id
									)?.time || time

								return prev + time
							},
							0
					  ),
				'minutes'
			)
		)
	}

	if (prevState.blocked !== state.blocked && !prevState.blocked)
		changeEndDate(moment(startDate).add(calendarStep, 'minutes'))
}

export default setMeetingEndDate
