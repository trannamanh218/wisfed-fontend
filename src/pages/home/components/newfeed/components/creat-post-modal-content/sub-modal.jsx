import classNames from 'classnames';
import { BackArrow, CloseX, Search } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import SuggestSection from './SuggestSection';
import TaggedList from './TaggedList';

import './style.scss';
function CreatPostSubModal(props) {
	const {
		option,
		backToMainModal,
		images,
		deleteImage,
		fetchSuggestion,
		suggestionData,
		handleAddToPost,
		taggedData,
		removeTaggedItem,
	} = props;
	const inputRef = useRef();

	useEffect(() => {
		if (images.length === 0) {
			backToMainModal();
		}
	}, [images]);

	useEffect(() => {
		fetchSuggestion('', option);
	}, [option]);

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
				<h5>{option.value === 'modify-images' ? option.title : `Thêm ${option.title} vào bài viết`}</h5>
				<button style={{ visibility: 'hidden' }} className='creat-post-modal-content__substitute__back'>
					<BackArrow />
				</button>
			</div>

			{option.value === 'modify-images' ? (
				<>
					<div className='creat-post-modal-content__substitute__body__modify-images-container'>
						<div
							className={classNames('creat-post-modal-content__substitute__body__modify-images-box', {
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
					<div className='creat-post-modal-content__substitute__body__modify-images-confirm'>
						<button onClick={backToMainModal}>Xong</button>
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
						{option.value === 'add-book' && !_.isEmpty(taggedData['add-book']) && (
							<span
								className='badge bg-primary-light badge-book'
								onClick={() => removeTaggedItem(taggedData['add-book'], 'add-book')}
							>
								<span>{taggedData['add-book'].name}</span>
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
};

export default CreatPostSubModal;
