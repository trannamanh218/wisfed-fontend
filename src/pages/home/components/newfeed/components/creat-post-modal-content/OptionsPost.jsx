import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const OptionsPost = ({ list, addOptionsToPost, taggedData }) => {
	const { isShare } = useSelector(state => state.post);
	const [itemOnMouseHover, setItemOnMouseHover] = useState(null);

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
	addOptionsToPost: PropTypes.func,
};

export default OptionsPost;
