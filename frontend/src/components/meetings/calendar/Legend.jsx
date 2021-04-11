import React from 'react'

function Legend() {
	return (
		<div className="legend">
			<div className="legend__item">
				<span
					style={{
						width: '2rem',
						height: '1rem',
					}}
					className="s-color"
				></span>
				<span>Obecna data</span>
			</div>
			<div className="legend__item">
				<span
					className="rbc-current-time-indicator"
					style={{ width: '2rem' }}
				></span>
				<span>Obecny czas</span>
			</div>
			<div className="legend__item">
				<span
					className="rbc-event"
					style={{ width: '2rem', height: '1rem' }}
				></span>
				<span>Umówiona wizyta</span>
			</div>
			<div className="legend__item">
				<span
					className="rbc-time-slot disabled"
					style={{
						width: '2rem',
						height: '1rem',
						flex: 'none',
					}}
				></span>
				<span>Nie pracuje</span>
			</div>
		</div>
	)
}

export default Legend
