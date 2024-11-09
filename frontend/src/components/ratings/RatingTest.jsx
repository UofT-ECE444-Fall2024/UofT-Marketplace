import React from 'react';
import ReadRating from './ReadRating'
import WriteRating from './WriteRating'

const RatingTest = ({username, fullname}) => {
    return (
        <div>
            <WriteRating username={username} fullname={fullname}/>
            <ReadRating username={username} fullname={fullname}/>
        </div>
    )
}
export default RatingTest;