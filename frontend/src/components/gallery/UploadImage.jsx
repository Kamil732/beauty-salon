import React, { useState } from 'react'

import axios from 'axios'
import getHeaders from '../../helpers/getHeaders'

import FormControl from '../../layout/forms/FormControl'
import Modal from '../../layout/Modal'
import ImageUploading from 'react-images-uploading'
import Button from '../../layout/buttons/Button'
import ButtonContainer from '../../layout/buttons/ButtonContainer'
import { NotificationManager } from 'react-notifications'

function UploadImage({ children, ...props }) {
	const [isOpen, setIsOpen] = useState(false)
	const [images, setImages] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const onChange = (imageList, addUpdateIndex) => {
		// Update images saving title
		if (imageList.length > 0 && addUpdateIndex)
			for (let i = 0; i < addUpdateIndex.length; i++)
				imageList[addUpdateIndex[i]].title =
					images[addUpdateIndex[i]]?.title || ''

		setImages(imageList)
	}

	const onChangeTitle = (e, index) =>
		setImages([
			...images.slice(0, index),
			{
				...images[index],
				title: e.target.value,
			},
			...images.slice(index + 1),
		])

	const onSubmit = async (e) => {
		e.preventDefault()

		setIsLoading(true)

		try {
			let config = getHeaders(true)
			config['headers']['Content-Type'] = 'multipart/form-data'

			let body = new FormData()
			for (let i = 0; i < images.length; i++) {
				const { file, title } = images[i]

				body.append(`image-${i}`, file)
				body.append(`title-${i}`, title)
			}

			await axios.post(
				`${process.env.REACT_APP_API_URL}/accounts/gallery/`,
				body,
				config
			)

			setImages([])
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać zdjęć')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{isOpen && (
				<Modal closeModal={() => setIsOpen(false)}>
					<Modal.Header>Dodaj zdjęcia do galeri</Modal.Header>
					<Modal.Body>
						<form onSubmit={onSubmit}>
							<FormControl>
								<ImageUploading
									multiple
									value={images}
									onChange={onChange}
									dataURLKey="url"
								>
									{({
										imageList,
										onImageUpload,
										onImageRemoveAll,
										onImageUpdate,
										onImageRemove,
										isDragging,
										dragProps,
									}) => (
										<>
											<div className="upload-image__images">
												{imageList.map(
													(image, index) => (
														<React.Fragment
															key={index}
														>
															<h4
																style={{
																	marginLeft:
																		'auto',
																}}
															>
																{index + 1}.
															</h4>
															<FormControl>
																<FormControl.Label
																	htmlFor={`title-${index}`}
																	inputValue={
																		images[
																			index
																		].title
																	}
																>
																	Tytuł
																</FormControl.Label>
																<FormControl.Input
																	id={`title-${index}`}
																	value={
																		images[
																			index
																		].title
																	}
																	onChange={(
																		e
																	) =>
																		onChangeTitle(
																			e,
																			index
																		)
																	}
																/>
															</FormControl>
															<figure className="upload-image__image-container">
																<img
																	src={
																		image[
																			'url'
																		]
																	}
																	alt=""
																	width="100"
																	className="upload-image__img"
																/>

																<ButtonContainer>
																	<Button
																		primary
																		small
																		onClick={() =>
																			onImageUpdate(
																				index
																			)
																		}
																		type="button"
																	>
																		Edytuj
																	</Button>
																	<Button
																		danger
																		small
																		onClick={() =>
																			onImageRemove(
																				index
																			)
																		}
																		type="button"
																	>
																		Usuń
																	</Button>
																</ButtonContainer>
															</figure>
														</React.Fragment>
													)
												)}
											</div>

											<ButtonContainer>
												<div
													className={`upload-image${
														isDragging
															? ' darg-over'
															: ''
													}`}
													onClick={onImageUpload}
													{...dragProps}
												>
													Kliknij albo upuść tutaj
												</div>

												{imageList.length > 0 && (
													<Button
														danger
														small
														onClick={
															onImageRemoveAll
														}
														type="reset"
													>
														Usuń wszystkie
													</Button>
												)}
											</ButtonContainer>
										</>
									)}
								</ImageUploading>
							</FormControl>

							<Button
								success
								type="submit"
								style={{ marginTop: '2rem' }}
								loading={isLoading}
								disabled={images.length === 0}
								className="center-item"
							>
								Dodaj {images.length} zdję
								{images.length === 0 || images.length > 4
									? 'ć'
									: images.length > 1
									? 'cia'
									: 'cie'}
							</Button>
						</form>
					</Modal.Body>
				</Modal>
			)}

			<span onClick={() => setIsOpen(!isOpen)} {...props}>
				{children}
			</span>
		</>
	)
}

export default UploadImage
