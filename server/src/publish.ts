const subscribers = new Set<ReadableStreamDefaultController>()

export function addSubscriber(subscriber: ReadableStreamDefaultController) {
  subscribers.add(subscriber)
  console.log('added subscriber, total', subscribers.size)

  // the idea is just to have a knob to load shed on too many subscribers
  const MAX_SUBSCRIBERS = 100000
  if (subscribers.size > MAX_SUBSCRIBERS) {
    // delete oldest sub
    const it = subscribers.values()
    const oldest = it.next().value
    oldest?.cancel()
    subscribers.delete(oldest)
    console.log('deleted oldest subscriber')
  }
}

export function unsubscribe(subscriber: ReadableStreamDefaultController) {
  subscribers.delete(subscriber)
}

export async function publish() {
  for (const subscriber of subscribers) {
    try {
      subscriber.enqueue(`lets-update`)
    } catch (e) {
      console.error('Error publishing', e)
    }
  }
}
