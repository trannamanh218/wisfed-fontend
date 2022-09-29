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

	const inputRef = useRef();
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

	const fetchSuggestion = async (input, option) => {
		setIsFetchingSuggestions(true);
		try {
			if (option.value === 'addAuthor' && input.length > 0) {
				const params = { q: input, type: 'authors' };
				const data = await dispatch(getFilterSearch(params)).unwrap();
				setSuggestionData(data.rows);
			} else {
				const data = await dispatch(getSuggestionForPost({ input, option, userInfo })).unwrap();
				setSuggestionData(data.rows);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingSuggestions(false);
		}
	};

	const debounceSearch = useCallback(_.debounce(fetchSuggestion, 1000), []);

	const updateInputSearchValue = e => {
		debounceSearch(e.target.value, option);
	};

	const handleComplete = () => {
		backToMainModal();
		inputRef.current.value = '';
	};

	return (
		<>
			<div className='creat-post-modal-content__substitute__header'>
				<button className='creat-post-modal-content__substitute__back' onClick={handleComplete}>
					<BackArrow />
				</button>
				<h5>{option.value === 'modifyImages' ? option.title : `Thêm ${option.title} vào bài viết`}</h5>
				<button style={{ visibility: 'hidden' }} className='creat-post-modal-content__substitute__back'>
					<BackArrow />
				</button>
			</div>

			{option.value === 'modifyImages' ? (
				<>
					<div className='creat-post-modal-content__substitute__body__modifyImages-container'>
						<div
							className={classNames('creat-post-modal-content__substitute__body__modifyImages-box', {
								'one-or-two-images': images.length <= 2,
								'more-two-images': images.length > 2,
							})}
						>
							{images.map((image, index) => (
								<div key={index} className='creat-post-modal-content__substitute__modify-image-item'>
									<img src={URL.createObjectURL(image)} alt='image' />
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
						{isFetchingSuggestions ? (
							<LoadingIndicator />
						) : (
							<>
								{option.value === 'addBook' && !_.isEmpty(taggedData.addBook) && (
									<span
										className='badge bg-primary-light badge-book'
										onClick={() => removeTaggedItem(taggedData.addBook, 'addBook')}
									>
										<span>{taggedData.addBook.name}</span>
										<CloseX />
									</span>
								)}
								<TaggedList
									taggedData={taggedData}
									removeTaggedItem={removeTaggedItem}
									type={option.value}
								/>

								{suggestionData && suggestionData.length !== 0 && !inputRef.current.value && (
									<h5>Gợi ý</h5>
								)}
								{suggestionData && suggestionData.length !== 0 && inputRef.current.value && (
									<h5>Kết quả tìm kiếm</h5>
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
