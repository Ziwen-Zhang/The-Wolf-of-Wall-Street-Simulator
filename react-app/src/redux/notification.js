export const LOAD_NOTIFICATIONS = "notifications/LOAD_NOTIFICATIONS";
export const MARK_NOTIFICATION_AS_READ =
  "notifications/MARK_NOTIFICATION_AS_READ";
export const POST_NOTIFICATION = "notifications/POST_NOTIFICATION";
export const DELETE_NOTIFICATION = "notifications/DELETE_NOTIFICATION";


export const deleteNotification = (notificationId) => ({
    type: DELETE_NOTIFICATION,
    notificationId,
  });

export const postNotification = (notification) => ({
  type: POST_NOTIFICATION,
  notification,
});

export const loadNotifications = (notifications) => ({
  type: LOAD_NOTIFICATIONS,
  notifications,
});

export const markNotificationAsRead = (notificationId) => ({
  type: MARK_NOTIFICATION_AS_READ,
  notificationId,
});

export const fetchNotifications = () => async (dispatch) => {
  try {
    const response = await fetch("/api/notification/");
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      dispatch(loadNotifications(data));
    } else {
      console.error("Failed to fetch notifications");
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

export const postNotificationThunk = (notificationData) => async (dispatch) => {
  try {
    const response = await fetch("/api/notification/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });

    if (response.ok) {
      const responseData = await response.json();

      if (responseData.message === "Notification already exists") {
        // console.log("Notification already exists, skipping dispatch.");
        return; 
      }
      dispatch(postNotification(responseData));
    } else {
      console.error("Failed to post notification");
    }
  } catch (error) {
    console.error("Error posting notification:", error);
  }
};


export const markNotificationAsReadThunk =
  (notificationId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        dispatch(markNotificationAsRead(notificationId));
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  export const deleteNotificationThunk = (notificationId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        dispatch(deleteNotification(notificationId));
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

const initialState = {
  notifications: [],
  unreadCount: 0,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
        unreadCount: action.notifications.filter((n) => !n.read).length,
      };

      case MARK_NOTIFICATION_AS_READ: {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        );
        return {
          ...state,
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.read).length,
        };
      }
    case POST_NOTIFICATION:
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
      case DELETE_NOTIFICATION:
        return {
          ...state,
          notifications: state.notifications.filter(
            (notification) => notification.id !== action.notificationId
          ),
          unreadCount: state.notifications.filter(
            (notification) => notification.id !== action.notificationId && !notification.read
          ).length,
        };

    default:
      return state;
  }
};
