import React from 'react'

function CircleLoader(props) {
	return (
		<div class="circle-loader" {...props}>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
		</div>
	)
}

export default CircleLoader
