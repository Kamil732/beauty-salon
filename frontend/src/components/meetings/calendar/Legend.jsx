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
					className="rbc-today"
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
					className="rbc-time-slot disabled"
					style={{
						width: '2rem',
						height: '1rem',
						flex: 'none',
					}}
				></span>
				<span>Nie można umówić wizyty</span>
			</div>
		</div>
	)
}

export default Legend
