import React, { useState } from 'react';
import './group-settings-question.scss';
import { BackArrow } from 'components/svg';

function SettingsQuestions() {
	const [key, setKey] = useState('text');

	const rederTextQuesrion = () => {
		return <div></div>;
	};
	return (
		<div className='settings-question__container'>
			<div className='settings-question__title'>
				<button>
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
				<div></div>
			</div>
		</div>
	);
}

export default SettingsQuestions;
