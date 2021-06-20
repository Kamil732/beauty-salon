import React from 'react'
import { connect } from 'react-redux'

import ReactTooltip from 'react-tooltip'
import getEventTooltip from '../../../../helpers/getEventTooltip'

function EventWrapper({ event, children, services }) {
	return (
		<>
			<div data-tip="wef" data-for={`${event.id}Tip`}>
				{children}
			</div>
			<ReactTooltip
				id={`${event.id}Tip`}
				place="right"
				type="light"
				borderColor="grey"
				border
				offset={{ right: 20 }}
				delayShow={250}
				getContent={() => getEventTooltip(event, services)}
			/>
		</>
	)
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
})

export default connect(mapStateToProps, null)(EventWrapper)
