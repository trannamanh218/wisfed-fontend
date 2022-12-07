import noSearchResult from 'assets/images/no-search-result.png';
import PropTypes from 'prop-types';
import BookSlider from 'shared/book-slider';
import UserAvatar from 'shared/user-avatar';
import { useEffect } from 'react';

const SuggestSection = props => {
	const { option, list, handleAddToPost, taggedData } = props;

	useEffect(() => {
		const parent = document.querySelector('.create-post-modal-content__substitute__search-result__content');
		if (parent) {
			const element = parent.querySelectorAll('.user-avatar');
			element.forEach(item => {
				item.style.width = item.offsetWidth.toString() + 'px';
				item.style.height = item.offsetWidth.toString() + 'px';
			});
		}
	}, []);

	if (list.length > 0) {
		switch (option.value) {
			case 'addBook': {
				return <BookSlider list={list} handleViewBookDetail={handleAddToPost} />;
			}
			case 'addAuthor':
				return (
					<div className='create-post-modal-content__substitute__suggest-user-container'>
						{list.map(item => {
							if (!taggedData.addAuthor.some(itemTagged => itemTagged.id === item.id)) {
								return (
									<div
										className='create-post-modal-content__substitute__suggest-author-item'
										key={item.id}
										onClick={() => handleAddToPost(item)}
									>
										<UserAvatar size='lg' {...item} />
										<div className='create-post-modal-content__substitute__suggest-author__name'>
											{item.fullName || item.lastName || item.firstName || 'Không xác định'}
										</div>
									</div>
								);
							}
						})}
					</div>
				);

			case 'addCategory':
				return (
					<div className='create-post-modal-content__substitute__suggest-topic-container'>
						{list.map(item => {
							if (!taggedData.addCategory.some(itemTagged => itemTagged.id === item.id)) {
								return (
									<button
										className='create-post-modal-content__substitute__suggest-topic-item'
										key={`${item.name}-${item.id}`}
										onClick={() => handleAddToPost(item)}
									>
										{item.name}
									</button>
								);
							}
						})}
					</div>
				);
			case 'addFriends':
				return (
					<div className='create-post-modal-content__substitute__suggest-user-container'>
						{list.map(item => {
							if (!taggedData.addFriends.some(itemTagged => itemTagged.id === item.id)) {
								return (
									<div
										className='create-post-modal-content__substitute__suggest-author-item'
										key={item.id}
										onClick={() => {
											handleAddToPost(item);
										}}
									>
										<UserAvatar size='lg' {...item} />
										<div className='create-post-modal-content__substitute__suggest-author__name'>
											{item?.fullName ||
												item?.firstName + ' ' + item.lastName ||
												'Không xác định'}
										</div>
									</div>
								);
							}
						})}
					</div>
				);

			default:
				return '';
		}
	}

	if (option.value !== 'modifyImages' || !list.length)
		return (
			<div className='create-post-modal-content__substitute__no-search-result'>
				<img src={noSearchResult} alt='no search result' />
				<span>{option.message}</span>
			</div>
		);
};

SuggestSection.defaultProps = {
	option: {},
	list: [],
	handleAddToPost: () => {},
	taggedData: {},
};

SuggestSection.propTypes = {
	option: PropTypes.object.isRequired,
	list: PropTypes.array.isRequired,
	handleAddToPost: PropTypes.func.isRequired,
	taggedData: PropTypes.object,
};

export default SuggestSection;
