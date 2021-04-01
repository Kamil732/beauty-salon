import React, { useEffect, useState } from 'react'

import BrickLoader from '../layout/loaders/BrickLoader'

function ImageList({ loading, images }) {
	const [zoom, setZoom] = useState(null)

	useEffect(() => {
		document.querySelector('body').style.overflowY =
			zoom === null ? 'auto' : 'hidden'
	}, [zoom])

	if (loading) return <BrickLoader />

	images = images.map((image) => {
		return (
			<>
				<figure
					className={`gallery__img-container${
						zoom === image.id ? ' zoom' : ''
					}`}
				>
					{zoom === image.id ? (
						<span
							className="btn-close"
							onClick={() => setZoom(null)}
						></span>
					) : null}

					<img
						src={image.image}
						alt={image.title}
						className={`gallery__img${
							zoom === image.id ? ' zoom' : ''
						}`}
						onClick={() => setZoom(image.id)}
					/>

					{zoom === image.id ? (
						<p className="gallery__img__title">{image.title}</p>
					) : null}
				</figure>
				{zoom === image.id ? (
					<figure className="gallery__img-container"></figure>
				) : null}
			</>
		)
	})

	return <div className="gallery">{images}</div>
}

export default ImageList
