import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'shared/button';
import FitlerOptions from 'shared/filter-options';
import { Add, ArrowsDownUp } from 'components/svg';
import './filter-quote-pane.scss';
import CreatQuotesModal from 'shared/create-quotes-modal';
import FormCheckGroup from 'shared/form-check-group';
import classNames from 'classnames';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';

const FilterQuotePane = ({
	filterOptions,
	currentOption,
	handleChangeOption,
	children,
	handleSortQuotes,
	hasFilters,
}) => {
	const [showCreatQuotesModal, setShowCreatQuotesModal] = useState(false);
	const [showDropdownMenu, setShowDropdownMenu] = useState(false);
	const [sortValue, setSortValue] = useState('default');

	const creatQuotesModalContainer = useRef(null);
	const scrollBlocked = useRef(false);
	const sortDropdownMenu = useRef(null);

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;

	const dispatch = useDispatch();

	const radioOptions = [
		{
			value: 'default',
			title: 'Quote nhiều like nhất',
		},
		{
			value: 'newest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
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

	const creatQuotes = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setShowCreatQuotesModal(true);
		}
	};

	const hideCreatQuotesModal = () => {
		setShowCreatQuotesModal(false);
	};

	useEffect(() => {
		if (showCreatQuotesModal) {
			creatQuotesModalContainer.current.addEventListener('mousedown', e => {
				if (e.target === creatQuotesModalContainer.current) {
					setShowCreatQuotesModal(false);
				}
			});
			blockScroll();
		} else {
			allowScroll();
		}
	}, [showCreatQuotesModal]);

	const blockScroll = () => {
		if (!body || !body.style || scrollBlocked.current) return;
		const scrollBarWidth = window.innerWidth - html.clientWidth;
		const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0;
		html.style.position = 'relative';
		html.style.overflow = 'hidden';
		body.style.position = 'relative';
		body.style.overflow = 'hidden';
		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;
		scrollBlocked.current = true;
	};

	const allowScroll = () => {
		if (!body || !body.style || !scrollBlocked.current) return;
		html.style.position = '';
		html.style.overflow = '';
		body.style.position = '';
		body.style.overflow = '';
		body.style.paddingRight = '';
		scrollBlocked.current = false;
	};

	const handleChange = data => {
		setSortValue(data);
	};

	const checkClickTarget = e => {
		if (sortDropdownMenu.current && !sortDropdownMenu.current.contains(e.target)) {
			setShowDropdownMenu(false);
		}
	};

	return (
		<>
			<div className='filter-quote-pane'>
				<div className='filter-quote-pane__heading'>
					<Button className='filter-quote-pane__btn' varient='primary-light' onClick={creatQuotes}>
						<Add className='filter-quote-pane__icon' />{' '}
						<span className='filter-quote-pane__text'>Tạo Quotes</span>
					</Button>
					{hasFilters && (
						<FitlerOptions
							list={filterOptions}
							currentOption={currentOption}
							handleChangeOption={handleChangeOption}
							name='filter-user'
							className='filter-quote-pane__options'
						/>
					)}

					<div className='filter-quote-pane__config dropdown' ref={sortDropdownMenu}>
						<button
							className='filter-pane__btn dropdown-toggle'
							onClick={() => setShowDropdownMenu(!showDropdownMenu)}
						>
							<ArrowsDownUp />
						</button>
						<div
							className={classNames('filter-quote-pane__setting dropdown-menu', {
								'show': showDropdownMenu,
							})}
						>
							<div className='filter-quote-pane__setting__group'>
								<h6 className='filter-quote-pane__setting__title'>Mặc định</h6>
								<FormCheckGroup
									data={radioOptions[0]}
									name='custom'
									type='radio'
									defaultValue='default'
									handleChange={handleChange}
									checked={radioOptions[0].value === sortValue}
								/>
								<h6 style={{ marginTop: '24px' }} className='filter-quote-pane__setting__title'>
									Theo thời gian tạo
								</h6>
								<FormCheckGroup
									data={radioOptions[1]}
									name='custom'
									type='radio'
									defaultValue='default'
									handleChange={handleChange}
									checked={radioOptions[1].value === sortValue}
								/>
								<FormCheckGroup
									data={radioOptions[2]}
									name='custom'
									type='radio'
									defaultValue='default'
									handleChange={handleChange}
									checked={radioOptions[2].value === sortValue}
								/>
							</div>
							<Button
								className='filter-quote-pane__setting__btn'
								onClick={() => {
									handleSortQuotes(sortValue);
									setShowDropdownMenu(false);
								}}
							>
								Xác nhận
							</Button>
						</div>
					</div>
				</div>

				<div className='filter-quote-pane__content'>{children}</div>
			</div>
			{showCreatQuotesModal && (
				<div className='create-quotes-modal-container' ref={creatQuotesModalContainer}>
					<CreatQuotesModal hideCreatQuotesModal={hideCreatQuotesModal} />
				</div>
			)}
		</>
	);
};

FilterQuotePane.propTypes = {
	filterOptions: PropTypes.array,
	currentOption: PropTypes.object,
	handleChangeOption: PropTypes.func,
	children: PropTypes.any,
	handleSortQuotes: PropTypes.func,
	hasFilters: PropTypes.bool,
};

export default FilterQuotePane;
