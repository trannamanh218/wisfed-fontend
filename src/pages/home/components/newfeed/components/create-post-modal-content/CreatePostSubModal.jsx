import classNames from 'classnames';
import { BackArrow, CloseX, Search } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import SuggestSection from './SuggestSection';
import TaggedList from './TaggedList';
import './style.scss';
import { useDispatch } from 'react-redux';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { useState } from 'react';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';
import { getFilterSearch } from 'reducers/redux-utils/search';

function CreatPostSubModal({
	option,
	backToMainModal,
	deleteImage,
	handleAddToPost,
	taggedData,
	removeTaggedItem,
	images,
	userInfo,
}) {
	const [suggestionData, setSuggestionData] = useState([]);
	const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(true);
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [sugesstionTitle, setSuggestionTitle] = useState(true);

	const initialSuggestions = useRef([]);

	const dispatch = useDispatch();

	useEffect(() => {
		if (option.value === 'addImages' && images.length === 0) {
			backToMainModal();
		}
	}, [images]);

	useEffect(() => {
		setSuggestionData([]);
		fetchSuggestion('', option);
	}, [option]);

	useEffect(() => {
		setSuggestionData(initialSuggestions.current);
		setInputSearchValue('');
		setSuggestionTitle(true);
	}, [taggedData]);

	const fetchSuggestion = async (input, option) => {
		setIsFetchingSuggestions(true);
		try {
			let data;
			if (input.length && option.value !== 'addFriends') {
				const params = {
					q: input,
					type:
						option.value === 'addBook' ? 'books' : option.value === 'addAuthor' ? 'authors' : 'categories',
				};
				data = await dispatch(getFilterSearch({ ...params })).unwrap();
			} else {
				data = await dispatch(getSuggestionForPost({ input, option, userInfo })).unwrap();
			}
			setSuggestionData(data.rows);
			if (!input) {
				initialSuggestions.current = data.rows;
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingSuggestions(false);
			if (input.length) {
				setSuggestionTitle(false);
			} else {
				setSuggestionTitle(true);
			}
		}
	};

	const debounceSearch = useCallback(_.debounce(fetchSuggestion, 1000), []);

	const updateInputSearchValue = e => {
		setInputSearchValue(e.target.value);
		debounceSearch(e.target.value, option);
	};

	const handleComplete = () => {
		backToMainModal();
		setInputSearchValue('');
	};

	return (
		<>
			<div className='create-post-modal-content__substitute__header'>
				<button className='create-post-modal-content__substitute__back' onClick={handleComplete}>
					<BackArrow />
				</button>
				<h5>{option.value === 'modifyImages' ? option.title : `Thêm ${option.title} vào bài viết`}</h5>
				<button style={{ visibility: 'hidden' }} className='create-post-modal-content__substitute__back'>
					<BackArrow />
				</button>
			</div>

			{option.value === 'modifyImages' ? (
				<>
					<div className='create-post-modal-content__substitute__body__modifyImages-container'>
						<div
							className={classNames('create-post-modal-content__substitute__body__modifyImages-box', {
								'one-or-two-images': images.length <= 2,
								'more-two-images': images.length > 2,
							})}
						>
							{images.map((image, index) => (
								<div key={index} className='create-post-modal-content__substitute__modify-image-item'>
									{typeof image === 'string' ? (
										<img src={image} alt='image' />
									) : (
										<img src={URL.createObjectURL(image)} alt='image' />
									)}
									<button
										className='create-post-modal-content__substitute__modify-image-item-delete'
										onClick={() => deleteImage(index)}
									>
										<CloseX />
									</button>
								</div>
							))}
						</div>
					</div>
					<div className='create-post-modal-content__substitute__body__modifyImages-confirm'>
						<button onClick={handleComplete}>Xong</button>
					</div>
				</>
			) : (
				<div className='create-post-modal-content__substitute__body'>
					<div className='create-post-modal-content__substitute__search-container'>
						<div className='create-post-modal-content__substitute__search-bar'>
							<Search />
							<input
								className='create-post-modal-content__substitute__search-bar__input'
								placeholder={`Tìm kiếm ${option.title} để thêm vào bài viết`}
								value={inputSearchValue}
								onChange={updateInputSearchValue}
							/>
						</div>
						<button
							className='create-post-modal-content__substitute__search-bar__button'
							onClick={handleComplete}
						>
							Xong
						</button>
					</div>
					<div className='create-post-modal-content__substitute__search-result'>
						<>
							{option.value === 'addBook' && !_.isEmpty(taggedData.addBook) && (
								<span
									className='badge bg-primary-light badge-book'
									onClick={() => removeTaggedItem(taggedData.addBook, 'addBook')}
								>
									<span>{taggedData.addBook.name}</span>
									<CloseX className='badge__close-btn' />
								</span>
							)}
							<TaggedList
								list={suggestionData}
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type={option.value}
							/>
							<div className='create-post-modal-content__substitute__search-result__content'>
								{isFetchingSuggestions ? (
									<LoadingIndicator />
								) : (
									<>
										{suggestionData && suggestionData.length !== 0 && (
											<>{sugesstionTitle ? <h5>Gợi ý</h5> : <h5>Kết quả tìm kiếm</h5>}</>
										)}

										<SuggestSection
											option={option}
											list={suggestionData}
											handleAddToPost={handleAddToPost}
											taggedData={taggedData}
										/>
									</>
								)}
							</div>
						</>
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
	handleAddToPost: PropTypes.func.isRequired,
	taggedData: PropTypes.object,
	removeTaggedItem: PropTypes.func,
	userInfo: PropTypes.object,
};

export default CreatPostSubModal;
