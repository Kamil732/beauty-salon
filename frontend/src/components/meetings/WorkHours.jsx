import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditBox from '../../layout/forms/EditBox'

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
					<td>
						<EditBox
							name="start_work_monday"
							value={start_work_monday}
						>
							{(start_work_monday && start_work_monday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox name="end_work_monday" value={end_work_monday}>
							{(end_work_monday && end_work_monday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Wtorek</th>
					<td>
						<EditBox
							name="start_work_tuesday"
							value={start_work_tuesday}
						>
							{(start_work_tuesday && start_work_tuesday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox
							name="end_work_tuesday"
							value={end_work_tuesday}
						>
							{(end_work_tuesday && end_work_tuesday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Środa</th>
					<td>
						<EditBox
							name="start_work_wednesday"
							value={start_work_wednesday}
						>
							{(start_work_wednesday && start_work_wednesday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox
							name="end_work_wednesday"
							value={end_work_wednesday}
						>
							{(end_work_wednesday && end_work_wednesday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Czwartek</th>
					<td>
						<EditBox
							name="start_work_thursday"
							value={start_work_thursday}
						>
							{(start_work_thursday && start_work_thursday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox
							name="end_work_thursday"
							value={end_work_thursday}
						>
							{(end_work_thursday && end_work_thursday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Piątek</th>
					<td>
						<EditBox
							name="start_work_friday"
							value={start_work_friday}
						>
							{(start_work_friday && start_work_friday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox name="end_work_friday" value={end_work_friday}>
							{(end_work_friday && end_work_friday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Sobota</th>
					<td>
						<EditBox
							name="start_work_saturday"
							value={start_work_saturday}
						>
							{(start_work_saturday && start_work_saturday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox
							name="end_work_saturday"
							value={end_work_saturday}
						>
							{(end_work_saturday && end_work_saturday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
				<tr>
					<th scope="row">Niedziela</th>
					<td>
						<EditBox
							name="start_work_sunday"
							value={start_work_sunday}
						>
							{(start_work_sunday && start_work_sunday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
					<td>
						<EditBox name="end_work_sunday" value={end_work_sunday}>
							{(end_work_sunday && end_work_sunday) ||
								'ZAMKNIĘTE'}
						</EditBox>
					</td>
				</tr>
			</tbody>
		</table>
	)
}

WorkHours.prototype.propTypes = {
	end_work_sunday: PropTypes.string,
	start_work_sunday: PropTypes.string,
	end_work_saturday: PropTypes.string,
	start_work_saturday: PropTypes.string,
	end_work_friday: PropTypes.string,
	start_work_friday: PropTypes.string,
	end_work_thursday: PropTypes.string,
	start_work_thursday: PropTypes.string,
	end_work_wednesday: PropTypes.string,
	start_work_wednesday: PropTypes.string,
	end_work_tuesday: PropTypes.string,
	start_work_tuesday: PropTypes.string,
	end_work_monday: PropTypes.string,
	start_work_monday: PropTypes.string,
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
