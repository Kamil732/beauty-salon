import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'

import { IoMdPhotos } from 'react-icons/io'
import GalleryIllustration from '../assets/images/gallery-illustration.svg'
import { NotificationManager } from 'react-notifications'

import PageHero from '../layout/PageHero'
import Button from '../layout/buttons/Button'
import EditBox from '../layout/forms/EditBox'
import CircleLoader from '../layout/loaders/CircleLoader'
import ErrorBoundary from '../components/ErrorBoundary'

const ImageList = lazy(() => import('../components/gallery/ImageList'))
const UploadImage = lazy(() => import('../components/gallery/UploadImage'))

class Gallery extends Component {
	static propTypes = {
		isAdmin: PropTypes.bool,
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
		const { isAdmin, gallery_title, gallery_content } = this.props
		const { loading, data } = this.state

		return (
			<>
				<PageHero data-aos="flip-up">
					<PageHero.Img src={GalleryIllustration} />
					<PageHero.Content>
						<PageHero.Title>
							<EditBox
								name="gallery_title"
								value={gallery_title}
								label="Tytuł strony galeri"
								type="textarea"
							>
								{isAdmin && !gallery_title
									? 'BRAK TREŚCI'
									: gallery_title}
							</EditBox>
						</PageHero.Title>
						<PageHero.Text>
							<EditBox
								name="gallery_content"
								value={gallery_content}
								label="Treść strony galeri"
								type="textarea"
							>
								{isAdmin && !gallery_content
									? 'BRAK TREŚCI'
									: gallery_content}
							</EditBox>
						</PageHero.Text>
					</PageHero.Content>
				</PageHero>
				<PageHero vertical>
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
					{isAdmin && (
						<ErrorBoundary>
							<Suspense fallback={<CircleLoader />}>
								<UploadImage>
									<Button primary>Dodaj zdjęcia</Button>
								</UploadImage>
							</Suspense>
						</ErrorBoundary>
					)}

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
				</PageHero>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
	gallery_title: state.data.cms.data.gallery_title || '',
	gallery_content: state.data.cms.data.gallery_content || '',
})

export default connect(mapStateToProps, null)(Gallery)
