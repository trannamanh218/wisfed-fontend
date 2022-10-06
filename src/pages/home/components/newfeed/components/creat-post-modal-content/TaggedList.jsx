import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseX, Feather } from 'components/svg';

const TaggedList = props => {
	const { taggedData, removeTaggedItem, type, handleFriend } = props;

	if (type && type !== 'addBook') {
		const list = taggedData[type];
		if (list && list.length) {
			return (
				<ul className='tagged'>
					{list.map(item => (
						<li
							key={item.id}
							className={classNames('badge bg-primary-light', { [type]: type })}
							onClick={() => {
								removeTaggedItem(item, type);
								handleFriend(item, null, 'remove');
							}}
						>
							{type === 'addAuthor' && <Feather />}
							<span>
								{item.name || item.fullName || item.lastName || item.firstName || 'Không xác định'}
							</span>
							<CloseX />
						</li>
					))}
				</ul>
			);
		}

		return '';
	}
	return '';
};

TaggedList.propTypes = {
	type: PropTypes.string,
	taggedData: PropTypes.object.isRequired,
	removeTaggedItem: PropTypes.func.isRequired,
};

export default TaggedList;
