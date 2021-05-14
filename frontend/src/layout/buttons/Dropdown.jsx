import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { BiLeftArrowAlt } from 'react-icons/bi'

import Truncate from 'react-truncate'
import Button from './Button'

function Dropdown({ btnContent, loadItems, items, noItemsContent, ...props }) {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState({
		isOpen: false,
		data: {},
	})
	const container = useRef(null)

	useEffect(() => {
		if (loadItems && items.length === 0) loadItems()

		const handleClickOutside = (e) => {
			if (container.current && !container.current.contains(e.target)) {
				setSelected({ ...selected, isOpen: false })
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [selected, loadItems, items])

	return (
		<div className="dropdown" ref={container}>
			<Button
				type="button"
				onClick={() => {
					setSelected({ ...selected, isOpen: false })
					setIsOpen(!isOpen)
				}}
				{...props}
			>
				{btnContent}
			</Button>

			{isOpen && (
				<div className="dropdown__content">
					{items.length > 0 ? (
						<div
							className={`dropdown__list${
								selected.isOpen ? ' slide' : ''
							}`}
						>
							<ul>
								{items.map((item, idx) => (
									<li
										key={idx}
										onClick={() =>
											setSelected({
												isOpen: true,
												data: item,
											})
										}
									>
										<div style={{ marginBottom: '4px' }}>
											<h4>
												<Truncate lines={1}>
													{item.label}
												</Truncate>
											</h4>
											<span className="text-broken">
												{moment(item.date).format(
													'DD-MM-YYYY H:mm'
												)}
											</span>
										</div>

										<p>
											<Truncate lines={2}>
												{item.content}
											</Truncate>
										</p>
									</li>
								))}
							</ul>

							<div className="dropdown__selected">
								<Button
									rounded
									onClick={() =>
										setSelected({
											...selected,
											isOpen: false,
										})
									}
								>
									<BiLeftArrowAlt />
								</Button>

								<div style={{ marginBottom: '4px' }}>
									<h4>{selected.data?.label}</h4>
									<span className="text-broken">
										{moment(selected.data?.date).format(
											'DD-MM-YYYY H:mm'
										)}
									</span>
								</div>

								<p>{selected.data?.content}</p>
							</div>
						</div>
					) : (
						noItemsContent
					)}
				</div>
			)}
		</div>
	)
}

Dropdown.prototype.propTypes = {
	btnContent: PropTypes.any,
	loadItems: PropTypes.func,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.instanceOf(Date).isRequired,
			label: PropTypes.string,
			content: PropTypes.string,
			redirect: PropTypes.string,
		})
	),
	noItemsContent: PropTypes.instanceOf(Element).isRequired,
}

export default Dropdown
