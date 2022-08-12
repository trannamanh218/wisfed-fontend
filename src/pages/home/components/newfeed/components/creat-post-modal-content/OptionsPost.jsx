import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UploadImage from './UploadImage';

const OptionsPost = ({ list, addOptionsToPost, taggedData, images }) => {
	const [itemOnMouseHover, setItemOnMouseHover] = useState(null);
	const { resetTaggedData, isShare, postsData, isSharePosts, isSharePostsAll, isShareTarget, UpdateImg } =
		useSelector(state => state.post);

	return list.map((item, index) => {
		let isActive = false;
		let isDisabled = false;
		if (isShare) {
			if (index !== 3) {
				isDisabled = true;
			}
		} else {
			if (item.value === 'addBook') {
				isActive = _.isEmpty(taggedData[item.value]) === true ? false : true;
			} else {
				isActive = taggedData[item.value].length > 0 ? true : false;
			}
		}
		let check;
		if (
			!_.isEmpty(taggedData.addBook) ||
			isShare ||
			isSharePosts ||
			isSharePostsAll.length > 0 ||
			postsData.verd === 'shareTarget' ||
			images.length > 0

			// postsData.UpdateImg.verd === 'tart'
		) {
			check = true;
		}
		console.log(postsData);
		return (
			<span
				className={classNames('creat-post-modal-content__main__options__item-add-to-post', {
					'active': isActive,
					'disabled': check && item.value !== 'addFriends',
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
					className={classNames('creat-post-modal-content__main__options__item-add-to-post__popover', {
						'show': itemOnMouseHover === index,
					})}
				>
					{item.title.charAt(0).toUpperCase() + item.title.slice(1)}
				</div>
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
