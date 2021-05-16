import store from '../redux/store'

const getWorkHours = (weekDay, converted = true) => {
	const {
		start_work_monday,
		end_work_monday,
		start_work_tuesday,
		end_work_tuesday,
		start_work_wednesday,
		end_work_wednesday,
		start_work_thursday,
		end_work_thursday,
		start_work_friday,
		end_work_friday,
		start_work_saturday,
		end_work_saturday,
		start_work_sunday,
		end_work_sunday,
	} = store.getState().data.cms.data

	let isNonWorkingDay = false
	let start,
		end = ['', '']

	switch (weekDay) {
		case 1:
			if (!start_work_monday || !end_work_monday) isNonWorkingDay = true
			else {
				start = start_work_monday
				end = end_work_monday
			}
			break
		case 2:
			if (!start_work_tuesday || !end_work_tuesday) isNonWorkingDay = true
			else {
				start = start_work_tuesday
				end = end_work_tuesday
			}
			break
		case 3:
			if (!start_work_wednesday || !end_work_wednesday)
				isNonWorkingDay = true
			else {
				start = start_work_wednesday
				end = end_work_wednesday
			}
			break

		case 4:
			if (!start_work_thursday || !end_work_thursday)
				isNonWorkingDay = true
			else {
				start = start_work_thursday
				end = end_work_thursday
			}
			break
		case 5:
			if (!start_work_friday || !end_work_friday) isNonWorkingDay = true
			else {
				start = start_work_friday
				end = end_work_friday
			}
			break
		case 6:
			if (!start_work_saturday || !end_work_saturday)
				isNonWorkingDay = true
			else {
				start = start_work_saturday
				end = end_work_saturday
			}
			break
		case 7:
			if (!start_work_sunday || !end_work_sunday) isNonWorkingDay = true
			else {
				start = start_work_sunday
				end = end_work_sunday
			}
			break
		default:
			isNonWorkingDay = true
			break
	}

	if (converted && !isNonWorkingDay) {
		start =
			parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1])
		end = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1])
	}

	return {
		start,
		end,
		isNonWorkingDay,
	}
}

export default getWorkHours
