import moment from 'moment'
import React from 'react'

const TouchCellWrapper = ({ children, value, onSelectSlot, ...props }) => {
	const end = moment(value).add(30, 'minutes').toDate()
	let timeout = 0
	const addTimeout = () => (timeout += 1)

	return React.cloneElement(React.Children.only(children), {
		onTouchStart: () => setInterval(addTimeout, 1),
		onTouchEnd: () => {
			if (timeout > 200)
				onSelectSlot({
					action: 'click',
					slots: [value, end],
					start: value,
					end,
					...props,
				})

			clearInterval(addTimeout)
			timeout = 0
		},
	})
}

export default TouchCellWrapper
