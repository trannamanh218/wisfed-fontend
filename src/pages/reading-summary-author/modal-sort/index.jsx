import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'shared/button';
import FormCheckGroup from 'shared/form-check-group';
import classNames from 'classnames';
import { Setting } from 'components/svg';

const ModalChart = ({ setChangeValue, changeValue, setSortValue, setSortValueKey }) => {
	const sortDropdownMenu = useRef(null);
	const [showDropdownMenu, setShowDropdownMenu] = useState(false);
	const [dataValue, setDatavalue] = useState('day');
	const [keyDatavalue, setKeydatavalue] = useState('read');
	const radioOptions = [
		{
			value: 'day',
			title: 'Ngày',
		},
		{
			value: 'month',
			title: 'Tháng',
		},
		{
			value: 'year',
			title: 'Năm',
		},
	];

	const radioOptionsValue = [
		{
			value: 'read',
			title: 'Lượt đọc',
		},
		{
			value: 'addToLibrary',
			title: 'Lượt thêm vào tủ sách',
		},
		{
			value: 'rate',
			title: 'Lượt đánh giá',
		},
		{
			value: 'review',
			title: 'Lượt Review',
		},
		{
			value: 'likeBook',
			title: 'Lượt Like',
		},
		{
			value: 'quote',
			title: 'Lượt Quote',
		},
	];

	useEffect(() => {
		if (sortDropdownMenu.current) {
			document.addEventListener('click', checkClickTarget);
		}
		return () => {
			document.removeEventListener('click', checkClickTarget);
		};
	}, []);

	const handleChange = data => {
		setDatavalue(data);
	};

	const handleChangekey = data => {
		setKeydatavalue(data);
	};

	const checkClickTarget = e => {
		if (!sortDropdownMenu.current.contains(e.target)) {
			setShowDropdownMenu(false);
		}
	};

	const handleClickSort = () => {
		setShowDropdownMenu(false);
		setChangeValue(!changeValue);
		setSortValue(dataValue);
		setSortValueKey(keyDatavalue);
	};

	return (
		<div className='filter-quote-pane__config dropdown' ref={sortDropdownMenu}>
			<div onClick={() => setShowDropdownMenu(!showDropdownMenu)} className='charts__setting'>
				<div className='charts__setting__title'>Tùy chỉnh</div>
				<Setting />
			</div>
			<div
				className={classNames('filter-quote-pane__setting dropdown-menu', {
					'show': showDropdownMenu,
				})}
			>
				<div className='filter-quote-pane__setting__group'>
					<h6 className='filter-quote-pane__setting__title'>Mặc định</h6>
					{radioOptions.map((item, index) => (
						<FormCheckGroup
							key={index}
							data={radioOptions[index]}
							name={item.value}
							type='radio'
							defaultValue='week'
							handleChange={handleChange}
							checked={radioOptions[index].value === dataValue}
						/>
					))}
					<h6 style={{ marginTop: '24px' }} className='filter-quote-pane__setting__title'>
						Theo thời gian tạo
					</h6>
					{radioOptionsValue.map((item, index) => (
						<FormCheckGroup
							key={index}
							data={radioOptionsValue[index]}
							name={item.value}
							type='radio'
							defaultValue='read'
							handleChange={handleChangekey}
							checked={radioOptionsValue[index].value === keyDatavalue}
						/>
					))}
				</div>
				<Button
					className='filter-quote-pane__setting__btn'
					onClick={() => {
						handleClickSort();
					}}
				>
					Xác nhận
				</Button>
			</div>
		</div>
	);
};
ModalChart.propTypes = {
	setSortValue: PropTypes.func,
	setSortValueKey: PropTypes.func,
	changeValue: PropTypes.bool,
	setChangeValue: PropTypes.func,
};
export default ModalChart;
