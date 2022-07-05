import './style.scss';
import readChallengeImg from 'assets/images/read-challenge-img.jpg';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	updateTargetRead,
	createTargetRead,
	renderTargetReadingProgress,
	checkRenderTargetReading,
} from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { NotificationError } from 'helpers/Error';

function ReadChallenge({ modalOpen, setModalOpen }) {
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

	const handleChangeTarget = async () => {
		if (modalOpen) {
			try {
				const dob = new Date();
				const year = dob.getFullYear();
				const query = {
					numberBook: inputValue,
				};
				const params = {
					year: year,
					...query,
				};
				dispatch(checkRenderTargetReading(true));
				return await dispatch(updateTargetRead(params)).unwrap();
			} catch (err) {
				NotificationError(err);
			} finally {
				toast.success('Sửa mục tiêu thành công');
				setModalOpen(false);
				dispatch(checkRenderTargetReading(false));
			}
		} else {
			try {
				const dob = new Date();
				const year = dob.getFullYear();
				const params = {
					year: year,
					numberBook: inputValue,
				};
				await dispatch(createTargetRead(params)).unwrap();
				return toast.success('Tạo mục tiêu thành công');
			} catch (err) {
				NotificationError(err);
			} finally {
				dispatch(renderTargetReadingProgress(true));
			}
		}
	};

	const inputOnBlur = () => {
		if (inputValue === '') {
			setInputValue(0);
		}
	};

	return (
		<div className='read-challenge'>
			<h4 className='read-challenge__title'>Mục tiêu đọc sách</h4>
			<div className='read-challenge__content'>
				<div className='read-challenge__box'>
					<div className='read-challenge__description'>Thử thách bản thân bạn để đọc nhiều sách hơn!</div>
					<img style={{ marginBottom: '24px', width: '100%' }} src={readChallengeImg} alt='' />
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
							value={inputValue}
							className='read-challenge__input__input-element'
							onChange={e => setInputValue(e.target.value)}
							onFocus={() => setInputValue('')}
							onBlur={inputOnBlur}
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
						{modalOpen ? 'Thay đổi mục tiêu đọc sách' : 'Bắt đầu thử thách'}
					</button>
				</div>
			</div>
		</div>
	);
}
ReadChallenge.propTypes = {
	modalOpen: PropTypes.bool,
	setModalOpen: PropTypes.func,
};
export default ReadChallenge;
