import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseX, Feather } from 'components/svg';

const TaggedList = props => {
	const { taggedData, removeTaggedItem, type } = props;

	if (type && type !== 'addBook') {
		const list = taggedData[type];
		if (list && list.length) {
			return (
				<ul className='tagged'>
					{list.map(item => (
						<li key={item.id} className={classNames('badge bg-primary-light', { [type]: type })}>
							{type === 'addAuthor' && <Feather />}
							<span>
								{item.name || item.fullName || item.firstName + ' ' + item.lastName || 'Không xác định'}
							</span>
							<CloseX
								className='badge__close-btn'
								onClick={() => {
									removeTaggedItem(item, type);
								}}
							/>
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
