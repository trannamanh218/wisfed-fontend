import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createTargetRead, renderTargetReadingProgress } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { NotificationError } from 'helpers/Error';
import Frame from 'assets/images/Frame.png';
import { blockInvalidChar } from 'constants';

const GoalsNotSetYet = ({ userInfo }) => {
	const [inputValue, setInputValue] = useState(0);
	const dispatch = useDispatch();

	useEffect(() => {
		if (inputValue < 0) {
			setInputValue(0);
		}
		if (inputValue.length > 3) {
			setInputValue(inputValue.slice(0, 3));
		}
		if (inputValue % 1 !== 0) {
			setInputValue(Math.floor(inputValue));
		}
	}, [inputValue]);

	const inputOnBlur = () => {
		if (inputValue === '') {
			setInputValue(0);
		}
	};

	const handleChangeTarget = async () => {
		if (inputValue < 1) {
			const customId = 'custom-Id-GoalsNotSetYet';
			toast.error('Mục tiêu phải lớn hơn 0', { toastId: customId });
		} else {
			try {
				const dob = new Date();
				const year = dob.getFullYear();
				const params = {
					year: year,
					numberBook: inputValue,
				};
				await dispatch(createTargetRead(params)).unwrap();
				const customId = 'custom-Id-GoalsNotSetYet-handleChangeTarget';
				return toast.success('Tạo mục tiêu thành công', { toastId: customId });
			} catch (err) {
				NotificationError(err);
			} finally {
				dispatch(renderTargetReadingProgress(true));
			}
		}
	};

	return (
		<>
			<div className='reading-target__process reading-target__custom'>
				<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
				<div className='reading-target__content_container'>
					<div className='reading-target__title'>Thử thách bản thân bạn để đọc nhiều sách hơn!</div>
					<div className='read-challenge__input'>
						<button
							data-testid='read-challenge__decrease-btn'
							className='read-challenge__input__button-element'
							onClick={() => setInputValue(Number(inputValue) - 1)}
						>
							&#8722;
						</button>
						<input
							data-testid='read-challenge__input'
							type='number'
							min='0'
							value={inputValue}
							className='read-challenge__input__input-element'
							onChange={e => setInputValue(e.target.value)}
							onFocus={() => setInputValue('')}
							onBlur={inputOnBlur}
							onKeyDown={blockInvalidChar}
						/>
						<button
							data-testid='read-challenge__increase-btn'
							className='read-challenge__input__button-element'
							onClick={() => setInputValue(Number(inputValue) + 1)}
						>
							&#43;
						</button>
					</div>
					<button onClick={handleChangeTarget} className='read-challenge__start-challenge-btn'>
						Đặt mục tiêu
					</button>
				</div>
			</div>
			<img style={{ marginTop: '60px' }} src={Frame} alt='' />
		</>
	);
};

GoalsNotSetYet.propTypes = {
	userInfo: PropTypes.object,
};
export default GoalsNotSetYet;
