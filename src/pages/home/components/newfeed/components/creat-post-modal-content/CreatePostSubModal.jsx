import classNames from 'classnames';
import { BackArrow, CloseX, Search } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import SuggestSection from './SuggestSection';
import TaggedList from './TaggedList';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
// import { checkBookInLibrary } from 'reducers/redux-utils/library';
import { generateQuery } from 'helpers/Common';

function CreatPostSubModal(props) {
	const {
		option,
		backToMainModal,
		deleteImage,
		fetchSuggestion,
		suggestionData,
		handleAddToPost,
		taggedData,
		removeTaggedItem,
		addOptionsToPost,
	} = props;
	const inputRef = useRef();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		if (taggedData.addImages.length === 0) {
			backToMainModal();
		}
	}, [taggedData.addImages]);

	useEffect(() => {
		fetchSuggestion('', option);
	}, [option]);

	const debounceSearch = useCallback(_.debounce(fetchSuggestion, 1000), []);

	const updateInputSearchValue = e => {
		debounceSearch(e.target.value, option);
	};

	const handleComplete = async () => {
		// if (!_.isEmpty(taggedData.addBook)) {
		// 	console.log(userInfo);
		// 	const filter = [
		// 		{ 'operator': 'eq', 'value': userInfo.id, 'property': 'updatedBy' },
		// 		{ 'operator': 'eq', 'value': taggedData.addBook.id, 'property': 'bookId' },
		// 	];
		// 	const query = generateQuery(1, 10, JSON.stringify(filter));
		// 	try {
		// 		await dispatch(checkBookInLibrary(query));
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// }

		if (option.value === 'modifyImages') {
			addOptionsToPost({
				value: 'addImages',
				title: 'chỉnh sửa ảnh',
			});
		}
		backToMainModal();
		inputRef.current.value = '';
	};

	return (
		<>
			<div className='creat-post-modal-content__substitute__header'>
				<button className='creat-post-modal-content__substitute__back' onClick={handleComplete}>
					<BackArrow />
				</button>
				<h5>
					{option.value === 'modifyImages'
						? `${option.title.charAt(0).toUpperCase() + option.title.slice(1)}`
						: `Thêm ${option.title} vào bài viết`}
				</h5>
				<button style={{ visibility: 'hidden' }} className='creat-post-modal-content__substitute__back'>
					<BackArrow />
				</button>
			</div>

			{option.value === 'modifyImages' ? (
				<>
					<div className='creat-post-modal-content__substitute__body__modifyImages-container'>
						<div
							className={classNames('creat-post-modal-content__substitute__body__modifyImages-box', {
								'one-or-two-images': taggedData.addImages.length <= 2,
								'more-two-images': taggedData.addImages.length > 2,
							})}
						>
							{taggedData.addImages.map((image, index) => (
								<div key={index} className='creat-post-modal-content__substitute__modify-image-item'>
									<img src={image} alt='image' />
									<button
										className='creat-post-modal-content__substitute__modify-image-item-delete'
										onClick={() => deleteImage(index)}
									>
										<CloseX />
									</button>
								</div>
							))}
						</div>
					</div>
					<div className='creat-post-modal-content__substitute__body__modifyImages-confirm'>
						<button onClick={handleComplete}>Xong</button>
					</div>
				</>
			) : (
				<div className='creat-post-modal-content__substitute__body'>
					<div className='creat-post-modal-content__substitute__search-container'>
						<div className='creat-post-modal-content__substitute__search-bar'>
							<Search />
							<input
								ref={inputRef}
								className='creat-post-modal-content__substitute__search-bar__input'
								placeholder={`Tìm kiếm ${option.title} để thêm vào bài viết`}
								onChange={updateInputSearchValue}
							/>
						</div>
						<button
							className='creat-post-modal-content__substitute__search-bar__button'
							onClick={handleComplete}
						>
							Xong
						</button>
					</div>
					<div className='creat-post-modal-content__substitute__search-result'>
						{option.value === 'addBook' && !_.isEmpty(taggedData.addBook) && (
							<span
								className='badge bg-primary-light badge-book'
								onClick={() => removeTaggedItem(taggedData.addBook, 'addBook')}
							>
								<span>{taggedData.addBook.name}</span>
								<CloseX />
							</span>
						)}
						<TaggedList taggedData={taggedData} removeTaggedItem={removeTaggedItem} type={option.value} />

						{suggestionData && suggestionData.length !== 0 && !inputRef.current.value && <h5>Gợi ý</h5>}
						{suggestionData && suggestionData.length !== 0 && inputRef.current.value && (
							<h5>Kết quả tìm kiếm</h5>
						)}

						<SuggestSection
							option={option}
							list={suggestionData}
							handleAddToPost={handleAddToPost}
							taggedData={taggedData}
						/>
					</div>
				</div>
			)}
		</>
	);
}

CreatPostSubModal.propTypes = {
	option: PropTypes.object,
	backToMainModal: PropTypes.func,
	images: PropTypes.array,
	deleteImage: PropTypes.func,
	suggestionData: PropTypes.array,
	fetchSuggestion: PropTypes.func.isRequired,
	handleAddToPost: PropTypes.func.isRequired,
	taggedData: PropTypes.object,
	removeTaggedItem: PropTypes.func,
	addOptionsToPost: PropTypes.func,
};

export default CreatPostSubModal;
