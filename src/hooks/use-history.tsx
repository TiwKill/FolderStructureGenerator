import { useState, useCallback } from 'react'

// History State
interface HistoryState<T> {
    past: T[]
    present: T
    future: T[]
}

// Use History Hook
export function useHistory<T>(initialPresent: T) {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialPresent,
        future: []
    })

    const canUndo = state.past.length > 0
    const canRedo = state.future.length > 0

    // Save a new state to history
    const push = useCallback((newPresent: T) => {
        setState(currentState => ({
            past: [...currentState.past, currentState.present],
            present: newPresent,
            future: []
        }))
    }, [])

    // Go back to the previous state
    const undo = useCallback(() => {
        setState(currentState => {
            if (currentState.past.length === 0) return currentState

            const previous = currentState.past[currentState.past.length - 1]
            const newPast = currentState.past.slice(0, -1)

            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future]
            }
        })
    }, [])

    // Go forward to the next state
    const redo = useCallback(() => {
        setState(currentState => {
            if (currentState.future.length === 0) return currentState

            const next = currentState.future[0]
            const newFuture = currentState.future.slice(1)

            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture
            }
        })
    }, [])

    // Clear all history
    const clear = useCallback(() => {
        setState({
            past: [],
            present: state.present,
            future: []
        })
    }, [state.present])

    return {
        state: state.present,
        canUndo,
        canRedo,
        push,
        undo,
        redo,
        clear
    }
}