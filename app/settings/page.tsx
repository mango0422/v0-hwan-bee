"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const { isAuthenticated, user, updateUserProfile, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      })
    }
  }, [authLoading, isAuthenticated, router, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // 전화번호 유효성 검사
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
    if (!phoneRegex.test(profileData.phoneNumber)) {
      setError("올바른 전화번호 형식이 아닙니다.")
      return
    }

    setIsLoading(true)

    try {
      const result = await updateUserProfile({
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
      })

      if (result) {
        setSuccess(true)
      } else {
        setError("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (err) {
      setError("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">설정</h1>
            <p className="text-muted-foreground mt-1">계정 설정 및 개인정보를 관리하세요.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="notifications">알림</TabsTrigger>
              <TabsTrigger value="security">보안</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>프로필</CardTitle>
                  <CardDescription>개인 정보를 관리하고 업데이트하세요.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          프로필이 성공적으로 업데이트되었습니다.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" value={user?.email || ""} disabled />
                      <p className="text-sm text-muted-foreground">이메일은 변경할 수 없습니다.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">전화번호</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">주소</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        placeholder="서울시 강남구"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "저장 중..." : "저장하기"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>알림 설정</CardTitle>
                  <CardDescription>알림 수신 방법을 설정하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">이메일 알림</Label>
                      <p className="text-sm text-muted-foreground">중요한 알림을 이메일로 받습니다.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS 알림</Label>
                      <p className="text-sm text-muted-foreground">중요한 알림을 SMS로 받습니다.</p>
                    </div>
                    <Switch id="sms-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">마케팅 알림</Label>
                      <p className="text-sm text-muted-foreground">프로모션 및 마케팅 정보를 받습니다.</p>
                    </div>
                    <Switch id="marketing-notifications" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>저장하기</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>보안 설정</CardTitle>
                  <CardDescription>계정 보안 설정을 관리하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">현재 비밀번호</Label>
                    <Input id="current-password" type="password" placeholder="현재 비밀번호 입력" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <Input id="new-password" type="password" placeholder="새 비밀번호 입력" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" placeholder="새 비밀번호 재입력" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={logout}>
                    로그아웃
                  </Button>
                  <Button>비밀번호 변경</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
