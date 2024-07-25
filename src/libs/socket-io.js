import io from 'socket.io-client'

import { SOCKET_IO } from '@/constants'

export const SocketIO = (() => {
  let instance

  const init = (query) =>
    io(SOCKET_IO, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      query,
      jsonp: false,
    })

  return {
    getInstance: (query) => {
      if (!query.token) return null
      if (!instance) instance = init(query)
      if (instance.disconnected || !instance.connected) {
        instance.connect()
      }

      return instance
    },
  }
})()
