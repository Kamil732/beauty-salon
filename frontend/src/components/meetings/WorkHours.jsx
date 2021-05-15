import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditBox from '../../layout/forms/EditBox'

function WorkHours({
	isAdmin,
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
	const regexValidation = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
	const validationErrorMessage =
		'Nie poprawny format. Format musi być w HH:MM'

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
					{isAdmin || (start_work_monday && end_work_monday) ? (
						<>
							<td>
								<EditBox
									name="start_work_monday"
									value={start_work_monday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_monday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_monday"
									value={end_work_monday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_monday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Wtorek</th>
					{isAdmin || (start_work_tuesday && end_work_tuesday) ? (
						<>
							<td>
								<EditBox
									name="start_work_tuesday"
									value={start_work_tuesday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_tuesday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_tuesday"
									value={end_work_tuesday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_tuesday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Środa</th>
					{isAdmin || (start_work_wednesday && end_work_wednesday) ? (
						<>
							<td>
								<EditBox
									name="start_work_wednesday"
									value={start_work_wednesday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_wednesday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_wednesday"
									value={end_work_wednesday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_wednesday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Czwartek</th>
					{isAdmin || (start_work_thursday && end_work_thursday) ? (
						<>
							<td>
								<EditBox
									name="start_work_thursday"
									value={start_work_thursday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_thursday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_thursday"
									value={end_work_thursday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_thursday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Piątek</th>
					{isAdmin || (start_work_friday && end_work_friday) ? (
						<>
							<td>
								<EditBox
									name="start_work_friday"
									value={start_work_friday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_friday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_friday"
									value={end_work_friday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_friday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Sobota</th>
					{isAdmin || (start_work_saturday && end_work_saturday) ? (
						<>
							<td>
								<EditBox
									name="start_work_saturday"
									value={start_work_saturday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_saturday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_saturday"
									value={end_work_saturday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_saturday || '--:--'}
								</EditBox>
							</td>
						</>
					) : (
						<td colSpan="2">ZAMKNIĘTE</td>
					)}
				</tr>
				<tr>
					<th scope="row">Niedziela</th>
					{isAdmin || (start_work_sunday && end_work_sunday) ? (
						<>
							<td>
								<EditBox
									name="start_work_sunday"
									value={start_work_sunday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{start_work_sunday || '--:--'}
								</EditBox>
							</td>
							<td>
								<EditBox
									name="end_work_sunday"
									value={end_work_sunday}
									regexValidation={regexValidation}
									validationErrorMessage={
										validationErrorMessage
									}
								>
									{end_work_sunday || '--:--'}
								</EditBox>
							</td>
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
	isAdmin: PropTypes.bool,
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
	isAdmin: state.auth.data.is_admin,

	end_work_sunday: state.data.serverData.data.end_work_sunday || '',
	start_work_sunday: state.data.serverData.data.start_work_sunday || '',
	end_work_saturday: state.data.serverData.data.end_work_saturday || '',
	start_work_saturday: state.data.serverData.data.start_work_saturday || '',
	end_work_friday: state.data.serverData.data.end_work_friday || '',
	start_work_friday: state.data.serverData.data.start_work_friday || '',
	end_work_thursday: state.data.serverData.data.end_work_thursday || '',
	start_work_thursday: state.data.serverData.data.start_work_thursday || '',
	end_work_wednesday: state.data.serverData.data.end_work_wednesday || '',
	start_work_wednesday: state.data.serverData.data.start_work_wednesday || '',
	end_work_tuesday: state.data.serverData.data.end_work_tuesday || '',
	start_work_tuesday: state.data.serverData.data.start_work_tuesday || '',
	end_work_monday: state.data.serverData.data.end_work_monday || '',
	start_work_monday: state.data.serverData.data.start_work_monday || '',
})

export default connect(mapStateToProps, null)(WorkHours)
