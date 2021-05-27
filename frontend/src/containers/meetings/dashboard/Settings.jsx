import React from 'react'

import { HiCursorClick } from 'react-icons/hi'

function Settings(props) {
	return (
		<div
			style={{
				opacity: '0.6',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				fontSize: '1.6em',
				userSelect: 'none',
				textAlign: 'center',
			}}
		>
			<span style={{ fontSize: '4em' }}>
				<HiCursorClick />
			</span>
			Wybierz interesujące cię ustawienie w nawigacji po lewej stronie
		</div>
	)
}

export default Settings
