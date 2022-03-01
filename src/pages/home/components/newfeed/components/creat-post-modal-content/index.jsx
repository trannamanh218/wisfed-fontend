import avatar from 'assets/images/avatar.png';
import classNames from 'classnames';
import { BookIcon, CategoryIcon, CloseX, Feather, GroupIcon, Image, Lock, PodCast, WorldNet } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity, getSuggestion } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
import ShareModeComponent from './ShareModeComponent';
import './style.scss';
import CreatPostSubModal from './sub-modal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from './PreviewLink';
import { getPreviewUrl } from 'reducers/redux-utils/post';
import { useCallback } from 'react';

function CreatPostModalContent({ hideCreatPostModal, showModalCreatPost, option, onChangeOption, onChangeNewPost }) {
	const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> });
	const [show, setShow] = useState(false);
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [suggestionData, setSuggestionData] = useState([]);
	const [images, setImages] = useState([]);
	const mentionData = useRef({});
	const [taggedData, setTaggedData] = useState({
		'add-book': {},
		'add-author': [],
		'add-friends': [],
		'add-topic': [],
	});
	const [fetchingUrlInfo, setFetchingUrlInfo] = useState(false);
	const [hasUrl, setHasUrl] = useState(false);
	const [urlAdded, setUrlAdded] = useState({});
	const [urlAddedArray, setUrlAddedArray] = useState([]);

	const [status, setStatus] = useState(STATUS_IDLE);
	const [showUpload, setShowUpload] = useState(false);
	const dispatch = useDispatch();
	const textFieldEdit = useRef(null);

	const { userInfo } = useSelector(state => state.auth);

	const optionList = [
		{
			value: 'add-book',
			title: 'sách',
			icon: <BookIcon />,
			message: 'Không tìm thấy cuốn sách nào',
		},

		{
			value: 'add-author',
			title: 'tác giả',
			icon: <Feather className='item-add-to-post-svg' />,
			message: 'Không tìm thấy tác giả',
		},
		{
			value: 'add-topic',
			title: 'chủ đề',
			icon: <CategoryIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy chủ đề',
		},
		{
			value: 'add-friends',
			title: 'bạn bè',
			icon: <GroupIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy bạn bè',
		},
		{
			value: 'modify-images',
			title: 'chỉnh sửa ảnh',
			icon: <Image />,
			message: '',
		},
	];

	const shareModeList = [
		{ value: 'public', title: 'Mọi người', icon: <WorldNet /> },
		{ value: 'friends', title: 'Bạn bè', icon: <GroupIcon /> },
		{ value: 'followers', title: 'Người Follow', icon: <PodCast /> },
		{ value: 'private', title: 'Chỉ mình tôi', icon: <Lock /> },
	];

	useEffect(() => {
		textFieldEdit.current.focus();
	}, []);

	useEffect(() => {
		textFieldEdit.current.addEventListener('input', () => {
			handlePlaceholder();
			detectUrl();
		});

		return document.removeEventListener('input', handlePlaceholder);
	}, [showTextFieldEditPlaceholder]);

	useEffect(() => {
		if (!_.isEmpty(option)) {
			setShowMainModal(prev => !prev);
		}
	}, [option]);

	const detectUrl = useCallback(
		_.debounce(() => {
			const urlRegex =
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
			const url = textFieldEdit.current.innerText.match(urlRegex);
			if (url !== null) {
				setUrlAddedArray(url);
				setHasUrl(true);
			} else {
				setHasUrl(false);
				setUrlAdded({});
				setUrlAddedArray([]);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		if (urlAddedArray.length > 0) {
			getPreviewUrlFnc(urlAddedArray[urlAddedArray.length - 1]);
		}
	}, [urlAddedArray.length]);

	const getPreviewUrlFnc = async url => {
		setFetchingUrlInfo(true);
		const data = { 'url': url };
		try {
			const res = await dispatch(getPreviewUrl(data)).unwrap();
			setUrlAdded(res);
		} catch (err) {
			const obj = { url: url, title: url, images: [] };
			setUrlAdded(obj);
		} finally {
			setFetchingUrlInfo(false);
		}
	};

	const removeUrlPreview = () => {
		setHasUrl(false);
	};

	// const addOptionsToPost = param => {
	// 	setOption(param);
	// 	setShowMainModal(false);
	// };

	// const addImages = e => {
	// 	const obj = Object.entries(e.target.files);
	// 	const newArrayFile = [...images];
	// 	obj.forEach(item => newArrayFile.push(item[1]));
	// 	setImages(newArrayFile);
	// }

	const handlePlaceholder = () => {
		if (textFieldEdit.current.innerText.length > 0) {
			setShowTextFieldEditPlaceholder(false);
		} else {
			setShowTextFieldEditPlaceholder(true);
		}
	};

	useEffect(() => {
		if (images.length === 1) {
			document.querySelector('.img-0').style.inset = '0%';
		} else if (images.length === 2) {
			document.querySelector('.img-0').style.inset = '0% 0% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 0% 0% 0%';
		} else if (images.length === 3) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 0% 0% 50%';
		} else if (images.length === 4) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 66.67% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 33.335% 0% 33.335%';
			document.querySelector('.img-3').style.inset = '66.67% 0% 0% 66.67%';
		} else if (images.length > 4) {
			document.querySelector('.img-0').style.inset = '0% 50% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '0% 0% 66.67% 50%';
			document.querySelector('.img-3').style.inset = '33.335% 0% 33.335% 50%';
			document.querySelector('.img-4').style.inset = '66.67% 0% 0% 50%';
		}
	}, [images]);

	const fetchSuggestion = async (input, option) => {
		try {
			const data = await dispatch(getSuggestion({ input, option, userInfo })).unwrap();
			setSuggestionData(data.rows);
		} catch (err) {
			return err;
		}
	};

	const backToMainModal = () => {
		setShowMainModal(true);
	};

	const addOptionsToPost = param => {
		onChangeOption(param);
	};

	const addImages = e => {
		const obj = Object.entries(e.target.files);
		const newArrayFile = [...images];
		obj.forEach(item => newArrayFile.push(item[1]));
		setImages(newArrayFile);
	};

	const handleOpenUploadImage = () => {
		setShowUpload(prev => !prev);
	};

	const removeImages = () => {
		document.getElementById('image-upload').value = '';
		setImages([]);
	};

	const deleteImage = imageIndex => {
		const newImagesArray = [...images];
		newImagesArray.splice(imageIndex, 1);
		setImages(newImagesArray);
	};

	const handleAddToPost = data => {
		const newData = { ...taggedData };

		if (option.value === 'add-author' || option.value === 'add-friends' || option.value === 'add-topic') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];

			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				listData.push(data);
			}

			newData[option.value] = listData;
		} else if (option.value === 'add-book') {
			newData[option.value] = data;
		}

		setTaggedData(newData);
	};

	const removeTaggedItem = (data, type) => {
		if (type !== 'add-book') {
			const currentTaggedList = taggedData[type];
			const newList = currentTaggedList.filter(item => item.id !== data.id);
			setTaggedData(prev => ({ ...prev, [type]: newList }));
		} else {
			setTaggedData(prev => ({ ...prev, [type]: {} }));
		}
	};

	const onCreatePost = () => {
		let mentionsUser = [];
		let mentionsAuthor = [];

		if (taggedData['add-friends'].length) {
			mentionsUser = taggedData['add-friends'].map(item => item.id);
		}
		if (taggedData['add-author'].length) {
			mentionsAuthor = taggedData['add-author'].map(item => item.id);
		}

		const params = {
			msg: textFieldEdit?.current?.innerHTML,
			mentionsUser,
			mentionsAuthor,
			image: [],
		};

		if (taggedData['add-book']) {
			params['bookId'] = taggedData['add-book'].id;
		}

		// thieu tag topic
		if (params.msg && (params.mentionsAuthor.length || params.bookId)) {
			setStatus(STATUS_LOADING);

			dispatch(createActivity(params))
				.unwrap()
				.then(() => {
					setStatus(STATUS_SUCCESS);
					toast.success('Tạo post thành công!');
					onChangeNewPost();
				})
				.catch(err => {
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
					toast.error('Tạo post thất bại!');
				})
				.finally(() => {
					hideCreatPostModal();
					onChangeOption({});
				});
		}
	};

	const checkActive = () => {
		let isActive = false;

		if (
			textFieldEdit.current?.innerHTML &&
			(!_.isEmpty(taggedData['add-book']) || taggedData['add-author'].length)
		) {
			isActive = true;
		}
		return isActive;
	};

	return (
		<div className='creat-post-modal-content'>
			{/* main modal */}
			<div className={classNames('creat-post-modal-content__main', { 'hide': !showMainModal })}>
				<div className='creat-post-modal-content__main__header'>
					<div style={{ visibility: 'hidden' }} className='creat-post-modal-content__main__close'>
						<CloseX />
					</div>
					<h5>Tạo bài viết</h5>
					<button className='creat-post-modal-content__main__close' onClick={hideCreatPostModal}>
						<CloseX />
					</button>
				</div>
				<Form
					onSubmit={e => {
						e.preventDefault();
						onCreatePost();
					}}
				>
					<div className='creat-post-modal-content__main__body'>
						<div className='creat-post-modal-content__main__body__user-info'>
							<div className='creat-post-modal-content__main__body__user-info__block-left'>
								<img src={avatar} alt='avatar' />
							</div>
							<div className='creat-post-modal-content__main__body__user-info__block-right'>
								<p>
									{userInfo.fullName || userInfo.lastName || userInfo.firstName || 'Không xác định'}
								</p>
								<div className='creat-post-modal-content__main__body__user-info__share-mode-container'>
									<div
										className={classNames(
											'creat-post-modal-content__main__body__user-info__share-mode',
											{
												'show': show,
												'hide': !show,
											}
										)}
										onClick={() => setShow(!show)}
									>
										<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
											{shareMode.icon}
											<span>{shareMode.title}</span>
											<div>
												<i className='fas fa-caret-down'></i>
											</div>
										</div>
										<div
											className={classNames(
												'creat-post-modal-content__main__body__user-info__share-mode__list',
												{
													'show': show,
													'hide': !show,
												}
											)}
										>
											<ShareModeComponent
												list={shareModeList}
												shareMode={shareMode}
												setShareMode={setShareMode}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div
							className={classNames('creat-post-modal-content__main__body__text-field-edit-wrapper', {
								'height-higher': showUpload || hasUrl,
							})}
						>
							<div
								className='creat-post-modal-content__main__body__text-field-edit'
								contentEditable={true}
								ref={textFieldEdit}
							></div>
							<div
								className={classNames('creat-post-modal-content__main__body__text-field-placeholder', {
									'hide': !showTextFieldEditPlaceholder,
								})}
							>
								Hãy chia sẻ cảm nhận của bạn về cuốn sách
							</div>
							{/* <div
								className={classNames('creat-post-modal-content__main__body__image-container', {
									'one-image': images.length === 1,
									'more-one-image': images.length > 1,
								})}
							>
								<div className='creat-post-modal-content__main__body__image-box'>
									{images.length > 0 && images.length < 6 ? (
										<>
											{images.map((image, index) => (
												<div
													key={index}
													className={`creat-post-modal-content__main__body__image img-${index}`}
												>
													<img src={URL.createObjectURL(image)} alt='image' />
												</div>
											))}
										</>
									) : (
										<>
											{images.length >= 6 && (
												<>
													{images.map((image, index) => {
														if (index < 4) {
															return (
																<div
																	key={index}
																	className={`creat-post-modal-content__main__body__image img-${index}`}
																>
																	<img src={URL.createObjectURL(image)} alt='image' />
																</div>
															);
														}
													})}
													<div
														className={`creat-post-modal-content__main__body__image img-4`}
													>
														<img src={URL.createObjectURL(images[4])} alt='image' />
														<div className='creat-post-modal-content__main__body__image-over'>
															+{images.length - 5}
														</div>
													</div>
												</>
											)}
										</>
									)}
									<div className='creat-post-modal-content__main__body__image-options'>
										<div className='creat-post-modal-content__main__body__image-options__block-left'>
											<button
												className='creat-post-modal-content__main__body__image-options__button'
												onClick={() => addOptionsToPost(optionList[length - 1])}
											>
												<Pencil />
												<span>Chỉnh sửa tất cả</span>
											</button>
											<label
												htmlFor='image-upload'
												className='creat-post-modal-content__main__body__image-options__button'
											>
												<Image />
												<span>Thêm ảnh</span>
											</label>
										</div>
										<button
											className='creat-post-modal-content__main__body__image-options__delete-image'
											onClick={removeImages}
										>
											<CloseX />
										</button>
									</div>
								</div>
							</div> */}
							{!_.isEmpty(taggedData['add-book']) && (
								<a href='#' className='tagged-book'>
									{taggedData['add-book'].name}
								</a>
							)}
							<TaggedList
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type={'add-author'}
							/>
							<TaggedList
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type={'add-topic'}
							/>

							{!_.isEmpty(taggedData['add-book']) && <PostEditBook data={taggedData['add-book']} />}
							{showUpload && <UploadImage addOptionsToPost={addOptionsToPost} optionList={optionList} />}
							{hasUrl && !showUpload && (
								<PreviewLink
									urlData={urlAdded}
									isFetching={fetchingUrlInfo}
									removeUrlPreview={removeUrlPreview}
								/>
							)}
						</div>
					</div>

					<div className='creat-post-modal-content__main__options-and-submit'>
						<div className='creat-post-modal-content__main__options'>
							<span>Thêm vào bài viết</span>
							<div className='creat-post-modal-content__main__options__items'>
								<OptionsPost
									list={optionList}
									addOptionsToPost={addOptionsToPost}
									taggedData={taggedData}
								/>
								<label
									htmlFor='image-upload'
									className='creat-post-modal-content__main__options__item-add-to-post'
									onClick={handleOpenUploadImage}
								>
									<Image />
								</label>
								{/* <input
									id='image-upload'
									type='file'
									onChange={addImages}
									accept='image/png, image/gif, image/jpeg'
									multiple
								/> */}
							</div>
						</div>
						<button
							className={classNames('creat-post-modal-content__main__submit', {
								'active': checkActive(),
							})}
							type='submit'
							onSubmit={e => {
								e.preventDefault();
								onCreatePost();
							}}
						>
							Đăng
						</button>
					</div>
				</Form>
			</div>
			{/* sub modal */}
			<div className={classNames('creat-post-modal-content__substitute', { 'show': !showMainModal })}>
				<CreatPostSubModal
					option={option}
					backToMainModal={backToMainModal}
					images={images}
					deleteImage={deleteImage}
					optionList={optionList}
					fetchSuggestion={fetchSuggestion}
					suggestionData={suggestionData}
					handleAddToPost={handleAddToPost}
					mentionData={mentionData.current}
					taggedData={taggedData}
					removeTaggedItem={removeTaggedItem}
				/>
			</div>
		</div>
	);
}

CreatPostModalContent.propTypes = {
	hideCreatPostModal: PropTypes.func,
	showModalCreatPost: PropTypes.bool,
	option: PropTypes.object,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
};

export default CreatPostModalContent;
