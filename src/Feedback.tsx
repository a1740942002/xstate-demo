// Actors
// - Internal state
// - Send messages (events)
// - Receive messages, change its "behavior" based on that message
// - Spawn other actors

import { createActor, fromPromise, fromTransition } from 'xstate'

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

const promiseLogic = fromPromise(async () => {
  const result = await new Promise((res) => {
    setTimeout(() => {
      res('done')
    }, 1000)
  })

  return result
})

// 2. Create actor
const countActor = createActor(countLogic)
const promiseActor = createActor(promiseLogic)

// 3. (Optional) Subscribe to a actor snapshot updates
countActor.subscribe((snapshot) => {
  document.getElementById('output')!.innerHTML = String(snapshot.context.count)
})

promiseActor.subscribe((snapshot) => {
  console.log(snapshot.output)
})

// 4. start the actor
countActor.start()
promiseActor.start()

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
