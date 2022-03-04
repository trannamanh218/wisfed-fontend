import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

const OptionsPost = ({ list, addOptionsToPost, taggedData }) => {
	const lastIndex = list.length - 1;

	return list.map((item, index) => {
		if (index < lastIndex) {
			let isActive = false;
			if (item.value === 'addBook') {
				isActive = _.isEmpty(taggedData[item.value]) === true ? false : true;
			} else {
				isActive = taggedData[item.value].length > 0 ? true : false;
			}

			return (
				<span
					className={classNames('creat-post-modal-content__main__options__item-add-to-post', {
						'active': isActive,
					})}
					onClick={e => {
						e.stopPropagation();
						addOptionsToPost(item);
					}}
					key={item.value || index}
				>
					{item.icon}
				</span>
			);
		}
		return null;
	});
};

OptionsPost.propTypes = {
	taggedData: PropTypes.object.isRequired,
};

export default OptionsPost;
