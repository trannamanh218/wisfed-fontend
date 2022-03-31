import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

const OptionsPost = ({ list, addOptionsToPost, taggedData, images }) => {
	return list.map((item, index) => {
		let isActive = false;
		let isDisabled = false;
		if (item.value === 'addBook') {
			isActive = _.isEmpty(taggedData[item.value]) === true ? false : true;
			if (images.length > 0) {
				isDisabled = true;
			}
		} else {
			isActive = taggedData[item.value].length > 0 ? true : false;
		}

		return (
			<span
				className={classNames('creat-post-modal-content__main__options__item-add-to-post', {
					'active': isActive,
					'disabled': isDisabled,
				})}
				onClick={e => {
					e.stopPropagation();
					addOptionsToPost(item);
				}}
				key={index}
			>
				{item.icon}
			</span>
		);
	});
};

OptionsPost.propTypes = {
	taggedData: PropTypes.object.isRequired,
	list: PropTypes.array,
	images: PropTypes.array,
	addOptionsToPost: PropTypes.func,
};

export default OptionsPost;
