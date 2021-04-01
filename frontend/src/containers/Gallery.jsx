import React, { Component } from 'react'
import axios from 'axios'

import GalleryIllustration from '../assets/images/gallery-illustration.svg'

import { NotificationManager } from 'react-notifications'
import PageHero from '../layout/PageHero'
import ImageList from '../components/ImageList'

class Gallery extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			images: [],
		}
	}

	componentDidMount = async () => {
		this.setState({ loading: true })

		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/gallery/`
			)

			this.setState({ images: res.data })
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować zdjęć',
				'Błąd',
				1000 * 10
			)
		}

		this.setState({ loading: false })
	}

	render() {
		const { loading, images } = this.state

		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={GalleryIllustration} />
					<PageHero.Content>
						<PageHero.Title>Galeria zdjęć</PageHero.Title>
						<PageHero.Text>
							Ze zgodą naszych klientów zrobiliśmy im parę zdjęć,
							byś Ty mógł zdecydować nad swoją przyszła fryzurą
						</PageHero.Text>
					</PageHero.Content>
				</PageHero.Body>
				<PageHero.Body>
					<div style={{ marginTop: '10rem' }}>
						<ImageList images={images} loading={loading} />
					</div>
				</PageHero.Body>
			</PageHero>
		)
	}
}

export default Gallery
