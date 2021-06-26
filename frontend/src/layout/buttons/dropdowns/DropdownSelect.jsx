import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { BiLeftArrowAlt } from 'react-icons/bi'

import Truncate from 'react-truncate'
import Button from '../Button'
import CircleLoader from '../../loaders/CircleLoader'

function DropdownSelect({
	btnContent,
	loading,
	loaded,
	loadItems,
	items,
	unReadItems,
	markRead,
	noItemsContent,
	...props
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState({
		isOpen: false,
		data: {},
	})
	const container = useRef(null)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (container.current && !container.current.contains(e.target)) {
				setSelected({ ...selected, isOpen: false })
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [selected, isOpen])

	useEffect(() => {
		if (selected.isOpen && !selected.data.read && markRead)
			markRead(selected.data.id)
	}, [selected, markRead])

	return (
		<div style={{ position: 'relative' }} ref={container}>
			<Button
				type="button"
				onClick={() => {
					setSelected({ ...selected, isOpen: false })
					setIsOpen(!isOpen)

					if (
						loadItems &&
						!isOpen &&
						!loading &&
						!loaded &&
						items.length === 0
					)
						loadItems()
				}}
				{...props}
			>
				{btnContent}
				{unReadItems > 0 && (
					<div className="badge rounded">
						<div>{unReadItems}</div>
					</div>
				)}
			</Button>

			{isOpen && (
				<div className="dropdown-select">
					<div className="dropdown-select__inner">
						<div className="dropdown-select__content">
							{loading ? (
								<div className="center-container">
									<CircleLoader />
								</div>
							) : items.length > 0 ? (
								<div
									className={`dropdown-select__list${
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
												<div
													style={{
														marginBottom: '0.5rem',
													}}
												>
													{item.read === false ? (
														<div className="dropdown-select__header">
															<h4>
																<Truncate
																	lines={1}
																>
																	{item.title}
																</Truncate>
															</h4>

															<span className="text-broken info-text">
																Nowe
															</span>
														</div>
													) : (
														<h4>
															<Truncate lines={1}>
																{item.title}
															</Truncate>
														</h4>
													)}
													<span className="text-broken">
														{moment(
															item.date
														).format(
															'DD-MM-YYYY H:mm'
														)}
													</span>
												</div>

												<p>
													<Truncate lines={2}>
														{item.message}
													</Truncate>
												</p>
											</li>
										))}
									</ul>

									<div className="dropdown-select__selected">
										<div
											className="dropdown-select__header"
											style={{ marginBottom: '1rem' }}
										>
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

											<span className="text-broken">
												{moment(
													selected.data?.date
												).format('DD-MM-YYYY H:mm')}
											</span>
										</div>

										<h4 style={{ marginBottom: '1rem' }}>
											{selected.data?.title}
										</h4>

										<p style={{ lineHeight: '1.3' }}>
											{selected.data?.message}
										</p>
									</div>
								</div>
							) : (
								noItemsContent
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

DropdownSelect.prototype.propTypes = {
	btnContent: PropTypes.any,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	loadItems: PropTypes.func,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			date: PropTypes.instanceOf(Date).isRequired,
			title: PropTypes.string,
			message: PropTypes.string,
			read: PropTypes.bool,
			redirect: PropTypes.string,
		})
	),
	unReadItems: PropTypes.number,
	markRead: PropTypes.func,
	noItemsContent: PropTypes.instanceOf(Element).isRequired,
}

export default DropdownSelect
