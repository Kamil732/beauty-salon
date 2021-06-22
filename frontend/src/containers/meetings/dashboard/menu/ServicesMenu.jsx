import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { BsCardChecklist } from 'react-icons/bs'

import RootMenu from '../../../../layout/menus/RootMenu'

function ServicesMenu({ serviceGroups }) {
	const [activeItem, setActiveItem] = useState(null)

	const getServiceGroup = (group) => (
		<RootMenu
			title={group.name}
			value={group.id}
			activeValue={activeItem}
			onChange={() => setActiveItem(group.id)}
		>
			{group.subgroups.map((_group) => (
				<React.Fragment key={group.id}>
					{getServiceGroup(_group)}
				</React.Fragment>
			))}
		</RootMenu>
	)

	return (
		<RootMenu
			isHead
			title={
				<div className="icon-container">
					<BsCardChecklist
						size="18"
						className="icon-container__icon"
					/>
					Wszystkie usługi
				</div>
			}
			value={null}
			activeValue={activeItem}
			onChange={() => setActiveItem(null)}
		>
			{serviceGroups.map((group) => (
				<React.Fragment key={group.id}>
					{getServiceGroup(group)}
				</React.Fragment>
			))}
		</RootMenu>
	)
}

ServicesMenu.prototype.propTypes = {
	serviceGroups: PropTypes.array,
}

const mapStateToProps = (state) => ({
	serviceGroups: state.data.cms.data.service_groups,
})

export default connect(mapStateToProps, null)(ServicesMenu)
