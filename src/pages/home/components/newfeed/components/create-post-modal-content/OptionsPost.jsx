import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import {
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	REVIEW_VERB_SHARE,
} from 'constants';
import { useSelector } from 'react-redux';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	REVIEW_VERB_SHARE,
];

const OptionsPost = ({ list, addOptionsToPost, taggedData, postDataShare }) => {
	const [itemOnMouseHover, setItemOnMouseHover] = useState(null);

	const chartImgShare = useSelector(state => state.chart.updateImgPost);

	return list.map((item, index) => {
		let isActive = false;
		let isDisabled = false;

		if (
			((!_.isEmpty(postDataShare) && verbShareArray.indexOf(postDataShare.verb) !== -1) ||
				chartImgShare.length) &&
			item.value !== 'addFriends'
		) {
			isDisabled = true;
		}
		isActive = taggedData[item.value].length > 0 || !_.isEmpty(taggedData[item.value]) ? true : false;

		return (
			<span
				className={classNames('create-post-modal-content__main__options__item-add-to-post', {
					'active': isActive,
					'disabled': isDisabled,
				})}
				onClick={e => {
					e.stopPropagation();
					addOptionsToPost(item);
				}}
				onMouseOver={() => setItemOnMouseHover(index)}
				onMouseLeave={() => setItemOnMouseHover(null)}
				key={index}
			>
				<div
					className={classNames('create-post-modal-content__main__options__item-add-to-post__popover', {
						'show': itemOnMouseHover === index,
					})}
				>
					{item.title.charAt(0).toUpperCase() + item.title.slice(1)}{' '}
					{item.value !== 'addFriends' && ' (Bắt buộc)'}
				</div>
				{item.icon}
			</span>
		);
	});
};

OptionsPost.defaultProps = {
	taggedData: {},
	list: [],
	addOptionsToPost: () => {},
	postDataShare: {},
};

OptionsPost.propTypes = {
	taggedData: PropTypes.object.isRequired,
	list: PropTypes.array,
	postDataShare: PropTypes.object,
	addOptionsToPost: PropTypes.func,
};

export default OptionsPost;