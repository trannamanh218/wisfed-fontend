import CreatPost from 'pages/home/components/newfeed/components/creat-post';
import React from 'react';
import Post from 'shared/post';
import './mainPostGroup.scss';

function MainPostGroup() {
	const data = {
		postInformations: {
			id: 1,
			userAvatar: '/images/avatar.png',
			userName: 'Trần Văn Đức',
			bookImage: '',
			bookName: '',
			isLike: true,
			likeNumber: 15,
			commentNumber: 1,
			shareNumber: 3,
		},
		likeAction: postInformations => {
			return postInformations;
		},
	};

	return (
		<div className='main-content__container'>
			<CreatPost />
			<div className='main-content__post'>
				<Post postInformations={data} className={''} />
				<Post postInformations={data} className={''} />
				<Post postInformations={data} className={''} />
			</div>
		</div>
	);
}

export default MainPostGroup;
