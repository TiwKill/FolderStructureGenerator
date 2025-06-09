import { useState, useEffect } from 'react'
import { UserCredits, CreditTransaction } from '@/types/interfaces'

const CREDITS_PER_PAYMENT = 2
const CREDITS_STORAGE_KEY = 'user-credits'
const CREDIT_EXPIRY_HOURS = 24 // Credits expire after 24 hours

export function useCredits(userId: string) {
    const [credits, setCredits] = useState<UserCredits | null>(null)
    const [showPayment, setShowPayment] = useState(false)

    // Load credits from localStorage on mount
    useEffect(() => {
        const savedCredits = localStorage.getItem(`${CREDITS_STORAGE_KEY}-${userId}`)
        if (savedCredits) {
            try {
                const parsed = JSON.parse(savedCredits)
                // Check if credits are expired
                const lastUpdate = new Date(parsed.lastUpdated)
                const now = new Date()
                const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

                if (hoursDiff > CREDIT_EXPIRY_HOURS) {
                    // Credits expired, initialize new credits
                    initializeCredits()
                } else {
                    setCredits(parsed)
                }
            } catch (error) {
                console.error('Error loading credits:', error)
                initializeCredits()
            }
        } else {
            initializeCredits()
        }
    }, [userId])

    // Save credits to localStorage whenever they change
    useEffect(() => {
        if (credits) {
            try {
                localStorage.setItem(`${CREDITS_STORAGE_KEY}-${userId}`, JSON.stringify(credits))
            } catch (error) {
                console.error('Error saving credits:', error)
            }
        }
    }, [credits, userId])

    const initializeCredits = () => {
        const newCredits: UserCredits = {
            id: `credits-${userId}`,
            userId,
            credits: 0,
            lastUpdated: new Date(),
            transactions: []
        }
        setCredits(newCredits)
    }

    const addCredits = (paymentId: string) => {
        if (!credits) return

        const transaction: CreditTransaction = {
            id: `tr-${Date.now()}`,
            type: 'add',
            amount: CREDITS_PER_PAYMENT,
            timestamp: new Date(),
            paymentId
        }

        setCredits(prev => {
            if (!prev) return null
            return {
                ...prev,
                credits: prev.credits + CREDITS_PER_PAYMENT,
                lastUpdated: new Date(),
                transactions: [transaction, ...prev.transactions]
            }
        })

        setShowPayment(false)
        return CREDITS_PER_PAYMENT
    }

    const useCredit = () => {
        if (!credits || credits.credits <= 0) return false

        const transaction: CreditTransaction = {
            id: `tr-${Date.now()}`,
            type: 'use',
            amount: 1,
            timestamp: new Date()
        }

        setCredits(prev => {
            if (!prev) return null
            return {
                ...prev,
                credits: prev.credits - 1,
                lastUpdated: new Date(),
                transactions: [transaction, ...prev.transactions]
            }
        })

        return true
    }

    const hasCredits = () => {
        return credits?.credits && credits.credits > 0
    }

    const togglePayment = () => {
        setShowPayment(prev => !prev)
    }

    const getExpiryTime = () => {
        if (!credits) return null
        const lastUpdate = new Date(credits.lastUpdated)
        const expiryTime = new Date(lastUpdate.getTime() + CREDIT_EXPIRY_HOURS * 60 * 60 * 1000)
        return expiryTime
    }

    return {
        credits,
        addCredits,
        useCredit,
        hasCredits,
        showPayment,
        togglePayment,
        getExpiryTime,
        CREDITS_PER_PAYMENT
    }
} 