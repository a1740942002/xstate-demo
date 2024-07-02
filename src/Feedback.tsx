// Actors
// - Internal state
// - Send messages (events)
// - Receive messages, change its "behavior" based on that message
// - Spawn other actors

import { createActor, fromTransition } from 'xstate'

// 1. Create actor logic ( like a reducer )
const countLogic = fromTransition(
  (state, event) => {
    if (event.type === 'increment') {
      return { count: state.count + 1 }
    }
    return state
  },
  { count: 0 }
)

// 2. Create actor
const countActor = createActor(countLogic)

// 3. (Optional) Subscribe to a actor snapshot updates
countActor.subscribe((snapshot) => {
  document.getElementById('output')!.innerHTML = String(snapshot.context.count)
})

// 4. start the actor
countActor.start()

export function Feedback() {
  return (
    <div>
      <div>
        Output: <output id="output"></output>
      </div>
      <button
        onClick={() => {
          countActor.send({ type: 'increment' })
        }}
      >
        +
      </button>
    </div>
  )
}
