import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BadgeList = ({ list, className }) => {
	if (list && list.length) {
		return list.map((item, index) => (
			<Badge className={className} key={index} bg='primary-light'>
				{item?.name || item.title || item?.category?.name}
			</Badge>
		));
	}

	return null;
};

BadgeList.defaultProps = {
	list: [],
	className: '',
};

BadgeList.propType = {
	list: PropTypes.array,
	className: PropTypes.string,
};

export default BadgeList;
