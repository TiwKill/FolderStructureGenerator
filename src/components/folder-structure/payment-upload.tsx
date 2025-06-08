"use client"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PaymentInfo, PaymentStatus } from "@/types/interfaces"
import { Loader2, Upload, RefreshCw } from "lucide-react"
import Image from "next/image"
import { generatePromptPayQR, isQRExpired } from "@/lib/promptpay"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const PROMPTPAY_NUMBER = "080-940-0168"
const PAYMENT_AMOUNT = 10

interface PaymentUploadProps {
    onPaymentSubmit: (payment: PaymentInfo) => void;
    isLoading?: boolean;
}

export default function PaymentUpload({ onPaymentSubmit, isLoading = false }: PaymentUploadProps) {
    const [slipImage, setSlipImage] = useState<string | null>(null)
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [qrExpireAt, setQrExpireAt] = useState<Date | null>(null)
    const [isGeneratingQR, setIsGeneratingQR] = useState(false)

    // Check QR expiration and regenerate if needed
    useEffect(() => {
        const checkExpiration = () => {
            if (qrExpireAt && isQRExpired(qrExpireAt)) {
                setQrCode(null)
                setQrExpireAt(null)
            }
        }

        const timer = setInterval(checkExpiration, 1000)
        return () => clearInterval(timer)
    }, [qrExpireAt])

    const handleGenerateQR = async () => {
        try {
            setIsGeneratingQR(true)
            const { qrCode: newQR, expireAt } = await generatePromptPayQR({
                amount: PAYMENT_AMOUNT,
                phoneNumber: PROMPTPAY_NUMBER.replace(/-/g, '')
            })
            setQrCode(newQR)
            setQrExpireAt(expireAt)
        } catch (error) {
            console.error('Error generating QR:', error)
        } finally {
            setIsGeneratingQR(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setSlipImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!slipImage) return

        const payment: PaymentInfo = {
            id: Date.now().toString(),
            amount: PAYMENT_AMOUNT,
            status: 'pending',
            timestamp: new Date(),
            slipUrl: slipImage || '',
        }

        onPaymentSubmit(payment)
    }

    const getTimeRemaining = () => {
        if (!qrExpireAt) return '00:00'
        const now = new Date()
        const diff = qrExpireAt.getTime() - now.getTime()
        if (diff <= 0) return '00:00'
        
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">PromptPay QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm space-y-2">
                            <p>หมายเลข PromptPay: {PROMPTPAY_NUMBER}</p>
                            <p>จำนวนเงิน: {PAYMENT_AMOUNT} บาท</p>
                            <p className="text-sm text-gray-500">* ใช้งาน AI Generate ได้ 2 ครั้ง</p>
                        </div>

                        {qrCode ? (
                            <div className="space-y-2">
                                <div className="relative w-full aspect-square max-w-[256px] mx-auto">
                                    <Image
                                        src={qrCode}
                                        alt="PromptPay QR Code"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium">
                                        QR Code จะหมดอายุใน: {getTimeRemaining()}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateQR}
                                        disabled={isGeneratingQR}
                                        className="gap-2"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isGeneratingQR ? 'animate-spin' : ''}`} />
                                        สร้าง QR ใหม่
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleGenerateQR}
                                disabled={isGeneratingQR}
                                className="w-full gap-2"
                            >
                                {isGeneratingQR ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังสร้าง QR Code...
                                    </>
                                ) : (
                                    'สร้าง QR Code'
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-2">
                    <Label htmlFor="slip">อัปโหลดสลิปการโอนเงิน</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                        {slipImage ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={slipImage}
                                    alt="Payment slip"
                                    fill
                                    className="object-contain"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setSlipImage(null)}
                                    disabled={isLoading}
                                >
                                    ลบรูป
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="slip-upload"
                                className="flex flex-col items-center justify-center w-full h-32 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
                            >
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดสลิป</span>
                                <input
                                    id="slip-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={!slipImage || isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        กำลังดำเนินการ...
                    </>
                ) : (
                    'ส่งสลิปการชำระเงิน'
                )}
            </Button>
        </form>
    )
} 