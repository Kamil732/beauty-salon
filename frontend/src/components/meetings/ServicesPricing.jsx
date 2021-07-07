import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CollapseMenu from '../../layout/menus/CollapseMenu'
import Button from '../../layout/buttons/Button'
import Modal from '../../layout/Modal'

function ServicesPricing({ serviceGroups, services, barbers }) {
	const [modalData, setModalData] = useState({
		isOpen: false,
		barbers: [],
		name: '',
		display_time: '',
		price: '',
		description: '',
	})

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

	const getDisplayPrice = (price) => (
		<span className="text-broken">
			{price > 0 ? (
				<>
					{price} <sup>zł</sup>
				</>
			) : (
				'Za darmo'
			)}
		</span>
	)

	const getService = (service, showDetailBtn = true) => (
		<CollapseMenu.Item key={service.id}>
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
				{showDetailBtn && (
					<Button
						extraSmall
						style={{
							fontSize: '0.7em',
							fontWeight: '600',
							marginTop: '0.5rem',
						}}
						onClick={() =>
							setModalData({
								isOpen: true,
								barbers: service.barbers,
								name: service.name,
								description: service.public_description,
								display_time: service.display_time,
								price: service.price,
							})
						}
					>
						Szczegóły
					</Button>
				)}
			</div>
			{getDisplayPrice(service.price)}
		</CollapseMenu.Item>
	)

	const getServiceGroup = (group) => {
		return (
			<CollapseMenu header={getHeader(group)} key={group.id}>
				{group.services.map((service) => {
					service = services.find(
						(_service) => _service.id === service
					)

					return getService(service)
				})}
				{group.subgroups.map((_group) => getServiceGroup(_group))}
			</CollapseMenu>
		)
	}

	return (
		<>
			{modalData.isOpen && (
				<Modal
					closeModal={(data) =>
						setModalData({ isOpen: false, ...data })
					}
				>
					<Modal.Header>
						<h3>{modalData.name}</h3>
					</Modal.Header>
					<Modal.Body>
						{getService(modalData, false)}
						<CollapseMenu header={<h4>Przydzieleni fryzjerzy</h4>}>
							{modalData.barbers.map((barber) => (
								<CollapseMenu.Item key={barber}>
									<h6>
										{
											barbers.find(
												({ id }) => id === barber
											).full_name
										}
									</h6>
								</CollapseMenu.Item>
							))}
						</CollapseMenu>

						<div
							dangerouslySetInnerHTML={{
								__html: modalData.description,
							}}
						></div>
					</Modal.Body>
				</Modal>
			)}

			{services
				.filter((service) => !service.group)
				.map((service) => getService(service))}

			{serviceGroups.map((group) => getServiceGroup(group))}
		</>
	)
}

ServicesPricing.prototype.propTypes = {
	serviceGroups: PropTypes.array,
	services: PropTypes.array,
	barbers: PropTypes.array,
}

const mapStateToProps = (state) => ({
	serviceGroups: state.data.cms.data.service_groups,
	services: state.data.cms.data.services,
	barbers: state.data.barbers,
})

export default connect(mapStateToProps, null)(ServicesPricing)
