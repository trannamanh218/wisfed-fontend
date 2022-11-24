import SearchField from 'shared/search-field';
import { ForwardGroup } from 'components/svg';
import { useState, useEffect, useCallback } from 'react';
import '../sidebar-right/RightSideBarGroup.scss';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { getTagGroup } from 'reducers/redux-utils/group';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import LoadingIndicator from 'shared/loading-indicator';

export default function RightSidebarGroup({ update }) {
	const [numberIndex, setNumberIndex] = useState(6);
	const [show, setShow] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [tagGroup, setTagGroup] = useState([]);
	const [valueSearch, setValueSearch] = useState('');
	const [isFetching, setIsFetching] = useState(false);

	const { id = '' } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getListHashtags = async () => {
		setIsFetching(true);
		const params = {
			id: id,
			body: {
				sort: JSON.stringify([{ property: 'count', direction: 'DESC' }]),
				search: valueSearch,
			},
		};
		try {
			const res = await dispatch(getTagGroup(params)).unwrap();
			setTagGroup(res);
		} catch (error) {
			NotificationError(error);
		} finally {
			setIsFetching(false);
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
			setValueSearch(value.trim());
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

			{isFetching ? (
				<div style={{ marginTop: '15px' }}>
					<LoadingIndicator />
				</div>
			) : (
				<>
					{tagGroup.length > 0 ? (
						<>
							{tagGroup.map((item, index) => {
								return (
									<div key={index}>
										{index < numberIndex && (
											<div className='hastag__group'>
												<div
													className='hastag__group-name'
													onClick={() =>
														navigate(`/hashtag-group/${id}/${item.tagName.slice(1)}`)
													}
												>
													{item.tagName}
												</div>
												<div className='hastag__group-number'>
													{item.count < 10000 ? item.count : '9999+'} bài viết
												</div>
											</div>
										)}
									</div>
								);
							})}
						</>
					) : (
						<div className='hastag__group'>Không có dữ liệu</div>
					)}
				</>
			)}

			{tagGroup.length > 6 && (
				<button className={`${show && 'rotate__more'} more__btn`} onClick={() => handleChangeNumber()}>
					<ForwardGroup /> {`${show ? 'Thu gọn' : 'Xem thêm'}`}
				</button>
			)}
		</div>
	);
}

RightSidebarGroup.propTypes = {
	update: PropTypes.bool,
};
