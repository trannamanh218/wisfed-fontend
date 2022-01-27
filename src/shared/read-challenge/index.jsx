import './style.scss';
import readChallengeImg from 'assets/images/read-challenge-img.jpg';
import { useEffect, useState } from 'react';

function ReadChallenge() {
	const [inputValue, setInputValue] = useState(0);

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
					<button className='read-challenge__start-challenge-btn'>Bắt đầu thử thách</button>
				</div>
			</div>
		</div>
	);
}

export default ReadChallenge;
