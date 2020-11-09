import React from 'react';
import './Notifications.css';

const Notification = ({ notification: { type, content } }) => {
  let component = null;
  switch (type) {
    case 'error':
      component = (
        <div className="notification errorNotification">
          {content}
        </div>
      );
      break;
    case 'success':
      component = (
        <div className="notification successNotification">
          {content}
        </div>
      );
      break;

    default:
      component = (
        <div className="notification">
          {content}
        </div>
      );
      break;
  }
  return component;
};

const Notifications = ({ notifications }) => notifications.map(
  (notification) => (
    <Notification
      key={notification.id}
      notification={notification}
    />
  ),
);

export default Notifications;
