import { useState, useCallback, useRef } from 'react'

const MAX_CHARS = 500
const MAX_MESSAGES = 20
const COOLDOWN_MS = 2000

export function useChat(lang = 'en') {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [limitError, setLimitError] = useState(null)
  const lastSentRef = useRef(0)

  const send = useCallback(async (userText) => {
    if (!userText.trim()) return

    setLimitError(null)
    if (userText.length > MAX_CHARS) { setLimitError('tooLong'); return }
    const userCount = messages.filter(m => m.role === 'user').length
    if (userCount >= MAX_MESSAGES) { setLimitError('limitReached'); return }
    const now = Date.now()
    if (now - lastSentRef.current < COOLDOWN_MS) { setLimitError('cooldown'); return }
    lastSentRef.current = now

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

      if (res.status === 429) { setLimitError('rateLimited'); return }
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
    setLimitError(null)
  }, [])

  return { messages, loading, error, limitError, send, reset }
}
