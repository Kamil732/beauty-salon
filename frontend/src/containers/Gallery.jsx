import React, { Component } from 'react'
import axios from 'axios'

import { IoMdPhotos } from 'react-icons/io'
import GalleryIllustration from '../assets/images/gallery-illustration.svg'

import { NotificationManager } from 'react-notifications'
import PageHero from '../layout/PageHero'
import ImageList from '../components/ImageList'
import Button from '../layout/buttons/Button'

class Gallery extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			data: {
				next: null,
				results: [],
			},
		}

		this.getImages = this.getImages.bind(this)
	}

	componentDidMount = () => this.getImages()

	getImages = async (page = 1) => {
		this.setState({ loading: true })

		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/gallery/?page=${page}`
			)

			this.setState({
				loading: false,
				data: {
					next: res.data.next,
					results: [...this.state.data.results, ...res.data.results],
				},
			})
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować zdjęć',
				'Błąd',
				1000 * 10
			)

			this.setState({ loading: false })
		}
	}

	render() {
		const { loading, data } = this.state

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
				<PageHero.Body vertical>
					<PageHero.Title
						style={{
							textAlign: 'center',
						}}
					>
						<div className="icon-container">
							<IoMdPhotos className="icon-container__icon" />
							Zdjęcia klientów
						</div>
					</PageHero.Title>

					<ImageList images={data.results} loading={loading} />
					{data.next ? (
						<Button
							secondary
							onClick={() => this.getImages(data.next)}
							style={{
								marginLeft: 'auto',
								marginRight: 'auto',
								marginTop: '5rem',
							}}
						>
							Załaduj Więcej
						</Button>
					) : null}
				</PageHero.Body>
			</PageHero>
		)
	}
}

export default Gallery
