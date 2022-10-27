import NormalContainer from 'components/layout/normal-container';
import React from 'react';
import notFoundImage from 'assets/images/404.png';
import './not-found.scss';
import { Link } from 'react-router-dom';

function NotFound() {
	return (
		<NormalContainer>
			<div className='not-found'>
				<h4 className='not-found__title'>Opps!... Đã có lỗi xảy ra</h4>
				<p>Vui lòng thử truy cập lại</p>
				<img src={notFoundImage} alt='not found' />
				<Link className='btn btn-primary not-found__btn' to='/'>
					Về trang chủ
				</Link>
			</div>
		</NormalContainer>
	);
}

export default NotFound;
