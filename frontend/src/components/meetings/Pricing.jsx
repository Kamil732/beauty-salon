import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function Pricing({ services, barbers }) {
	if (services.length === 0)
		return <h4>Nie obsługujemy narazie żadnych wizyt</h4>

	return (
		<>
			<table className="table">
				<thead>
					<th scope="col">Usługa</th>
					<th scope="col">Fryzjer</th>
					<th scope="col">Czas</th>
					<th scope="col">Cena</th>
				</thead>
				<tbody>
					{services.length === 0 && <h4>Nie ma żadnych usług</h4>}

					{services.map((service, index) => {
						const serviceBarbers = barbers.filter((barber) =>
							Object.values(service.barbers).includes(
								barber.value
							)
						)

						return (
							<tr key={index}>
								<th scope="row">{service.name}</th>
								<td>
									{serviceBarbers.length > 0
										? serviceBarbers.map(({ label }) => (
												<>
													{`${
														label.split(' ')[0]
													} ${label
														.split(' ')[1]
														.charAt(0)}.`}
													<br />
												</>
										  ))
										: 'Dowolny'}
								</td>
								<td>{service.time}</td>
								<td>
									{service.price > 0
										? `${service.price}`
										: 'Za darmo'}
									<sup>zł</sup>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	)
}

Pricing.prototype.propTypes = {
	services: PropTypes.array,
	barbers: PropTypes.array,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	barbers: state.meetings.barberChoiceList,
})

export default connect(mapStateToProps, null)(Pricing)
