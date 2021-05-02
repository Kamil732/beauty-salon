import store from '../redux/store'

const getWorkHours = (weekDay, converted = true) => {
	const {
		[process.env.REACT_APP_START_WORK_MONDAY]: start_work_monday,
		[process.env.REACT_APP_END_WORK_MONDAY]: end_work_monday,
		[process.env.REACT_APP_START_WORK_TUESDAY]: start_work_tuesday,
		[process.env.REACT_APP_END_WORK_TUESDAY]: end_work_tuesday,
		[process.env.REACT_APP_START_WORK_WEDNESDAY]: start_work_wednesday,
		[process.env.REACT_APP_END_WORK_WEDNESDAY]: end_work_wednesday,
		[process.env.REACT_APP_START_WORK_THURSDAY]: start_work_thursday,
		[process.env.REACT_APP_END_WORK_THURSDAY]: end_work_thursday,
		[process.env.REACT_APP_START_WORK_FRIDAY]: start_work_friday,
		[process.env.REACT_APP_END_WORK_FRIDAY]: end_work_friday,
		[process.env.REACT_APP_START_WORK_SATURDAY]: start_work_saturday,
		[process.env.REACT_APP_END_WORK_SATURDAY]: end_work_saturday,
		[process.env.REACT_APP_START_WORK_SUNDAY]: start_work_sunday,
		[process.env.REACT_APP_END_WORK_SUNDAY]: end_work_sunday,
	} = store.getState().data.data

	let isNonWorkingHour = false
	let start, end

	switch (weekDay) {
		case 'poniedziałek':
			if (!start_work_monday) isNonWorkingHour = true
			else {
				start = start_work_monday
				end = end_work_monday
			}
			break
		case 'wtorek':
			if (!start_work_tuesday) isNonWorkingHour = true
			else {
				start = start_work_tuesday
				end = end_work_tuesday
			}
			break
		case 'środa':
			if (!start_work_wednesday) isNonWorkingHour = true
			else {
				start = start_work_wednesday
				end = end_work_wednesday
			}
			break

		case 'czwartek':
			if (!start_work_thursday) isNonWorkingHour = true
			else {
				start = start_work_thursday
				end = end_work_thursday
			}
			break
		case 'piątek':
			if (!start_work_friday) isNonWorkingHour = true
			else {
				start = start_work_friday
				end = end_work_friday
			}
			break
		case 'sobota':
			if (!start_work_saturday) isNonWorkingHour = true
			else {
				start = start_work_saturday
				end = end_work_saturday
			}
			break
		case 'niedziela':
			if (!start_work_sunday) isNonWorkingHour = true
			else {
				start = start_work_sunday
				end = end_work_sunday
			}
			break
		default:
			isNonWorkingHour = true
			break
	}

	if (converted && !isNonWorkingHour) {
		start =
			parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1])
		end = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1])
	}

	return {
		start,
		end,
		isNonWorkingHour,
	}
}

export default getWorkHours
