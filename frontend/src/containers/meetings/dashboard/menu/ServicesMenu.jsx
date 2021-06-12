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
			key={group.id}
		>
			{group.subgroups.map((_group) => getServiceGroup(_group))}
		</RootMenu>
	)

	return (
		<RootMenu
			isHead
			title={
				<>
					<BsCardChecklist size="18" />
					Wszystkie usługi
				</>
			}
			value={null}
			activeValue={activeItem}
			onChange={() => setActiveItem(null)}
		>
			{serviceGroups.map((group) => getServiceGroup(group))}
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
