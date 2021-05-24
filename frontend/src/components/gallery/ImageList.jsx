import React, { useEffect, useState } from 'react'
import { CloseButton } from '../../layout/buttons/Button'

import BrickLoader from '../../layout/loaders/BrickLoader'

function ImageList({ loading, images }) {
	const [zoom, setZoom] = useState(null)

	useEffect(() => {
		document.querySelector('body').style.overflowY =
			zoom === null ? 'auto' : 'hidden'
	}, [zoom])

	if (images.length > 0) {
		images = images.map((image) => {
			if (zoom === image.id)
				return (
					<React.Fragment key={image.id}>
						<figure className="gallery__img-container zoom">
							<CloseButton
								trCorner
								onClick={() => setZoom(null)}
							/>

							<img
								src={image.image}
								alt={image.title}
								className="gallery__img zoom"
								onClick={() => setZoom(image.id)}
								data-aos="zoom-in"
							/>

							<p className="gallery__img__title">{image.title}</p>
						</figure>
						<figure className="gallery__img-container"></figure>
					</React.Fragment>
				)

			return (
				<React.Fragment key={image.id}>
					<figure className="gallery__img-container">
						<img
							src={image.image}
							alt={image.title}
							className="gallery__img"
							onClick={() => setZoom(image.id)}
							data-aos="zoom-out"
						/>
					</figure>
				</React.Fragment>
			)
		})

		return (
			<>
				<div className="gallery">{images}</div>
				{loading ? <BrickLoader /> : null}
			</>
		)
	}
	if (loading) return <BrickLoader />
	return <h2>Galeria jest pusta. Nie ma żadnych zdjęć</h2>
}

export default ImageList
