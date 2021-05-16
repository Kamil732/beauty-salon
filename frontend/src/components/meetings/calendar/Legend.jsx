import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loadBarbers } from '../../../redux/actions/meetings'
import EditBox from '../../../layout/forms/EditBox'
import axios from 'axios'

function Legend({ isAuthenticated, isAdmin, loadBarbers, barbers, colors }) {
	useEffect(() => {
		if (barbers.length === 0) loadBarbers()
	}, [barbers, loadBarbers])

	const onSave = async (name, newValue, headers) => {
		const body = JSON.stringify({ color: newValue })

		await axios.patch(
			`${process.env.REACT_APP_API_URL}/accounts/${name}/`,
			body,
			headers
		)

		colors[name] = newValue

		return { colors }
	}

	return (
		<div className="legend">
			<div className="legend__item">
				<span
					style={{
						width: '2rem',
						height: '1rem',
					}}
					className="rbc-today"
				></span>
				<span>Obecna data</span>
			</div>
			<div className="legend__item">
				<span
					className="rbc-current-time-indicator"
					style={{ width: '2rem' }}
				></span>
				<span>Obecny czas</span>
			</div>
			<div className="legend__item">
				<span
					className="rbc-time-slot disabled"
					style={{
						width: '2rem',
						height: '1rem',
						flex: 'none',
					}}
				></span>
				<span>Nie można umówić wizyty</span>
			</div>
			<div className="legend__item">
				<span>
					<h5>(1)</h5>
				</span>
				<span>Liczba wolnych godzin</span>
			</div>
			{isAuthenticated &&
				barbers.map((barber, idx) => {
					if (!colors[barber.value] && !isAdmin) return null

					return (
						<div className="legend__item" key={idx}>
							<EditBox
								name={barber.value}
								value={colors[barber.value]}
								onSave={onSave}
							>
								<span
									style={{
										width: '2rem',
										height: '1rem',
										backgroundColor: `#${
											colors[barber.value]
										}`,
									}}
								></span>
								<span>{barber.label}</span>
							</EditBox>
						</div>
					)
				})}
		</div>
	)
}

Legend.prototype.propTypes = {
	isAuthenticated: PropTypes.bool,
	isAdmin: PropTypes.bool,
	barbers: PropTypes.array,
	colors: PropTypes.object,
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isAdmin: state.auth.data.is_admin,
	barbers: state.meetings.barberChoiceList,
	colors: state.data.cms.data.colors,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
