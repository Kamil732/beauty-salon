import React from 'react'

import SettingsIllustration from '../../../assets/svgs/settings-illustration.svg'

function Settings(props) {
	return (
		<div
			style={{
				opacity: '0.6',
				flexDirection: 'column',
				fontSize: '1.7em',
				userSelect: 'none',
				textAlign: 'center',
			}}
			className="center-container"
		>
			<img
				src={SettingsIllustration}
				alt=""
				style={{ width: '60%', marginBottom: '1em' }}
			/>
			Wybierz interesujące cię ustawienie w nawigacji po lewej stronie
		</div>
	)
}

export default Settings
