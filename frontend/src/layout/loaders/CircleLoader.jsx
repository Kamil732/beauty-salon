import React from 'react'

function CircleLoader(props) {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			{...props}
		>
			<div className="circle-loader">
				<div className="circle-loader__item"></div>
				<div className="circle-loader__item"></div>
				<div className="circle-loader__item"></div>
				<div className="circle-loader__item"></div>
			</div>
		</div>
	)
}

export default CircleLoader
