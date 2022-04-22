import React, { useRef, useState } from 'react';
import './group-settings-question.scss';
import { BackArrow } from 'components/svg';
import PropTypes from 'prop-types';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';

function SettingsQuestions({ handleChange }) {
	const [questionType, setQuestionType] = useState('');
	const [questionType1, setQuestionType1] = useState('');
	const [questionType2, setQuestionType2] = useState('');
	const ListQuestion = [
		{ value: 'checkbox', title: 'Ô đánh dấu' },
		{ value: 'radio', title: 'Trắc nghiệm' },
		{ value: 'text', title: ' Câu hỏi trả lời tự do' },
	];

	const ListQuestionRef = useRef({ value: 'text', title: 'Câu hỏi trả lời tự do' });
	const ListQuestionRef1 = useRef({ value: 'text', title: 'Câu hỏi trả lời tự do' });
	const ListQuestionRef2 = useRef({ value: 'text', title: 'Câu hỏi trả lời tự do' });
	const onchangeKindOfJoin = data => {
		ListQuestionRef.current = data;
		setQuestionType(data.value);
	};
	const onchangeKindOfJoin1 = data => {
		ListQuestionRef.current = data;
		setQuestionType1(data.value);
	};
	const onchangeKindOfJoin2 = data => {
		ListQuestionRef.current = data;
		setQuestionType2(data.value);
	};

	return (
		<div className='settings-question__container'>
			<div className='settings-question__title'>
				<button onClick={() => handleChange('tabs')}>
					<BackArrow />
				</button>
				<div className='settings-question__title-content'>
					<h2>Câu hỏi duyệt thành viên</h2>
				</div>
			</div>
			<hr />
			<div className='settings-question__main-content'>
				<div className='settings-question__content'>
					<span>
						Đặt tối đa 3 câu hỏi chọn thành viên cho người muốn tham gia nhóm. Chỉ quản trị viên và người
						kiểm duyệt mới xem được câu hỏi
					</span>
				</div>
				<div className='settings-question__question'>
					<div className='settings-question__question-header'>
						<Input placeholder='Điền câu hỏi' isBorder={false} />
						<SelectBox
							name='timePost'
							list={ListQuestion}
							defaultOption={ListQuestionRef.current}
							onChangeOption={onchangeKindOfJoin}
						/>
					</div>
					<div>
						{questionType === 'checkbox' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question check-box-1'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 2'></input>
								</div>
							</div>
						)}
						{questionType === 'radio' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className='settings-question__question'>
					<div className='settings-question__question-header'>
						<Input placeholder='Điền câu hỏi' isBorder={false} />
						<SelectBox
							name='timePost'
							list={ListQuestion}
							defaultOption={ListQuestionRef1.current}
							onChangeOption={onchangeKindOfJoin1}
						/>
					</div>
					<div>
						{questionType1 === 'checkbox' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question check-box-1'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 2'></input>
								</div>
							</div>
						)}
						{questionType1 === 'radio' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className='settings-question__question'>
					<div className='settings-question__question-header'>
						<Input placeholder='Điền câu hỏi' isBorder={false} />
						<SelectBox
							name='timePost'
							list={ListQuestion}
							defaultOption={ListQuestionRef2.current}
							onChangeOption={onchangeKindOfJoin2}
						/>
					</div>
					<div>
						{questionType2 === 'checkbox' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question check-box-1'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='checkbox' />
									<input type='text' placeholder='Câu trả lời 2'></input>
								</div>
							</div>
						)}
						{questionType2 === 'radio' && (
							<div className='checbox-item-question-select'>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
								<div className='checbox-item-question'>
									<input className='check-box__input' type='radio' />
									<input type='text' placeholder='Câu trả lời 1'></input>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className='question__button'>
					<button>Lưu thay đổi</button>
				</div>
			</div>
		</div>
	);
}

SettingsQuestions.propTypes = {
	handleChange: PropTypes.func,
};

export default SettingsQuestions;
