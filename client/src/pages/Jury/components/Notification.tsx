import React, { useState, useEffect } from "react";

const Notification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <div>
      <button onClick={() => addNotification("This is a notification!")}>
        Show Notification
      </button>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id),
            )
          }
        />
      ))}
    </div>
  );
};

export default NotificationSystem;
