import React, { useRef, useState } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';

const QuestionItem = () => {
	const [questionType, setQuestionType] = useState('');

	const ListQuestion = [
		{ value: 'checkbox', title: 'Ô đánh dấu' },
		{ value: 'radio', title: 'Trắc nghiệm' },
		{ value: 'text', title: ' Câu hỏi trả lời tự do' },
	];

	const ListQuestionRef = useRef({ value: 'text', title: 'Câu hỏi trả lời tự do' });
	const onchangeKindOfJoin = data => {
		ListQuestionRef.current = data;
		setQuestionType(data.value);
	};

	return (
		<div className='settings-question__container'>
			<div className='settings-question__main-content'>
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

				<div className='question__button'>
					<button>Lưu thay đổi</button>
				</div>
			</div>
		</div>
	);
};

export default {
	title: 'Components/Modules/QuestionItem',
	component: QuestionItem,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <QuestionItem {...args} />;

export const Default = Template.bind({});
