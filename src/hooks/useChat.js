import { useState, useCallback } from 'react'

export function useChat(lang = 'en') {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (userText) => {
    if (!userText.trim()) return

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [messages, lang])

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, send, reset }
}
