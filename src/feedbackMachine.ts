import { assign, setup } from 'xstate'

type Context = { feedback: string }

type Events =
  | {
      type: 'feedback.good'
    }
  | {
      type: 'feedback.bad'
    }
  | {
      type: 'feedback.update'
      value: string
    }
  | { type: 'submit' }
  | {
      type: 'close'
    }
  | { type: 'back' }
  | { type: 'restart' }

export const feedbackMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events
  },
  guards: {
    feedbackValid: ({ context }) => context.feedback.length > 0
  }
}).createMachine({
  id: 'feedback',
  initial: 'prompt',
  context: {
    feedback: ''
  },
  states: {
    prompt: {
      on: {
        'feedback.good': 'thanks',
        'feedback.bad': 'form'
      }
    },
    form: {
      on: {
        'feedback.update': {
          actions: assign({
            feedback: ({ event }) => event.value
          })
        },
        back: { target: 'prompt' },
        submit: {
          guard: 'feedbackValid',
          target: 'thanks'
        }
      }
    },
    thanks: {},
    closed: {
      on: {
        restart: 'prompt'
      }
    }
  },
  on: {
    close: '.closed'
  }
})
