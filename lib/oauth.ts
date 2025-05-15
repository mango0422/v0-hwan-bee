// TODO: [OAuth2 인증 설정]
// OAuth2 인증을 위한 유틸리티 함수들을 정의합니다.

// OAuth2 제공자 설정
export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
  KAKAO: "kakao",
  NAVER: "naver",
}

// OAuth2 인증 URL 생성 함수
export function getOAuthURL(provider: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)

  switch (provider) {
    case OAUTH_PROVIDERS.GOOGLE:
      return `${baseUrl}/oauth2/authorization/google?redirect_uri=${redirectUri}`
    case OAUTH_PROVIDERS.KAKAO:
      return `${baseUrl}/oauth2/authorization/kakao?redirect_uri=${redirectUri}`
    case OAUTH_PROVIDERS.NAVER:
      return `${baseUrl}/oauth2/authorization/naver?redirect_uri=${redirectUri}`
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`)
  }
}

// OAuth2 콜백 처리 함수
export async function handleOAuthCallback(code: string, state?: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      throw new Error("OAuth authentication failed")
    }

    const data = await response.json()

    // 토큰 저장
    localStorage.setItem("auth-token", data.accessToken)
    localStorage.setItem("refresh-token", data.refreshToken)

    return data
  } catch (error) {
    console.error("OAuth callback error:", error)
    throw error
  }
}
