import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { IoMdPhotos } from 'react-icons/io'
import GalleryIllustration from '../assets/images/gallery-illustration.svg'

import { NotificationManager } from 'react-notifications'
import PageHero from '../layout/PageHero'
import ImageList from '../components/ImageList'
import Button from '../layout/buttons/Button'
import { connect } from 'react-redux'
import EditBox from '../layout/forms/EditBox'

class Gallery extends Component {
	static propTypes = {
		gallery_title: PropTypes.string,
		gallery_content: PropTypes.string,
	}

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
		const { gallery_title, gallery_content } = this.props
		const { loading, data } = this.state

		return (
			<PageHero>
				<PageHero.Body data-aos="flip-up">
					<PageHero.Img src={GalleryIllustration} />
					<PageHero.Content>
						<PageHero.Title>
							<EditBox
								name="gallery_title"
								value={gallery_title}
								textarea
							>
								{gallery_title}
							</EditBox>
						</PageHero.Title>
						<PageHero.Text>
							<EditBox
								name="gallery_content"
								value={gallery_content}
								textarea
							>
								{gallery_content}
							</EditBox>
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

const mapStateToProps = (state) => ({
	gallery_title: state.data.data.gallery_title,
	gallery_content: state.data.data.gallery_content,
})

export default connect(mapStateToProps, null)(Gallery)
