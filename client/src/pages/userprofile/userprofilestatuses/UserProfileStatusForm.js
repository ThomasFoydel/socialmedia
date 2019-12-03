import React, { useState } from 'react';
import Axios from 'axios';

const UserProfileStatusForm = ({ token, setStatusesArray, statusesArray }) => {
  const [statusValue, setStatusValue] = useState('');

  const handleChange = e => {
    setStatusValue(e.target.value);
  };

  const handleSubmit = () => {
    if (statusValue) {
      Axios.post(
        '/status/poststatus',
        { statusContent: statusValue },
        { headers: { 'x-auth-token': token } }
      ).then(result => {
        setStatusesArray([result.data, ...statusesArray]);
        setStatusValue('');
      });
    }
  };

  return (
    <div className='userprofilestatusform'>
      <textarea
        onChange={handleChange}
        value={statusValue}
        className='userprofilestatusinput'
        placeholder='status...'
      />
      <div onClick={handleSubmit} className='userprofilestatusformsubmit'>
        submit
      </div>
    </div>
  );
};

export default UserProfileStatusForm;
