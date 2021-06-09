import React, { useState } from 'react'
import Collapse from '@kunukn/react-collapse'

import { IoIosArrowDown } from 'react-icons/io'

function CollapseMenu({ children, header, ...props }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="collapse" {...props}>
			<div
				className="collapse__header"
				onClick={() => setIsOpen(!isOpen)}
			>
				{header}

				<IoIosArrowDown
					className={`collapse__arrow${isOpen ? ' active' : ''}`}
				/>
			</div>
			<Collapse
				layoutEffect
				isOpen={isOpen}
				className="collapse__content"
			>
				{children}
			</Collapse>
		</div>
	)
}

function Item({ children, ...props }) {
	return <div className="collapse__item">{children}</div>
}

CollapseMenu.Item = Item

export default CollapseMenu
