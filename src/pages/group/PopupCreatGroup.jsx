import React from 'react';
import { Image } from 'react-bootstrap';

const PopupCreatGroup = () => {
	return (
		<div>
			<div>
				<h3>Tạo nhóm</h3>
				<button>x</button>
			</div>
			<div>
				<div className='upload-image__wrapper'>
					<div className='dropzone upload-image'>
						<Image className='upload-image__icon' />
						<p className='upload-image__description'>Thêm ảnh từ thiết bị</p>
						<span>hoặc kéo thả</span>
					</div>
				</div>
			</div>
			<div></div>
		</div>
	);
};

export default PopupCreatGroup;
