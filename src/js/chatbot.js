export function initChatbot() {
  const fab = document.getElementById('chatFab')
  const panel = document.getElementById('chatPanel')
  const messagesEl = document.getElementById('chatMessages')
  const input = document.getElementById('chatInput')
  const sendBtn = document.getElementById('chatSend')

  if (!fab || !panel || !messagesEl || !input || !sendBtn) return

  let conversation = [] // keeps track of the full chat history to send context to the AI
  let isOpen = false
  let isSending = false

  function togglePanel() {
    isOpen = !isOpen
    fab.classList.toggle('is-open', isOpen)
    panel.classList.toggle('is-open', isOpen)
    panel.setAttribute('aria-hidden', String(!isOpen))
    if (isOpen) input.focus()
  }

  function addMessage(role, text) {
    const div = document.createElement('div')
    div.className = `chat-msg chat-msg-${role === 'user' ? 'user' : 'bot'}`
    div.textContent = text
    messagesEl.appendChild(div)
    messagesEl.scrollTop = messagesEl.scrollHeight // auto-scroll to newest message
  }

  function showTyping() {
    const div = document.createElement('div')
    div.className = 'chat-msg-typing'
    div.id = 'typingIndicator'
    div.textContent = 'Typing…'
    messagesEl.appendChild(div)
    messagesEl.scrollTop = messagesEl.scrollHeight
  }

  function hideTyping() {
    document.getElementById('typingIndicator')?.remove()
  }

  function setChatEnabled(enabled) {
    input.disabled = !enabled
    sendBtn.disabled = !enabled
    input.placeholder = 'Type a message…'
  }

  async function sendMessage() {
    const text = input.value.trim()
    if (!text || isSending) return

    isSending = true
    input.value = ''
    addMessage('user', text)
    conversation.push({ role: 'user', content: text })
    showTyping()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
      })
      const data = await res.json()
      hideTyping()

      if (data.reply) {
        addMessage('bot', data.reply)
        conversation.push({ role: 'assistant', content: data.reply })
      } else {
        addMessage('bot', "Sorry, something went wrong. Please try again or reach Ahmad directly on WhatsApp.")
      }
    } catch (err) {
      console.error('[chatbot] request failed', err)
      hideTyping()
      addMessage('bot', "Sorry, I couldn't connect. Please try again shortly.")
    } finally {
      isSending = false
    }
  }

  fab.addEventListener('click', togglePanel)
  sendBtn.addEventListener('click', sendMessage)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage()
  })

  setChatEnabled(true)
}