import qrcode from 'qrcode'
import generatePayload from 'promptpay-qr'

export interface PromptPayOptions {
    amount: number
    phoneNumber: string
    expireInMinutes?: number
}

export async function generatePromptPayQR({ amount, phoneNumber, expireInMinutes = 2 }: PromptPayOptions): Promise<{ qrCode: string; expireAt: Date }> {
    try {
        // Generate PromptPay payload
        const payload = generatePayload(phoneNumber, { amount })

        // Generate QR code as data URL
        const qrCode = await qrcode.toDataURL(payload, {
            type: 'image/png',
            width: 256,
            margin: 1,
            errorCorrectionLevel: 'L'
        })

        // Calculate expiration time
        const expireAt = new Date(Date.now() + expireInMinutes * 60 * 1000)

        return {
            qrCode,
            expireAt
        }
    } catch (error) {
        console.error('Error generating PromptPay QR:', error)
        throw new Error('Failed to generate PromptPay QR code')
    }
}

export function isQRExpired(expireAt?: Date): boolean {
    if (!expireAt) return true
    return new Date() > new Date(expireAt)
} 