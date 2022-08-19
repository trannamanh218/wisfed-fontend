import PropTypes from 'prop-types';
import noSearchResult from 'assets/images/no-search-result.png';
import BookSlider from 'shared/book-slider';
import UserAvatar from 'shared/user-avatar';

const SuggestSection = props => {
	const { option, list, handleAddToPost } = props;

	if (list.length > 0) {
		switch (option.value) {
			case 'addBook': {
				return <BookSlider list={list} handleViewBookDetail={handleAddToPost} />;
			}
			case 'addAuthor':
				return (
					<div>
						<div className='creat-post-modal-content__substitute__suggest-author-container'>
							{list.map(item => (
								<div
									className='creat-post-modal-content__substitute__suggest-author-item'
									key={item.id}
									onClick={() => handleAddToPost(item)}
								>
									<UserAvatar size='lg' {...item} />
									<div className='creat-post-modal-content__substitute__suggest-author__name'>
										{item.fullName || item.lastName || item.firstName || 'Không xác định'}
									</div>
								</div>
							))}
						</div>
					</div>
				);

			case 'addCategory':
				return (
					<div className='creat-post-modal-content__substitute__suggest-topic-container'>
						{list.map(item => (
							<button
								className='creat-post-modal-content__substitute__suggest-topic-item'
								key={`${item.name}-${item.id}`}
								onClick={() => handleAddToPost(item)}
							>
								{item.name}
							</button>
						))}
					</div>
				);
			case 'addFriends':
				return (
					<div className='creat-post-modal-content__substitute__suggest-author-container'>
						{list.map(item => {
							const friendInfo = item;
							return (
								<div
									className='creat-post-modal-content__substitute__suggest-author-item'
									key={item.id}
									onClick={() => handleAddToPost(friendInfo)}
								>
									<UserAvatar size='lg' {...friendInfo} />
									<div className='creat-post-modal-content__substitute__suggest-author__name'>
										{friendInfo?.fullName ||
											friendInfo?.firstName + ' ' + friendInfo.lastName ||
											'Không xác định'}
									</div>
								</div>
							);
						})}
					</div>
				);

			default:
				return '';
		}
	}

	if (option.value !== 'modifyImages' || !list.length)
		return (
			<div className='creat-post-modal-content__substitute__no-search-result'>
				<img src={noSearchResult} alt='no search result' />
				<span>{option.message}</span>
			</div>
		);
};

SuggestSection.defaultProps = {
	option: {},
	list: [],
	handleAddToPost: () => {},
};

SuggestSection.propTypes = {
	option: PropTypes.object.isRequired,
	list: PropTypes.array.isRequired,
	handleAddToPost: PropTypes.func.isRequired,
};

export default SuggestSection;
