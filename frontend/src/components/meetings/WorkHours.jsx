import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function WorkHours({
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
}) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th></th>
					<th scope="col">Otwarcie</th>
					<th scope="col">Zamknięcie</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Poniedziałek</th>
					<td>{start_work_monday}</td>
					<td>{end_work_monday}</td>
				</tr>
				<tr>
					<th scope="row">Wtorek</th>
					<td>{start_work_tuesday}</td>
					<td>{end_work_tuesday}</td>
				</tr>
				<tr>
					<th scope="row">Środa</th>
					<td>{start_work_wednesday}</td>
					<td>{end_work_wednesday}</td>
				</tr>
				<tr>
					<th scope="row">Czwartek</th>
					<td>{start_work_thursday}</td>
					<td>{end_work_thursday}</td>
				</tr>
				<tr>
					<th scope="row">Piątek</th>
					<td>{start_work_friday}</td>
					<td>{end_work_friday}</td>
				</tr>
				<tr>
					<th scope="row">Sobota</th>
					<td>{start_work_saturday}</td>
					<td>{end_work_saturday}</td>
				</tr>
				<tr>
					<th scope="row">Niedziela</th>
					<td>{start_work_sunday}</td>
					<td>{end_work_sunday}</td>
				</tr>
			</tbody>
		</table>
	)
}

WorkHours.prototype.propTypes = {
	end_work_sunday: PropTypes.string.isRequired,
	start_work_sunday: PropTypes.string.isRequired,

	end_work_saturday: PropTypes.string.isRequired,
	start_work_saturday: PropTypes.string.isRequired,

	end_work_friday: PropTypes.string.isRequired,
	start_work_friday: PropTypes.string.isRequired,

	end_work_thursday: PropTypes.string.isRequired,
	start_work_thursday: PropTypes.string.isRequired,

	end_work_wednesday: PropTypes.string.isRequired,
	start_work_wednesday: PropTypes.string.isRequired,

	end_work_tuesday: PropTypes.string.isRequired,
	start_work_tuesday: PropTypes.string.isRequired,

	end_work_monday: PropTypes.string.isRequired,
	start_work_monday: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
	end_work_sunday: state.data.data.end_work_sunday,
	start_work_sunday: state.data.data.start_work_sunday,

	end_work_saturday: state.data.data.end_work_saturday,
	start_work_saturday: state.data.data.start_work_saturday,

	end_work_friday: state.data.data.end_work_friday,
	start_work_friday: state.data.data.start_work_friday,

	end_work_thursday: state.data.data.end_work_thursday,
	start_work_thursday: state.data.data.start_work_thursday,

	end_work_wednesday: state.data.data.end_work_wednesday,
	start_work_wednesday: state.data.data.start_work_wednesday,

	end_work_tuesday: state.data.data.end_work_tuesday,
	start_work_tuesday: state.data.data.start_work_tuesday,

	end_work_monday: state.data.data.end_work_monday,
	start_work_monday: state.data.data.start_work_monday,
})

export default connect(mapStateToProps, null)(WorkHours)
