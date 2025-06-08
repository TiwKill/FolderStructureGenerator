"use client"
import type { PaymentInfo } from "@/types/interfaces"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { Check, Loader2, Clock, CreditCard, Calendar, Receipt, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PaymentStatusProps {
    payment: PaymentInfo | null
}

export default function PaymentStatus({ payment }: PaymentStatusProps) {
    if (!payment) return null

    const getStatusConfig = () => {
        switch (payment.status) {
            case "pending":
                return {
                    text: "รอการตรวจสอบ",
                    description: "ได้รับการชำระเงินแล้ว กำลังรอการตรวจสอบจากทีมงาน",
                    icon: <Clock className="w-5 h-5" />,
                    color: "text-amber-600 dark:text-amber-400",
                    bgColor: "bg-amber-50 dark:bg-amber-950/20",
                    borderColor: "border-amber-200 dark:border-amber-800",
                    headerGradient: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
                }
            case "verifying":
                return {
                    text: "กำลังตรวจสอบ",
                    description: "กำลังตรวจสอบการชำระเงินของคุณ โปรดรอสักครู่",
                    icon: <Loader2 className="w-5 h-5 animate-spin" />,
                    color: "text-blue-600 dark:text-blue-400",
                    bgColor: "bg-blue-50 dark:bg-blue-950/20",
                    borderColor: "border-blue-200 dark:border-blue-800",
                    headerGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                }
            case "verified":
                return {
                    text: "ตรวจสอบแล้ว",
                    description: "ได้รับการตรวจสอบเรียบร้อยแล้ว เครดิตถูกเพิ่มในบัญชีของคุณ",
                    icon: <CheckCircle2 className="w-5 h-5" />,
                    color: "text-green-600 dark:text-green-400",
                    bgColor: "bg-green-50 dark:bg-green-950/20",
                    borderColor: "border-green-200 dark:border-green-800",
                    headerGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                }
            case "rejected":
                return {
                    text: "ไม่ผ่านการตรวจสอบ",
                    description: "ไม่ผ่านการตรวจสอบ กรุณาติดต่อทีมงานหรือลองใหม่อีกครั้ง",
                    icon: <XCircle className="w-5 h-5" />,
                    color: "text-red-600 dark:text-red-400",
                    bgColor: "bg-red-50 dark:bg-red-950/20",
                    borderColor: "border-red-200 dark:border-red-800",
                    headerGradient: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
                }
            default:
                return {
                    text: "ไม่ทราบสถานะ",
                    description: "ไม่สามารถระบุสถานะการชำระเงินได้",
                    icon: <AlertCircle className="w-5 h-5" />,
                    color: "text-gray-600 dark:text-gray-400",
                    bgColor: "bg-gray-50 dark:bg-gray-950/20",
                    borderColor: "border-gray-200 dark:border-gray-800",
                    headerGradient: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
                }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <Card className={`overflow-hidden border-2 ${statusConfig.borderColor}`}>
            <CardHeader className={`bg-gradient-to-r ${statusConfig.headerGradient} p-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-3">
                        <div className={`rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>{statusConfig.icon}</div>
                        <div>
                            <CardTitle className={`text-xl font-bold  ${statusConfig.color}`}>{statusConfig.text}</CardTitle>
                            <CardDescription className="mt-1 text-sm max-w-md">{statusConfig.description}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Payment Details Grid */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">จำนวนเงิน</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    ฿{payment.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">วันที่ชำระเงิน</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {formatDate(payment.timestamp)}
                                </p>
                            </div>
                        </div>

                        {payment.verifiedAt && (
                            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">ตรวจสอบเมื่อ</p>
                                    <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                                        {formatDate(payment.verifiedAt)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Slip */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">สลิปการโอนเงิน</p>
                        </div>
                        <div className="relative group">
                            <div className="relative w-full h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600">
                                <Image
                                    src={payment.slipUrl || "/placeholder.svg"}
                                    alt="Payment slip"
                                    fill
                                    className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => window.open(payment.slipUrl, "_blank")}
                            >
                                ดูขนาดเต็ม
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                {payment.status === "rejected" && (
                    <>
                        <Separator />
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2">
                                    <h4 className="font-medium text-red-900 dark:text-red-100">เหตุผลที่ไม่ผ่านการตรวจสอบ</h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        กรุณาตรวจสอบข้อมูลการโอนเงินและลองอัปโหลดสลิปใหม่อีกครั้ง หรือติดต่อทีมงานเพื่อขอความช่วยเหลือ
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                                            ติดต่อทีมงาน
                                        </Button>
                                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                            อัปโหลดใหม่
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {payment.status === "verified" && (
                    <>
                        <Separator />
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <h4 className="font-medium text-green-900 dark:text-green-100">การชำระเงินสำเร็จ</h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        เครดิตได้ถูกเพิ่มในบัญชีของคุณแล้ว คุณสามารถใช้งาน AI Generate ได้ทันที
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
