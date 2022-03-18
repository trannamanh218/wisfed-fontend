import classNames from 'classnames';
import { BookIcon, CategoryIcon, CloseX, Feather, GroupIcon, Image, Lock, PodCast, WorldNet } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity, getSuggestionForPost } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
import ShareModeComponent from './ShareModeComponent';
import CreatPostSubModal from './CreatePostSubModal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { getPreviewUrl } from 'reducers/redux-utils/post';
import { useCallback } from 'react';
import { Circle as CircleLoading } from 'shared/loading';
import './style.scss';
import UserAvatar from 'shared/user-avatar';

function CreatPostModalContent({ hideCreatPostModal, showModalCreatPost, option, onChangeOption, onChangeNewPost }) {
	const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> });
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [suggestionData, setSuggestionData] = useState([]);
	const mentionData = useRef({});
	const [taggedData, setTaggedData] = useState({
		'addBook': {},
		'addAuthor': [],
		'addFriends': [],
		'addCategory': [],
		'addImages': [],
	});
	const [fetchingUrlInfo, setFetchingUrlInfo] = useState(false);
	const [hasUrl, setHasUrl] = useState(false);
	const [urlAdded, setUrlAdded] = useState({});
	const [urlAddedArray, setUrlAddedArray] = useState([]);
	const [oldUrlAddedArray, setOldUrlAddedArray] = useState([]);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [showUpload, setShowUpload] = useState(false);
	const dispatch = useDispatch();
	const textFieldEdit = useRef(null);

	const { userInfo } = useSelector(state => state.auth);

	const optionList = [
		{
			value: 'addBook',
			title: 'sách',
			icon: <BookIcon />,
			message: 'Không tìm thấy cuốn sách nào',
		},

		{
			value: 'addAuthor',
			title: 'tác giả',
			icon: <Feather className='item-add-to-post-svg' />,
			message: 'Không tìm thấy tác giả',
		},
		{
			value: 'addCategory',
			title: 'chủ đề',
			icon: <CategoryIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy chủ đề',
		},
		{
			value: 'addFriends',
			title: 'bạn bè',
			icon: <GroupIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy bạn bè',
		},
		{
			value: 'addImages',
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
			createSpanElements();
		});
		return () => {
			document.removeEventListener('input', handlePlaceholder);
		};
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
				setUrlAddedArray([]);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		if (!_.isEqual(urlAddedArray, oldUrlAddedArray)) {
			getPreviewUrlFnc(urlAddedArray[urlAddedArray.length - 1]);
			setOldUrlAddedArray(urlAddedArray);
		}
	}, [urlAddedArray]);

	const createSpanElements = () => {
		const subStringArray = textFieldEdit.current.innerText.split(' ');
		textFieldEdit.current.innerText = '';
		const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
		for (let i = 0; i < subStringArray.length; i++) {
			if (subStringArray[i].match(urlRegex)) {
				subStringArray[i] = `<span class="url-color">${subStringArray[i]}</span>`;
			} else {
				subStringArray[i] = `<span>${subStringArray[i]}</span>`;
			}
		}
		textFieldEdit.current.innerHTML = subStringArray.join(' ');
		placeCaretAtEnd(textFieldEdit.current);
	};

	const placeCaretAtEnd = el => {
		el.focus();
		if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
			const range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != 'undefined') {
			const textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(false);
			textRange.select();
		}
	};

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

	const fetchSuggestion = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option, userInfo })).unwrap();
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
		if (param.value === 'modifyImages') {
			setShowMainModal(true);
		}
	};

	const handleOpenUploadImage = () => {
		setShowUpload(true);
		addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
	};

	const deleteImage = imageIndex => {
		const newImagesArray = [...taggedData.addImages];
		newImagesArray.splice(imageIndex, 1);
		setTaggedData(prev => ({ ...prev, 'addImages': newImagesArray }));
		if (!newImagesArray.length) {
			backToMainModal();
			addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
		}
	};

	const handleAddToPost = data => {
		const newData = { ...taggedData };

		if (option.value === 'addAuthor' || option.value === 'addFriends' || option.value === 'addCategory') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];

			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				listData.push(data);
			}

			newData[option.value] = listData;
		} else if (option.value === 'addBook') {
			newData[option.value] = data;
		} else if (option.value === 'addImages') {
			newData[option.value] = data;
			setShowMainModal(false);
		}

		setTaggedData(newData);
	};

	const removeTaggedItem = (data, type) => {
		if (type !== 'addBook') {
			const currentTaggedList = taggedData[type];
			const newList = currentTaggedList.filter(item => item.id !== data.id);
			setTaggedData(prev => ({ ...prev, [type]: newList }));
		} else {
			setTaggedData(prev => ({ ...prev, [type]: {} }));
		}
	};

	const generateData = () => {
		const params = {
			msg: textFieldEdit?.current?.innerHTML,
			mentionsUser: [],
			mentionsAuthor: [],
			mentionsCategory: [],
			image: [],
			preview: urlAdded,
		};

		if (taggedData.addFriends.length) {
			params.mentionsUser = taggedData.addFriends.map(item => item.id);
		}
		if (taggedData.addAuthor.length) {
			params.mentionsAuthor = taggedData.addAuthor.map(item => item.id);
		}

		if (taggedData.addImages.length) {
			params.image = taggedData.addImages;
		}

		if (taggedData.addCategory.length) {
			params.mentionsCategory = taggedData.addCategory.map(item => item.id);
		}

		if (!_.isEmpty(taggedData.addBook)) {
			params.bookId = taggedData.addBook.id;
		}

		return params;
	};

	const onCreatePost = () => {
		const params = generateData();

		// book, author , topic is required
		if ((params.bookId || params.mentionsAuthor.length || params.mentionsCategory.length) && params.msg) {
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
			(!_.isEmpty(taggedData.addBook) || taggedData.addAuthor.length || taggedData.addCategory.length) &&
			textFieldEdit.current?.innerHTML
		) {
			isActive = true;
		}
		return isActive;
	};

	return (
		<div className='creat-post-modal-content'>
			<CircleLoading loading={status === STATUS_LOADING} />
			{/*main */}
			<div
				className={classNames('creat-post-modal-content__main', {
					'hide': option.value !== 'addImages' && !showMainModal,
				})}
			>
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
					id='createPostForm'
				>
					<div className='creat-post-modal-content__main__body'>
						<div className='creat-post-modal-content__main__body__user-info'>
							<div className='creat-post-modal-content__main__body__user-info__block-left'>
								<UserAvatar className='newfeed__creat-post__avatar' source={userInfo?.avatarImage} />
							</div>
							<div className='creat-post-modal-content__main__body__user-info__block-right'>
								<p>
									{userInfo.fullName || userInfo.lastName || userInfo.firstName || 'Không xác định'}

									{taggedData.addFriends.length ? (
										<>
											<span className='d-inline-block mx-1'>cùng với</span>
											{taggedData.addFriends.map(item => (
												<span key={item.id}>
													{item.fullName ||
														item.lastName ||
														item.firstName ||
														'Không xác định'}
												</span>
											))}
										</>
									) : (
										''
									)}
								</p>
								<ShareModeComponent
									list={shareModeList}
									shareMode={shareMode}
									setShareMode={setShareMode}
								/>
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
							<TaggedList taggedData={taggedData} removeTaggedItem={removeTaggedItem} type='addBook' />
							<TaggedList taggedData={taggedData} removeTaggedItem={removeTaggedItem} type='addAuthor' />
							<TaggedList
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type='addCategory'
							/>

							{!_.isEmpty(taggedData.addBook) && <PostEditBook data={taggedData.addBook} />}
							{showUpload && (
								<UploadImage
									addOptionsToPost={addOptionsToPost}
									optionList={optionList}
									handleAddToPost={handleAddToPost}
									taggedData={taggedData}
								/>
							)}
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
							</div>
						</div>
						<button
							className={classNames('creat-post-modal-content__main__submit', {
								'active': checkActive(),
							})}
							type='submit'
							form='createPostForm'
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
			<div
				className={classNames('creat-post-modal-content__substitute', {
					'show': option.value !== 'addImages' && !showMainModal,
				})}
			>
				<CreatPostSubModal
					option={option}
					backToMainModal={backToMainModal}
					deleteImage={deleteImage}
					optionList={optionList}
					fetchSuggestion={fetchSuggestion}
					suggestionData={suggestionData}
					handleAddToPost={handleAddToPost}
					mentionData={mentionData.current}
					taggedData={taggedData}
					removeTaggedItem={removeTaggedItem}
					addOptionsToPost={addOptionsToPost}
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
