import React, { useState } from 'react';
import Axios from 'axios';

const UserProfileStatusDeleteButton = ({
  status,
  token,
  handleUpdateStatusArrayFromIndividualStatus,
  statusesArray
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteStatus = () => {
    Axios.post(
      '/status/deletestatus',
      { statusId: status._id },
      { headers: { 'x-auth-token': token } }
    ).then(result => {
      handleUpdateStatusArrayFromIndividualStatus(result.data);
    });
  };

  const openDelete = () => {
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    setDeleteOpen(false);
  };

  return (
    <div>
      {deleteOpen ? (
        <>
          <div className='userprofilestatusdeleteopen'>
            <i className='fa fa-trash fa-trash-icon' aria-hidden='true'></i>
          </div>

          <div className='userprofilestatusdeleteoptions'>
            <div
              onClick={deleteStatus}
              className='userprofilestatusdeleteconfirm'
            >
              confirm
            </div>
            <div
              onClick={closeDelete}
              className='userprofilestatusdeletecancel'
            >
              cancel
            </div>
          </div>
        </>
      ) : (
        <div onClick={openDelete} className='userprofilestatusdeleteopen'>
          <i className='fa fa-trash fa-trash-icon' aria-hidden='true'></i>
        </div>
      )}
    </div>
  );
};

export default UserProfileStatusDeleteButton;
