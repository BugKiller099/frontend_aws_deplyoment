import { useCallback } from "react"
import axios from "axios"
import { BASE_URL } from "./constants"

const PLACEHOLDER_AVATAR = "/placeholder.svg"

export const useFetchMessages = (targetUserId, userId, setMessages, setTargetUserInfo) => {
  return useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      })
      const chatData = response.data
      console.log("Raw chat data:", chatData)

      const chatMessages = chatData.messages.map((msg) => {
        const sender = msg.senderId
        if (!sender || typeof sender !== "object") {
          console.error("Invalid message sender data:", msg)
          return {
            sender: "unknown",
            text: msg.text || "[Message content unavailable]",
            name: "Unknown User",
            time: msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown time",
            photoUrl: PLACEHOLDER_AVATAR,
          }
        }

        return {
          sender: sender._id?.toString() === userId.toString() ? "self" : "other",
          text: msg.text || "",
          name: sender.firstName || "User",
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          photoUrl: sender.photoUrl || PLACEHOLDER_AVATAR,
          userId: sender._id?.toString(),
        }
      })

      setMessages(chatMessages)

      const targetUser = chatData.participants.find(
        (p) => p._id?.toString() === targetUserId.toString()
      )
      if (targetUser) {
        console.log("Found target user:", targetUser)
        setTargetUserInfo({
          _id: targetUser._id,
          firstName: targetUser.firstName || "User",
          photoUrl: targetUser.photoUrl || PLACEHOLDER_AVATAR,
          onlineStatus: targetUser.onlineStatus || "offline",
        })
      } else {
        console.error("Target user not found in participants:", targetUserId, chatData.participants)
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err.response?.data || err.message)
    }
  }, [targetUserId, userId, setMessages, setTargetUserInfo])
}
