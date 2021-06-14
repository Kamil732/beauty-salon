import React from 'react'
import ReactTooltip from 'react-tooltip'

function EventWrapper({ event, children }) {
	return (
		<>
			<div data-tip="wef" data-for={`${event.id}Tip`}>
				{children}
			</div>
			<ReactTooltip
				id={`${event.id}Tip`}
				place="right"
				// html={true}
				getContent={() => children}
			/>
		</>
	)
}

export default EventWrapper
