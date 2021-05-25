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
					{start_work_monday && end_work_monday ? (
						<>
							<td>{start_work_monday}</td>
							<td>{end_work_monday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Wtorek</th>
					{start_work_tuesday && end_work_tuesday ? (
						<>
							<td>{start_work_tuesday}</td>
							<td>{end_work_tuesday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Środa</th>
					{start_work_wednesday && end_work_wednesday ? (
						<>
							<td>{start_work_wednesday}</td>
							<td>{end_work_wednesday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Czwartek</th>
					{start_work_thursday && end_work_thursday ? (
						<>
							<td>{start_work_thursday}</td>
							<td>{end_work_thursday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Piątek</th>
					{start_work_friday && end_work_friday ? (
						<>
							<td>{start_work_friday}</td>
							<td>{end_work_friday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Sobota</th>
					{start_work_saturday && end_work_saturday ? (
						<>
							<td>{start_work_saturday}</td>
							<td>{end_work_saturday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Niedziela</th>
					{start_work_sunday && end_work_sunday ? (
						<>
							<td>{start_work_sunday}</td>
							<td>{end_work_sunday}</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
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
	end_work_sunday: state.data.cms.data.end_work_sunday || '',
	start_work_sunday: state.data.cms.data.start_work_sunday || '',
	end_work_saturday: state.data.cms.data.end_work_saturday || '',
	start_work_saturday: state.data.cms.data.start_work_saturday || '',
	end_work_friday: state.data.cms.data.end_work_friday || '',
	start_work_friday: state.data.cms.data.start_work_friday || '',
	end_work_thursday: state.data.cms.data.end_work_thursday || '',
	start_work_thursday: state.data.cms.data.start_work_thursday || '',
	end_work_wednesday: state.data.cms.data.end_work_wednesday || '',
	start_work_wednesday: state.data.cms.data.start_work_wednesday || '',
	end_work_tuesday: state.data.cms.data.end_work_tuesday || '',
	start_work_tuesday: state.data.cms.data.start_work_tuesday || '',
	end_work_monday: state.data.cms.data.end_work_monday || '',
	start_work_monday: state.data.cms.data.start_work_monday || '',
})

export default connect(mapStateToProps, null)(WorkHours)
