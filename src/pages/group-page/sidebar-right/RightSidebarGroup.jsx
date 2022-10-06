import SearchField from 'shared/search-field';
import { ForwardGroup } from 'components/svg';
import { useState, useEffect, useCallback } from 'react';
import '../sidebar-right/RightSideBarGroup.scss';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { getTagGroup, searchGroupHashTag } from 'reducers/redux-utils/group';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

export default function RightSidebarGroup({ update }) {
	const [numberIndex, setNumberIndex] = useState(6);
	const [show, setShow] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [tagGroup, setTagGroup] = useState([]);
	const [valueSearch, setValueSearch] = useState('');

	const { id = '' } = useParams();
	const dispatch = useDispatch();

	const getListHashtags = async () => {
		const params = {
			id: id,
			body: {
				sort: JSON.stringify([{ property: 'count', direction: 'DESC' }]),
				search: JSON.stringify(valueSearch),
			},
		};
		try {
			const res = await dispatch(getTagGroup(params)).unwrap();
			setTagGroup(res);
		} catch (error) {
			NotificationError(error);
		}
	};

	const handleChangeNumber = () => {
		if (numberIndex === 6) {
			setNumberIndex(tagGroup?.length);
			setShow(!show);
		} else {
			setNumberIndex(6);
			setShow(!show);
		}
	};

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const updateInputSearch = value => {
		if (value) {
			setValueSearch(value.toLowerCase().trim());
		} else {
			setValueSearch('');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	useEffect(() => {
		getListHashtags();
	}, [update, valueSearch]);

	return (
		<div className='group-sibar-right'>
			<h2>Hashtag</h2>
			<SearchField placeholder='Tìm kiếm hashtag' value={inputSearch} handleChange={onChangeInputSearch} />
			<div>
				{tagGroup.map((item, index) => {
					return (
						<>
							{index < numberIndex && (
								<div className='hastag__group' key={index}>
									<div className='hastag__group-name'>{item.tagName}</div>
									<div className='hastag__group-number'>
										{item.count < 10000 ? item.count : '9999+'} bài viết
									</div>
								</div>
							)}
						</>
					);
				})}

				{tagGroup.length > 6 && (
					<>
						{!show ? (
							<button className='more__btn' onClick={() => handleChangeNumber()}>
								<ForwardGroup /> Xem thêm
							</button>
						) : (
							<button className='more__btn rotate__more' onClick={() => handleChangeNumber()}>
								<ForwardGroup />
								Thu gọn
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}

RightSidebarGroup.propTypes = {
	update: PropTypes.bool,
};
