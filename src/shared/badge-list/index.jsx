import React from 'react';
import { Badge } from 'react-bootstrap';
import PropsTypes from 'prop-types';

const BadgeList = ({ list, className }) => {
	if (list && list.length) {
		return list.map((item, index) => (
			<Badge className={className} key={index} bg='primary-light'>
				{item.title}
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
	list: PropsTypes.array,
	className: PropsTypes.string,
};

export default BadgeList;
