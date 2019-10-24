import React from 'react';

import ChatFriendListIndividual from './ChatFriendListIndividual';

const ChatFriendList = ({ friendList, currentFriendId, updateCurrentUser }) => {
  const friendListFilteredOnline = friendList.filter(
    friend => friend.isOnline === true
  );

  const friendListFilteredNotOnline = friendList.filter(
    friend => friend.isOnline === false
  );

  const friendListOrderedByOnlineOrNot = [
    ...friendListFilteredOnline,
    ...friendListFilteredNotOnline
  ];

  return (
    <div className='chatfriendlist'>
      {friendListOrderedByOnlineOrNot.length > 0 &&
        friendListOrderedByOnlineOrNot.map(friend => (
          <ChatFriendListIndividual
            isOnline={friend.isOnline}
            id={friend.friendId}
            friendSocket={friend.socketId}
            key={friend.friendId}
            updateCurrentUser={updateCurrentUser}
          />
        ))}
    </div>
  );
};

export default ChatFriendList;
