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
	unReadItems,
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

					if (loadItems && !isOpen && !loading && items.length === 0)
						loadItems()
				}}
				{...props}
			>
				{btnContent}
				{unReadItems > 0 && (
					<span className="badge">{unReadItems}</span>
				)}
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
														marginBottom: '6px',
													}}
												>
													<h4>
														<Truncate lines={1}>
															{item.title}
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
														{item.message}
													</Truncate>
												</p>
											</li>
										))}
									</ul>

									<div className="dropdown__selected">
										<div className="dropdown__selected__header">
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

Dropdown.prototype.propTypes = {
	btnContent: PropTypes.any,
	loading: PropTypes.bool,
	loadItems: PropTypes.func,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.instanceOf(Date).isRequired,
			title: PropTypes.string,
			message: PropTypes.string,
			read: PropTypes.bool,
			redirect: PropTypes.string,
		})
	),
	unReadItems: PropTypes.number,
	noItemsContent: PropTypes.instanceOf(Element).isRequired,
}

export default Dropdown
