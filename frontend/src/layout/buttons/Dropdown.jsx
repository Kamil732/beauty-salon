import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { BiLeftArrowAlt } from 'react-icons/bi'

import Truncate from 'react-truncate'
import Button from './Button'
import CircleLoader from '../loaders/CircleLoader'

function Dropdown({
	btnContent,
	loading,
	loadItems,
	items,
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
	}, [selected, isOpen, loadItems, items])

	return (
		<div style={{ position: 'relative' }} ref={container}>
			<Button
				type="button"
				onClick={() => {
					setSelected({ ...selected, isOpen: false })
					setIsOpen(!isOpen)

					if (loadItems && !isOpen && items.length === 0) loadItems()
				}}
				{...props}
			>
				{btnContent}
			</Button>

			{isOpen && (
				<div className="dropdown">
					<div className="dropdown__inner">
						<div className="dropdown__content">
							{loading ? (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100%',
									}}
								>
									<CircleLoader />
								</div>
							) : items.length > 0 ? (
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
												<div
													style={{
														marginBottom: '4px',
													}}
												>
													<h4>
														<Truncate lines={1}>
															{item.label}
														</Truncate>
													</h4>
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
												{moment(
													selected.data?.date
												).format('DD-MM-YYYY H:mm')}
											</span>
										</div>

										<p>{selected.data?.content}</p>
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

Dropdown.prototype.propTypes = {
	btnContent: PropTypes.any,
	loading: PropTypes.bool,
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
