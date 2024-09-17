import { supabase } from "../lib/supabase";

export const createNotification = async (notificationData) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.log("Create notification error : ", error);
      return { success: false, msg: "Could not create notifications!" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Create notification error : ", error);
    return { success: false, msg: "Could not create notifications!" };
  }
};

export const fetchNotifications = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`*, sender: senderId (id, name, image)`)
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Fetch notification error : ", error);
      return { success: false, msg: "Could not fetch notifications!" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Fetch notification error : ", error);
    return { success: false, msg: "Could not fetch notifications!" };
  }
};
