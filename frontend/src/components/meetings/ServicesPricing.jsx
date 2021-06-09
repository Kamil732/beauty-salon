import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CollapseMenu from '../../layout/CollapseMenu'
import Button from '../../layout/buttons/Button'

function ServicesPricing({ serviceGroups, services }) {
	if (serviceGroups.length === 0)
		return <h4>Nie obsługujemy narazie żadnych wizyt</h4>

	function getServicesAmount(group) {
		let amount = group.services.length

		for (let i = 0; i < group.subgroups.length; i++)
			amount += getServicesAmount(group.subgroups[i])

		return amount
	}

	const getHeader = (group) => {
		const servicesAmount = getServicesAmount(group)

		return (
			<>
				<h4>{group.name}</h4>
				&nbsp;
				<small>
					{servicesAmount} usług
					{/* Polish grammar */}
					{servicesAmount === 1
						? 'a'
						: servicesAmount > 1 && servicesAmount < 5
						? 'i'
						: ''}
				</small>
			</>
		)
	}

	const getServiceGroup = (group) => {
		return (
			<CollapseMenu header={getHeader(group)} key={group.id}>
				{group.services.map((service, index) => {
					service = services.find(
						(_service) => _service.id === service
					)

					return (
						<CollapseMenu.Item key={index}>
							<div>
								<h5>
									{service.name}

									<small
										className="text-broken"
										style={{
											marginLeft: '0.5rem',
										}}
									>
										{service.display_time}
									</small>
								</h5>
								<Button
									extraSmall
									style={{
										fontSize: '0.7em',
										fontWeight: '600',
										marginTop: '0.5rem',
									}}
								>
									Szczegóły
								</Button>
							</div>
							<span className="text-broken">
								{service.price} <sup>zł</sup>
							</span>
						</CollapseMenu.Item>
					)
				})}
				{group.subgroups.map((_group) => getServiceGroup(_group))}
			</CollapseMenu>
		)
	}

	return serviceGroups.map((group) => getServiceGroup(group))
}

ServicesPricing.prototype.propTypes = {
	serviceGroups: PropTypes.array,
	services: PropTypes.array,
}

const mapStateToProps = (state) => ({
	serviceGroups: state.data.cms.data.service_groups,
	services: state.data.cms.data.services,
})

export default connect(mapStateToProps, null)(ServicesPricing)
