/**
 * @name CupertinoExtras
 * @version 1.0.0
 * @author soobin
 * @description Cupertino 테마 부속 기능 — 폴더 커스텀 아이콘(로컬 PNG 임베드), DM 블러, "현재 활동 중" 패널 토글.
 * @source local
 */

/* ═══════════════════════════════════════════════════════════════════
   왜 플러그인이 필요한가

   1) 폴더 아이콘: file:// 은 Chromium 이 https 페이지에서 원천 차단한다
      (CSP 문제가 아니라 하위리소스 정책이라 BD로도 못 뚫는다).
      → PNG 를 data: URI 로 임베드한다. 이 파일의 ICONS 가 그것이다.
   2) 폴더 구분: 디스코드는 폴더 DOM 에 식별 속성을 전혀 주지 않는다.
      → React fiber 의 memoizedProps.folderNode.id 를 "읽어서"
        data-cup-folder 속성만 붙인다. **Patcher/React 패치는 쓰지 않는다.**
        (예전에 memo 내부를 패치했다가 부팅 시 렌더러가 죽었다)
   3) DM 블러 / 패널 토글: CSS 만으로는 클릭 토글을 만들 수 없어
      <html> 에 클래스를 붙였다 떼는 방식으로 처리한다.
   ═══════════════════════════════════════════════════════════════════ */

const ICONS = {"blue":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyZjdmZDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxZjY2YmQiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1YWE4ZjIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyZjg2ZTQiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyZjdmZDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxZjY2YmQiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1YWE4ZjIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyZjg2ZTQiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"red":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjZjNmMzYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiODMzMmIiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmMjY2NWIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkZDRhNDAiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjZjNmMzYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiODMzMmIiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmMjY2NWIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkZDRhNDAiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"orange":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkOTdkMWUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjMDZhMTYiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmN2E0NDciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlODhjMmMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkOTdkMWUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjMDZhMTYiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmN2E0NDciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlODhjMmMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"yellow":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkMGE2MTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiODkxMTEiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNWNkNDUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlNWJhMmMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkMGE2MTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiODkxMTEiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNWNkNDUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlNWJhMmMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"green":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYjkxNTIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMjdmNDUiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0Y2JlNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzM2E3NWUiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYjkxNTIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMjdmNDUiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0Y2JlNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzM2E3NWUiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"teal":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxNzhhOTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxMjc2ODAiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzMWIzYmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMTlmYWMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxNzhhOTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxMjc2ODAiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzMWIzYmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMTlmYWMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"purple":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3MzQ1YzkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2MzNhYjMiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5YTZjZTgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4MTUzZDgiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3MzQ1YzkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2MzNhYjMiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5YTZjZTgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4MTUzZDgiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"pink":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjOTNhODMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiMjMxNzQiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlZjY3YTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkYzUwOTMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjOTNhODMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiMjMxNzQiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlZjY3YTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkYzUwOTMiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"},"gray":{"c":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3MTc2N2UiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2MjY3NmYiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5NDlhYTMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Mjg4OTIiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik0zIDIwLjFhMy42IDMuNiAwIDAgMSAzLjYtMy42aDM0LjhhMy42IDMuNiAwIDAgMSAzLjYgMy42djE2LjNhMy42IDMuNiAwIDAgMS0zLjYgMy42SDYuNkEzLjYgMy42IDAgMCAxIDMgMzYuNFYyMC4xWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNi42IDE2LjVoMzQuOGEzLjYgMy42IDAgMCAxIDMuNiAzLjZ2LjhIM3YtLjhhMy42IDMuNiAwIDAgMSAzLjYtMy42WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIyIi8+Cjwvc3ZnPg==","o":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3MTc2N2UiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2MjY3NmYiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5NDlhYTMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Mjg4OTIiLz48L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxwYXRoIGQ9Ik0zIDEzLjJBMy42IDMuNiAwIDAgMSA2LjYgOS42aDEwLjlhMy42IDMuNiAwIDAgMSAyLjY2IDEuMTdsMi4zIDIuNTNINDEuNEEzLjYgMy42IDAgMCAxIDQ1IDE2Ljl2MTkuNWEzLjYgMy42IDAgMCAxLTMuNiAzLjZINi42QTMuNiAzLjYgMCAwIDEgMyAzNi40VjEzLjJaIiBmaWxsPSJ1cmwoI2IpIi8+CjxwYXRoIGQ9Ik01LjEgMjEuM2EyLjYgMi42IDAgMCAxIDIuNi0yLjloMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLTIuMSAxNS42YTMuNCAzLjQgMCAwIDEtMy40IDNIMTAuNmEzLjQgMy40IDAgMCAxLTMuNC0zTDUuMSAyMS4zWiIgZmlsbD0idXJsKCNmKSIvPgo8cGF0aCBkPSJNNy43IDE4LjRoMzIuNmEyLjYgMi42IDAgMCAxIDIuNiAyLjlsLS4xLjdINS4ybC0uMS0uN2EyLjYgMi42IDAgMCAxIDIuNi0yLjlaIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMjIiLz4KPC9zdmc+"}};

const COLORS = Object.keys(ICONS);
const STYLE_ID = "cupertino-extras";
const CUSTOM_ID = "cupertino-custom";
const FONT_ID = "cupertino-font-link";
const ATTR = "data-cup-folder";

/* 강조색 프리셋 — hover/active 는 같은 색을 어둡게 쓴다 (토스 방식) */
const ACCENTS = {
	blue: { name: "토스 블루", hex: "#3182f6" },
	indigo: { name: "인디고", hex: "#5865f2" },
	purple: { name: "퍼플", hex: "#8b5cf6" },
	pink: { name: "핑크", hex: "#ec4899" },
	red: { name: "레드", hex: "#e5484d" },
	orange: { name: "오렌지", hex: "#f97316" },
	green: { name: "그린", hex: "#22c55e" },
	teal: { name: "틸", hex: "#14b8a6" },
	graphite: { name: "그래파이트", hex: "#8b8f96" },
};

/* 폰트 — CDN 은 실측으로 전부 허용 확인 (Google Fonts / jsDelivr) */
const FONTS = {
	noto: {
		name: "Noto Sans KR",
		stack: '"Noto Sans KR", "Malgun Gothic", sans-serif',
		url: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap",
	},
	pretendard: {
		name: "Pretendard",
		stack: '"Pretendard Variable", Pretendard, "Malgun Gothic", sans-serif',
		url: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css",
	},
	suit: {
		name: "SUIT",
		stack: '"SUIT Variable", SUIT, "Malgun Gothic", sans-serif',
		url: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT.css",
	},
	spoqa: {
		name: "Spoqa Han Sans Neo",
		stack: '"Spoqa Han Sans Neo", "Malgun Gothic", sans-serif',
		url: "https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css",
	},
	system: { name: "시스템 기본 (다운로드 없음)", stack: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif', url: null },
};

const RADII = {
	sharp: { name: "각지게", v: [4, 6, 8, 10, 14] },
	normal: { name: "기본", v: [6, 10, 14, 18, 24] },
	soft: { name: "더 둥글게", v: [8, 14, 18, 24, 30] },
};

module.exports = class CupertinoExtras {
	constructor() {
		this.observer = null;
		this.folders = new Map(); // id -> 설정 패널에 보여줄 이름
		this.names = new Map(); // id -> 디스코드 원본 폴더 이름 (첫 글자 자동 추출용)
		this.retagTimer = null;
	}

	// ── 설정 ────────────────────────────────────────────────
	load() {
		this.settings = Object.assign(
			{
				folderIcons: true,
				defaultColor: "blue", // gray 는 어두운 레일에서 너무 묻힌다
				showLetter: true,
				autoLabelChars: 2, // 폴더 이름에서 자동으로 가져올 글자 수 (1~3). 1은 너무 적다는 피드백
				autoColor: true, // 폴더마다 자동으로 다른 색 배정
				autoColorMap: {}, // { folderId: "red" }      자동 배정 결과 (한 번 정하면 고정)
				perFolder: {}, // { folderId: "blue" }        수동 지정 (자동보다 우선)
				perFolderLabel: {}, // { folderId: "팩션" }   폴더별 라벨 (비우면 이름에서 자동)
				blurDMs: false,
				blurDMsRevealOnHover: true,
				hideActivity: false,
				// ── DM 폴더 / 고정 ──
				dmRegistry: {}, // id -> { name, avatar }  스크롤로 훑으며 모은다
				dmPins: [], // 고정한 DM id 순서대로
				dmFolders: [], // [{ id, name, ids: [] }]
				dmActive: null, // null(전체) | "pins" | 폴더 id
				// ── 테마 커스텀 ──
				appearance: "auto", // auto(디스코드 따라가기) | dark | light
				accent: "blue", // ACCENTS 의 키, 또는 "#RRGGBB"
				font: "noto", // FONTS 의 키
				fontScale: 100, // 90~115 (%)
				glass: 100, // 0~150 (%) — 블러 세기
				panelBlur: true, // 큰 패널(레일/목록/카드) 블러 — 성능 영향이 가장 크다
				radius: "normal", // sharp | normal | soft
			},
			BdApi.Data.load("CupertinoExtras", "settings") ?? {},
		);
	}

	save() {
		BdApi.Data.save("CupertinoExtras", "settings", this.settings);
	}

	// ── 라이프사이클 ────────────────────────────────────────
	start() {
		this.load();
		this.applyClasses();
		this.injectCSS();
		this.applyCustom();
		this.tagFolders();
		this.ensureActivityToggle();
		this.ensureCustomButton();
		this.scanDMs();
		this.ensureDMBar();
		this.observe();
		this.tagSurfaces();
		this.unwrapLayerTransforms();
		this.observeLayers();

		// 설정 패널 이벤트 위임 (패널이 어떻게 렌더되든 동작하도록)
		this._onSetting = (e) => this.handleSettingEvent(e);
		document.addEventListener("change", this._onSetting, true);
		document.addEventListener("input", this._onSetting, true);

		// 백그라운드 동안 옵저버 작업을 건너뛰므로, 돌아왔을 때 한 번 따라잡는다.
		this._onVisible = () => {
			if (document.hidden) return;
			this.tagFolders();
			this.ensureActivityToggle();
			this.ensureCustomButton();
			this.scanDMs();
			this.ensureDMBar();
			this.tagSurfaces();
			this.unwrapLayerTransforms();
		};
		document.addEventListener("visibilitychange", this._onVisible);
	}

	stop() {
		if (this._onVisible) {
			document.removeEventListener("visibilitychange", this._onVisible);
			this._onVisible = null;
		}
		if (this._onSetting) {
			document.removeEventListener("change", this._onSetting, true);
			document.removeEventListener("input", this._onSetting, true);
			this._onSetting = null;
		}
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.layerObserver) {
			this.layerObserver.disconnect();
			this.layerObserver = null;
		}
		clearTimeout(this.layerTimer);
		// 손댄 레이어를 원상복구
		for (const el of document.querySelectorAll("[data-cup-unwrapped]")) {
			el.style.removeProperty("transform");
			el.style.removeProperty("left");
			el.style.removeProperty("top");
			el.removeAttribute("data-cup-unwrapped");
			delete el.dataset.cupBaseLeft;
			delete el.dataset.cupBaseTop;
		}
		clearTimeout(this.retagTimer);
		// 테마 커스텀 원복
		this.appearanceObserver?.disconnect();
		this.appearanceObserver = null;
		if (this._savedTheme) {
			const c = document.documentElement.classList;
			c.remove("theme-dark", "theme-light", "theme-midnight");
			for (const t of this._savedTheme) c.add(t);
			this._savedTheme = null;
		}
		clearTimeout(this.dmSaveTimer);
		document.documentElement.classList.remove("cup-dm-filter");
		for (const el of document.querySelectorAll(".cup-dm-bar, .cup-dm-list, .cup-dmpop, .cup-pin-btn")) el.remove();
		for (const el of document.querySelectorAll("[data-cup-dm]")) el.removeAttribute("data-cup-dm");
		for (const a of ["data-cup-lb", "data-cup-banner", "data-cup-tafooter"])
			for (const el of document.querySelectorAll("[" + a + "]")) el.removeAttribute(a);
		BdApi.DOM.removeStyle(CUSTOM_ID);
		document.getElementById(FONT_ID)?.remove();
		document.querySelector(".cup-modal-backdrop")?.remove();
		for (const el of document.querySelectorAll(".cup-theme-btn")) el.remove();
		BdApi.DOM.removeStyle(STYLE_ID);
		document.documentElement.classList.remove("cup-blur-dms", "cup-blur-hover", "cup-hide-activity");
		for (const el of document.querySelectorAll(`[${ATTR}]`)) el.removeAttribute(ATTR);
		for (const el of document.querySelectorAll("[data-cup-letter]")) el.removeAttribute("data-cup-letter");
		for (const el of document.querySelectorAll("[data-cup-len]")) el.removeAttribute("data-cup-len");
		for (const el of document.querySelectorAll(".cup-activity-toggle")) el.remove();
	}

	// ── <html> 클래스 토글 ──────────────────────────────────
	applyClasses() {
		const c = document.documentElement.classList;
		c.toggle("cup-blur-dms", !!this.settings.blurDMs);
		c.toggle("cup-blur-hover", !!this.settings.blurDMsRevealOnHover);
		c.toggle("cup-hide-activity", !!this.settings.hideActivity);
	}

	/* ═══════════════════════════════════════════════════════════
	   테마 커스텀 — 토큰만 덮어써서 Cupertino 테마를 조절한다

	   테마 CSS 파일을 고치지 않고 `:root` 토큰만 덮는다. 그래서
	   테마를 껐다 켜도, 테마 파일을 나중에 수정해도 이 설정은 그대로 산다.

	   ⚠️⚠️ 특이도 함정 (실제로 여기서 한 번 틀렸다):
	   처음에 `html { --t-blue: … }` 로 썼더니 **하나도 적용되지 않았다.**
	   `html` 은 타입 선택자라 (0,0,1) 인데 테마의 `:root` 는 의사클래스라
	   (0,1,0) 으로 **테마가 이긴다.** BD 가 뒤에 주입해도 특이도가 낮으면 진다.
	   → `:root:root:root` (0,3,0) 로 확실히 이긴다.
	   font-size 는 디스코드가 `.font-size-16` 클래스(0,1,0)로 잡으므로
	   !important 까지 필요하다.
	   ═══════════════════════════════════════════════════════════ */
	accentHex() {
		const a = this.settings.accent;
		if (typeof a === "string" && /^#[0-9a-f]{6}$/i.test(a)) return a;
		return (ACCENTS[a] ?? ACCENTS.blue).hex;
	}

	// hex 를 섞어 hover/tint 색을 만든다 (별도 팔레트를 두면 관리가 안 된다)
	mix(hex, target, amount) {
		const p = (i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
		const t = target === "black" ? [0, 0, 0] : [255, 255, 255];
		const c = [0, 1, 2].map((i) => Math.round(p(i) + (t[i] - p(i)) * amount));
		return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
	}

	rgba(hex, alpha) {
		const p = (i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
		return `rgba(${p(0)}, ${p(1)}, ${p(2)}, ${alpha})`;
	}

	ensureFontLink() {
		const f = FONTS[this.settings.font] ?? FONTS.noto;
		const old = document.getElementById(FONT_ID);
		if (!f.url) {
			old?.remove();
			return;
		}
		if (old && old.getAttribute("href") === f.url) return;
		old?.remove();
		const link = document.createElement("link");
		link.id = FONT_ID;
		link.rel = "stylesheet";
		link.href = f.url;
		document.head.appendChild(link);
	}

	applyCustom() {
		const s = this.settings;
		const hex = this.accentHex();
		const font = FONTS[s.font] ?? FONTS.noto;
		const rad = (RADII[s.radius] ?? RADII.normal).v;
		const scale = Math.max(80, Math.min(130, Number(s.fontScale) || 100)) / 100;
		const glass = Math.max(0, Math.min(150, Number(s.glass) ?? 100)) / 100;

		this.ensureFontLink();
		this.applyAppearance();

		// 블러 세기 — 테마의 기준값(28/26/18/24px)에 배율을 적용
		const b = (px, sat, bright) =>
			glass <= 0
				? "none"
				: `blur(${Math.round(px * glass)}px) saturate(${sat}%)${bright ? ` brightness(${bright})` : ""}`;

		const css = `
:root:root:root {
	--t-blue: ${hex};
	--t-blue-hover: ${this.mix(hex, "black", 0.18)};
	--t-blue-tint: ${this.rgba(hex, 0.14)};
	--t-blue-tint-hi: ${this.rgba(hex, 0.22)};
	--t-blue-ring: ${this.rgba(hex, 0.28)};

	--kr-font: ${font.stack};
	--font-primary: ${font.stack};
	--font-display: ${font.stack};
	--font-headline: ${font.stack};

	--r-xs: ${rad[0]}px;
	--r-sm: ${rad[1]}px;
	--r-md: ${rad[2]}px;
	--r-lg: ${rad[3]}px;
	--r-xl: ${rad[4]}px;

	--glass-blur: ${b(28, 185, 1.42)};
	--glass-blur-base: ${b(26, 155, 1.18)};
	--glass-blur-bar: ${b(18, 145, 1.26)};
	/* 큰 패널 블러는 따로 끌 수 있게 한다 — 성능 영향이 가장 큰 항목 */
	--panel-blur: ${s.panelBlur === false || glass <= 0 ? "none" : b(26, 155, 1.18)};
}
${scale !== 1 ? `:root:root:root { font-size: ${Math.round(16 * scale)}px !important; }` : ""}
`;
		BdApi.DOM.removeStyle(CUSTOM_ID);
		BdApi.DOM.addStyle(CUSTOM_ID, css);
	}

	/* 라이트/다크 강제 — 디스코드는 <html> 의 theme-* 클래스로 모드를 정한다.
	   ⚠️ 디스코드가 자기 설정으로 되돌리므로, 바꿔치기 후 감시해서 재적용한다.
	   "auto" 면 아무것도 하지 않고 디스코드 설정을 그대로 따른다. */
	applyAppearance() {
		const mode = this.settings.appearance;
		const root = document.documentElement;
		if (mode !== "dark" && mode !== "light") {
			this.appearanceObserver?.disconnect();
			this.appearanceObserver = null;
			if (this._savedTheme) {
				root.classList.remove("theme-dark", "theme-light", "theme-midnight");
				for (const c of this._savedTheme) root.classList.add(c);
				this._savedTheme = null;
			}
			return;
		}
		if (!this._savedTheme) {
			this._savedTheme = [...root.classList].filter((c) => c.startsWith("theme-"));
		}
		const set = () => {
			const c = root.classList;
			const want = mode === "light" ? "theme-light" : "theme-dark";
			if (c.contains(want) && !(mode === "light" && c.contains("theme-dark"))) return;
			c.remove("theme-dark", "theme-light", "theme-midnight");
			c.add(want);
		};
		set();
		if (!this.appearanceObserver) {
			this.appearanceObserver = new MutationObserver(() => set());
			this.appearanceObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
		}
	}

	/* ═══════════════════════════════════════════════════════════
	   DM 폴더 / 고정

	   ⚠️⚠️ 왜 "재배치" 가 아니라 "직접 그리기" 인가 (실측 근거):
	     · DM 목록은 **가상 스크롤**이다. 처음 24개 렌더 → 맨 아래로 가도 DOM 에
	       33개뿐이고 노드를 재활용한다 (전체는 265개, scrollHeight 11941).
	       → DOM 을 옮겨 폴더처럼 묶으면 리렌더마다 씻긴다.
	     · 항목 부모(`content_d125d2`)가 `display: block` 이라 CSS `order` 도 못 쓴다.
	     · 안 보이는 DM 은 `display:none` 필터로도 끌어올 수 없다 (렌더 자체가 안 됨).
	   → 폴더/고정 뷰에서는 **내가 직접 행을 그린다.** 이름·아바타는 목록을
	     훑으며 모아둔 레지스트리에서 꺼낸다.

	   ⚠️ 이동 방법 (실측으로 고른 것):
	     · `transitionTo` 모듈 — 이 빌드에 없음
	     · 합성 `<a>` 클릭 — **전체 페이지 리로드**를 일으켜 사용 불가
	     · 렌더된 행의 `__reactProps.onClick` 호출 — **성공** (읽기만, Patcher 아님)
	   ═══════════════════════════════════════════════════════════ */
	dmIdOf(el) {
		const a = el.matches?.('a[href^="/channels/@me/"]') ? el : el.querySelector?.('a[href^="/channels/@me/"]');
		const href = a?.getAttribute("href") ?? "";
		const id = href.split("/").pop();
		return /^\d+$/.test(id) ? id : null;
	}

	// 렌더된 DM 행을 훑어 레지스트리를 채운다 (이름/아바타)
	scanDMs() {
		/* ⚠️ 성능: DM 목록이 없는 화면(서버 채널 등)에서는 전부 헛일이다.
		   옵저버가 채팅 스크롤마다 불리므로 여기서 즉시 끊는 게 크다. */
		if (!document.querySelector('[class*="privateChannels_"]')) return;
		const reg = (this.settings.dmRegistry ??= {});
		let changed = false;
		for (const a of document.querySelectorAll('a[href^="/channels/@me/"]')) {
			const id = this.dmIdOf(a);
			if (!id) continue;
			const row = a.closest("li") ?? a.parentElement;
			const nameEl = a.querySelector('[class*="name_"]') ?? a;
			const name = (nameEl.textContent ?? "").trim().slice(0, 40);
			const img = a.querySelector("img");
			const avatar = img?.getAttribute("src") ?? "";
			const prev = reg[id];
			if (!prev || prev.name !== name || prev.avatar !== avatar) {
				if (name) {
					reg[id] = { name, avatar };
					changed = true;
				}
			}
			if (row && row.getAttribute("data-cup-dm") !== id) row.setAttribute("data-cup-dm", id);

			/* 각 DM 행에 "고정" 버튼을 심는다 — 이게 있어야 기능을 발견할 수 있다.
			   설정 모달에만 넣어두면 아무도 모른다 (실제로 "폴더가 뭔지 모르겠다"는
			   피드백을 받았다). 가상 스크롤이 행을 재활용하므로 매 스캔마다 확인한다. */
			if (row && !row.querySelector(".cup-pin-btn")) {
				const pinned = (this.settings.dmPins ?? []).includes(id);
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "cup-pin-btn";
				btn.dataset.cupOn = pinned ? "1" : "0";
				btn.title = pinned ? "고정 해제" : "이 대화 고정";
				btn.setAttribute("aria-label", btn.title);
				btn.textContent = "★";
				btn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					this.togglePin(id);
				});
				row.style.position ||= "relative";
				row.appendChild(btn);
			}
		}
		if (changed) {
			clearTimeout(this.dmSaveTimer);
			this.dmSaveTimer = setTimeout(() => this.save(), 1200);
		}
	}

	/* 안 읽음/멘션 — 디스코드 스토어에서 **읽기만** 시도한다.
	   못 찾으면 배지를 생략한다 (기능이 죽지 않게 반드시 가드). */
	readState(id) {
		try {
			this._readStore ??=
				BdApi.Webpack.getStore?.("ReadStateStore") ??
				BdApi.Webpack.getModule?.((m) => m && typeof m.getMentionCount === "function" && typeof m.hasUnread === "function") ??
				null;
			const s = this._readStore;
			if (!s) return null;
			return {
				unread: typeof s.hasUnread === "function" ? !!s.hasUnread(id) : false,
				mentions: typeof s.getMentionCount === "function" ? Number(s.getMentionCount(id)) || 0 : 0,
			};
		} catch {
			return null;
		}
	}

	navigateDM(id) {
		const call = (a) => {
			const k = Object.keys(a).find((x) => x.startsWith("__reactProps"));
			const p = k ? a[k] : null;
			if (typeof p?.onClick !== "function") return false;
			p.onClick({
				preventDefault() {},
				stopPropagation() {},
				currentTarget: a,
				target: a,
				type: "click",
				button: 0,
				ctrlKey: false,
				metaKey: false,
				shiftKey: false,
			});
			return true;
		};
		// 1순위: 이미 렌더된 행 (display:none 이어도 onClick 호출은 된다)
		const hit = document.querySelector(`a[href="/channels/@me/${id}"]`);
		if (hit && call(hit)) return;

		/* 2순위: 스크롤로 찾아서 호출.
		   ⚠️⚠️ 폴더 뷰에서는 원래 목록을 display:none 으로 감추고 있어서
		   **scrollHeight 가 0** 이 된다. 그 상태로 스크롤 탐색을 돌리면 즉시
		   실패해 최후 수단(location.assign = 전체 리로드)으로 떨어진다.
		   실제로 이 버그로 앱이 리로드됐다.
		   → 탐색하는 동안만 필터 클래스를 떼어 목록을 되살린 뒤, 끝나면 복원한다. */
		const root = document.documentElement;
		const wasFiltered = root.classList.contains("cup-dm-filter");
		if (wasFiltered) root.classList.remove("cup-dm-filter");
		const restore = () => {
			if (wasFiltered) root.classList.add("cup-dm-filter");
		};

		const sc = document.querySelector('[class*="privateChannels_"] [class*="scroller"]');
		if (!sc || sc.scrollHeight <= sc.clientHeight) {
			// 스크롤할 게 없다 = 전체가 이미 렌더된 상태인데 못 찾았다 → 포기하고 복원
			restore();
			return;
		}
		const keep = sc.scrollTop;
		const step = Math.max(240, Math.floor(sc.clientHeight * 0.8));
		const tryNext = (y) => {
			if (y > sc.scrollHeight) {
				sc.scrollTop = keep;
				restore();
				return; // 찾지 못하면 아무것도 하지 않는다 (리로드로 앱을 날리지 않는다)
			}
			sc.scrollTop = y;
			setTimeout(() => {
				const el = document.querySelector(`a[href="/channels/@me/${id}"]`);
				if (el && call(el)) {
					sc.scrollTop = keep;
					restore();
					return;
				}
				tryNext(y + step);
			}, 140);
		};
		tryNext(0);
	}

	togglePin(id) {
		const s = this.settings;
		s.dmPins ??= [];
		if (s.dmPins.includes(id)) {
			s.dmPins = s.dmPins.filter((x) => x !== id);
			if (s.dmActive === "pins" && !s.dmPins.length) s.dmActive = null;
		} else {
			s.dmPins.push(id);
		}
		this.save();
		// 행의 별 표시 즉시 갱신
		for (const btn of document.querySelectorAll(`[data-cup-dm="${id}"] .cup-pin-btn`)) {
			const on = s.dmPins.includes(id);
			btn.dataset.cupOn = on ? "1" : "0";
			btn.title = on ? "고정 해제" : "이 대화 고정";
		}
		this.renderDMBar();
	}

	// 지금 열려 있는 DM 의 id (없으면 null)
	currentDM() {
		const m = /\/channels\/@me\/(\d+)/.exec(location.pathname);
		return m ? m[1] : null;
	}

	/* ＋ 버튼이 여는 작은 팝업 — 폴더 만들기 + 지금 대화 담기.
	   설정 모달까지 가지 않고 여기서 끝낼 수 있어야 쓸 만하다. */
	openDMPopup(anchor) {
		document.querySelector(".cup-dmpop")?.remove();
		const s = this.settings;
		s.dmFolders ??= [];
		s.dmPins ??= [];
		const cur = this.currentDM();
		const reg = s.dmRegistry ?? {};

		const pop = document.createElement("div");
		pop.className = "cup-dmpop";

		const title = document.createElement("div");
		title.className = "cup-dmpop-title";
		title.textContent = "DM 폴더";
		pop.appendChild(title);

		// 새 폴더
		const mk = document.createElement("div");
		mk.style.cssText = "display:flex;gap:6px;padding:2px 0 8px;";
		const inp = document.createElement("input");
		inp.type = "text";
		inp.className = "cup-text";
		inp.placeholder = "새 폴더 이름";
		inp.style.textAlign = "left";
		const go = document.createElement("button");
		go.type = "button";
		go.className = "cup-btn";
		go.textContent = "만들기";
		const create = () => {
			const nm = inp.value.trim();
			if (!nm) return;
			let base = "f" + nm.replace(/\s+/g, "").slice(0, 10);
			let uniq = base;
			let n = 2;
			while (s.dmFolders.some((f) => f.id === uniq)) uniq = base + n++;
			s.dmFolders.push({ id: uniq, name: nm, ids: cur ? [cur] : [] });
			this.save();
			this.renderDMBar();
			this.openDMPopup(anchor); // 다시 그려 방금 만든 폴더를 보여준다
		};
		go.addEventListener("click", create);
		inp.addEventListener("keydown", (e) => {
			if (e.key === "Enter") create();
		});
		mk.append(inp, go);
		pop.appendChild(mk);

		// 지금 대화
		const info = document.createElement("div");
		info.className = "cup-dmpop-sub";
		if (cur) {
			const nm = reg[cur]?.name ?? "지금 대화";
			info.textContent = `지금 열어둔 대화: ${nm}`;
		} else {
			info.textContent = "대화를 하나 열고 다시 누르면 그 대화를 담을 수 있어요.";
		}
		pop.appendChild(info);

		if (cur) {
			// 고정 토글
			const pinRow = document.createElement("label");
			pinRow.style.cssText = "display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;";
			const pcb = document.createElement("input");
			pcb.type = "checkbox";
			pcb.className = "cup-check";
			pcb.checked = s.dmPins.includes(cur);
			pcb.addEventListener("change", () => this.togglePin(cur));
			const ps = document.createElement("span");
			ps.textContent = "이 대화 고정";
			pinRow.append(pcb, ps);
			pop.appendChild(pinRow);

			// 폴더별 담기
			if (s.dmFolders.length) {
				for (const f of s.dmFolders) {
					const row = document.createElement("label");
					row.style.cssText = "display:flex;align-items:center;gap:10px;padding:7px 0;cursor:pointer;";
					const cb = document.createElement("input");
					cb.type = "checkbox";
					cb.className = "cup-check";
					cb.checked = f.ids.includes(cur);
					cb.addEventListener("change", () => {
						if (cb.checked) {
							if (!f.ids.includes(cur)) f.ids.push(cur);
						} else {
							f.ids = f.ids.filter((x) => x !== cur);
						}
						this.save();
						this.renderDMBar();
					});
					const sp = document.createElement("span");
					sp.textContent = f.name;
					row.append(cb, sp);
					pop.appendChild(row);
				}
			}
		}

		const more = document.createElement("button");
		more.type = "button";
		more.className = "cup-btn cup-btn-ghost";
		more.style.cssText = "width:100%;margin-top:8px;";
		more.textContent = "설정에서 자세히 관리";
		more.addEventListener("click", () => {
			pop.remove();
			this.openPanel();
		});
		pop.appendChild(more);

		// 위치: ＋ 버튼 아래
		const r = anchor.getBoundingClientRect();
		pop.style.left = `${Math.round(Math.min(r.left, window.innerWidth - 280))}px`;
		pop.style.top = `${Math.round(r.bottom + 6)}px`;
		document.body.appendChild(pop);

		const off = (e) => {
			if (pop.contains(e.target) || e.target === anchor) return;
			pop.remove();
			document.removeEventListener("mousedown", off, true);
		};
		setTimeout(() => document.addEventListener("mousedown", off, true), 0);
	}

	dmSetOf(active) {
		const s = this.settings;
		if (active === "pins") return [...(s.dmPins ?? [])];
		const f = (s.dmFolders ?? []).find((x) => x.id === active);
		return f ? [...f.ids] : [];
	}

	/* DM 목록 위에 칩 바 + (폴더 선택 시) 내가 그린 목록을 넣는다 */
	ensureDMBar() {
		const host = document.querySelector('[class*="privateChannels_"]');
		if (!host) return;
		let bar = host.querySelector(".cup-dm-bar");
		if (!bar) {
			bar = document.createElement("div");
			bar.className = "cup-dm-bar";
			const list = document.createElement("div");
			list.className = "cup-dm-list";
			// 검색바 바로 아래(스크롤러 앞)에 넣는다
			const scroller = host.querySelector('[class*="scroller"]');
			if (scroller) {
				host.insertBefore(bar, scroller);
				host.insertBefore(list, scroller);
			} else {
				host.append(bar, list);
			}
		}
		this.renderDMBar();
	}

	renderDMBar() {
		const host = document.querySelector('[class*="privateChannels_"]');
		const bar = host?.querySelector(".cup-dm-bar");
		const list = host?.querySelector(".cup-dm-list");
		if (!bar || !list) return;
		const s = this.settings;
		const active = s.dmActive ?? null;

		/* ── 칩 ──
		   ⚠️ 폴더가 하나도 없을 때 "전체" 칩만 띄우면 그게 뭔지 알 수 없다
		   (실제 피드백: "폴더가 뭔지 모르니"). 아무것도 없으면 만드는 버튼만 보여준다. */
		const hasAny = (s.dmPins ?? []).length > 0 || (s.dmFolders ?? []).length > 0;
		const chips = hasAny ? [["all", "전체"]] : [];
		if ((s.dmPins ?? []).length) chips.push(["pins", `★ 고정 ${s.dmPins.length}`]);
		for (const f of s.dmFolders ?? []) chips.push([f.id, `${f.name} ${f.ids.length}`]);
		const sig = chips.map((c) => c.join(":")).join("|") + "#" + String(active) + "#" + String(hasAny);
		if (bar.dataset.cupSig !== sig) {
			bar.dataset.cupSig = sig;
			bar.textContent = "";
			for (const [id, label] of chips) {
				const b = document.createElement("button");
				b.type = "button";
				b.className = "cup-dm-chip";
				b.textContent = label;
				const isActive = id === "all" ? active === null : active === id;
				b.dataset.cupOn = isActive ? "1" : "0";
				b.addEventListener("click", () => {
					s.dmActive = id === "all" ? null : id;
					this.save();
					this.renderDMBar();
				});
				bar.appendChild(b);
			}
			// ＋ : 폴더 만들기 / 지금 대화 담기
			const plus = document.createElement("button");
			plus.type = "button";
			plus.className = "cup-dm-chip cup-dm-plus";
			plus.textContent = hasAny ? "＋" : "＋ 폴더 만들기";
			plus.title = "DM 폴더 만들기 · 지금 대화 담기";
			plus.addEventListener("click", () => this.openDMPopup(plus));
			bar.appendChild(plus);
		}

		// ── 목록 ──
		document.documentElement.classList.toggle("cup-dm-filter", active !== null);
		if (active === null) {
			list.textContent = "";
			list.hidden = true;
			return;
		}
		list.hidden = false;
		const ids = this.dmSetOf(active);
		const reg = s.dmRegistry ?? {};
		list.textContent = "";
		if (!ids.length) {
			const empty = document.createElement("div");
			empty.className = "cup-dm-hint";
			empty.style.padding = "10px 12px";
			empty.textContent = "이 폴더에 넣은 대화가 없어요";
			list.appendChild(empty);
			return;
		}
		for (const id of ids) {
			const info = reg[id] ?? { name: `(알 수 없는 대화 ${id.slice(-4)})`, avatar: "" };
			const row = document.createElement("button");
			row.type = "button";
			row.className = "cup-dm-row";
			row.title = info.name;
			if (location.pathname.endsWith(id)) row.dataset.cupOn = "1";
			const av = document.createElement("span");
			av.className = "cup-dm-av";
			if (info.avatar) av.style.backgroundImage = `url(${info.avatar})`;
			const nm = document.createElement("span");
			nm.className = "cup-dm-name";
			nm.textContent = info.name;
			row.append(av, nm);
			const rs = this.readState(id);
			if (rs?.mentions > 0) {
				const bdg = document.createElement("span");
				bdg.className = "cup-dm-badge";
				bdg.textContent = String(rs.mentions);
				row.appendChild(bdg);
			} else if (rs?.unread) {
				const dot = document.createElement("span");
				dot.className = "cup-dm-dot";
				row.appendChild(dot);
			}
			row.addEventListener("click", () => {
				this.navigateDM(id);
				setTimeout(() => this.renderDMBar(), 700);
			});
			list.appendChild(row);
		}
	}

	/* 유저 패널에 설정 버튼을 하나 심는다 (디스코드 톱니 옆) */
	ensureCustomButton() {
		const panel = document.querySelector('section[class*="panels_"]');
		if (!panel) return;
		if (panel.querySelector(".cup-theme-btn")) return;
		const gear = panel.querySelector('button[aria-label*="설정"], button[aria-label*="Setting"]');
		const btn = document.createElement("button");
		btn.className = "cup-theme-btn";
		btn.type = "button";
		btn.title = "Cupertino 테마 설정";
		btn.setAttribute("aria-label", "Cupertino 테마 설정");
		btn.innerHTML =
			'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
			'<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7"/>' +
			'<path d="M12 3.8a8.2 8.2 0 0 0 0 16.4z" fill="currentColor"/></svg>';
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.openPanel();
		});
		if (gear?.parentElement) gear.parentElement.insertBefore(btn, gear);
		else panel.appendChild(btn);
	}

	/* 설정 모달 — getSettingsPanel() 과 같은 내용을 테마 유리 위에 띄운다 */
	openPanel() {
		document.querySelector(".cup-modal-backdrop")?.remove();
		const back = document.createElement("div");
		back.className = "cup-modal-backdrop";
		const box = document.createElement("div");
		box.className = "cup-modal";

		const head = document.createElement("div");
		head.className = "cup-modal-head";
		const title = document.createElement("span");
		title.textContent = "Cupertino 설정";
		const close = document.createElement("button");
		close.type = "button";
		close.className = "cup-modal-close";
		close.textContent = "✕";
		close.addEventListener("click", () => back.remove());
		head.append(title, close);

		const body = document.createElement("div");
		body.className = "cup-modal-body";
		body.appendChild(this.getSettingsPanel());

		box.append(head, body);
		back.appendChild(box);
		back.addEventListener("mousedown", (e) => {
			if (e.target === back) back.remove();
		});
		const onKey = (e) => {
			if (e.key === "Escape") {
				back.remove();
				document.removeEventListener("keydown", onKey, true);
			}
		};
		document.addEventListener("keydown", onKey, true);
		document.body.appendChild(back);
	}

	// ── 폴더 태깅 (fiber 읽기 전용) ─────────────────────────
	getFiber(node) {
		const key = Object.keys(node).find((k) => k.startsWith("__reactFiber"));
		return key ? node[key] : null;
	}

	findFolderNode(node) {
		let fiber = this.getFiber(node);
		for (let i = 0; i < 12 && fiber; i++, fiber = fiber.return) {
			const p = fiber.memoizedProps;
			if (p && typeof p === "object" && p.folderNode && p.folderNode.id != null) {
				return p.folderNode;
			}
		}
		return null;
	}

	tagFolders() {
		let changed = false;

		for (const el of document.querySelectorAll('[class*="folderGroup"]')) {
			if (el.getAttribute(ATTR)) continue;
			const fn = this.findFolderNode(el);
			if (!fn) continue;
			const id = String(fn.id);
			el.setAttribute(ATTR, id);

			const name = fn.name ? String(fn.name).trim() : "";
			this.names.set(id, name);
			if (!this.folders.has(id)) {
				this.folders.set(id, name || `이름 없는 폴더 (${id})`);
				changed = true;
			}

			// 처음 발견한 폴더에 자동 색을 배정한다.
			// DOM 순서대로 COLORS 를 돌려써서 인접한 폴더끼리 색이 겹치지 않게 하고,
			// 한 번 배정하면 저장해서 다시 켜도 같은 색이 유지되게 한다.
			this.settings.autoColorMap ??= {};
			if (!this.settings.autoColorMap[id]) {
				const used = Object.keys(this.settings.autoColorMap).length;
				this.settings.autoColorMap[id] = COLORS[used % COLORS.length];
				changed = true;
			}
		}

		this.applyLabels();
		if (changed) {
			this.save(); // 자동 배정된 색을 고정
			this.injectCSS();
		}
	}

	// 폴더가 실제로 쓸 색: 수동 지정 > 자동 배정 > 기본색
	colorFor(id) {
		const s = this.settings;
		return s.perFolder?.[id] || (s.autoColor ? s.autoColorMap?.[id] : null) || s.defaultColor;
	}

	// 라벨을 DOM 속성으로 반영한다.
	//  · 사용자가 직접 지정한 값이 있으면 그것
	//  · 없으면 폴더 이름의 첫 글자 ([...name] 으로 쪼개야 이모지도 한 글자로 잡힘)
	// ⚠️ content:attr() 는 의사요소가 붙은 "그 요소"의 속성만 읽는다.
	//    ::before 가 folderButton 에 있으므로 속성도 버튼에 붙여야 한다.
	//    버튼은 리렌더로 교체될 수 있어 매번 idempotent 하게 맞춘다.
	// ⚠️ 셀렉터는 반드시 folderButton_ (밑줄 포함). 밑줄을 빼면
	//    folderButtonInner__ / folderButtonContent__ 까지 잡혀서
	//    아이콘과 라벨이 3겹으로 겹쳐 그려진다.
	// 폴더 이름에서 자동으로 뽑는 라벨. [...name] 으로 쪼개야 이모지도 한 글자로 잡힌다.
	autoLabelFor(id) {
		const n = Math.min(Math.max(Number(this.settings.autoLabelChars) || 1, 1), 3);
		return [...(this.names.get(id) ?? "")]
			.slice(0, n)
			.join("")
			.toUpperCase();
	}

	applyLabels() {
		const s = this.settings;
		for (const el of document.querySelectorAll(`[${ATTR}]`)) {
			const id = el.getAttribute(ATTR);
			const custom = String(s.perFolderLabel?.[id] ?? "").trim();
			const auto = this.autoLabelFor(id);
			const label = s.showLetter ? custom || auto : "";
			const len = String(Math.min([...label].length, 3));

			for (const t of [el, ...el.querySelectorAll('[class*="folderButton_"]')]) {
				if (label) {
					if (t.getAttribute("data-cup-letter") !== label) t.setAttribute("data-cup-letter", label);
					if (t.getAttribute("data-cup-len") !== len) t.setAttribute("data-cup-len", len);
				} else {
					t.removeAttribute("data-cup-letter");
					t.removeAttribute("data-cup-len");
				}
			}
		}
	}

	observe() {
		// 폴더(좌측 레일)와 활동 패널(우측) 둘 다 감시해야 하므로 공통 조상에 붙인다.
		// 콜백은 250ms 디바운스 + idempotent 한 querySelector 몇 번뿐이라 부담이 없다.
		const root = document.getElementById("app-mount") ?? document.body;
		this.observer = new MutationObserver(() => {
			// 창이 백그라운드면 일 자체를 만들지 않는다 (오래 켜둘 때 체감 차이가 크다)
			if (document.hidden) return;
			clearTimeout(this.retagTimer);
			/* ⚠️ 성능: 이 콜백은 채팅이 흐르는 동안 끊임없이 예약된다.
			   디바운스를 400ms 로 늘리고, 실행은 유휴 시간으로 미뤄
			   스크롤·입력 프레임을 방해하지 않게 한다.
			   (requestIdleCallback 이 없으면 그냥 즉시 실행) */
			this.retagTimer = setTimeout(() => {
				const work = () => {
					this.tagFolders();
					this.ensureActivityToggle();
					this.ensureCustomButton();
					this.scanDMs();
					this.ensureDMBar();
					this.tagSurfaces();
				};
				if (typeof requestIdleCallback === "function") requestIdleCallback(work, { timeout: 800 });
				else work();
			}, 400);
		});
		this.observer.observe(root, { childList: true, subtree: true });
	}

	// ── 떠 있는 레이어의 transform 을 left/top 으로 바꿔 블러를 살린다 ──
	//
	// 문제: 디스코드는 메뉴·툴팁·팝오버 레이어를 인라인 transform 으로 배치한다
	//       (실측: layer__529b0 → matrix(1,0,0,1,36,157)).
	//       조상에 transform 이 있으면 backdrop-filter 의 backdrop 루트가 그
	//       레이어에 갇혀 블러가 CSS 규격상 완전히 무력화된다. CSS 로는 값을
	//       읽을 수 없어 손댈 수 없다.
	// 해법: JS 로 그 행렬을 읽어 같은 위치를 left/top 으로 재현하고
	//       transform 을 none 으로 만든다 → transform 조상이 사라져 블러가 살아난다.
	// 안전장치: 순수 이동(matrix(1,0,0,1,x,y))만 변환한다. 확대/회전이 섞인
	//       애니메이션 레이어는 건드리지 않는다 (건드리면 애니메이션이 깨진다).
	// ── 테마가 :has() 없이 판정할 수 있도록 조건을 속성으로 표시 ──
	//
	// 왜: 인자가 [class*="..."] 인 :has() 는 브라우저가 인덱싱하지 못해, DOM 이
	//     바뀔 때마다 광범위 무효화가 걸린다. 실측으로 채널 전환 비용의 94% 가
	//     이 :has() 들이었다 (전환 4회 1805ms 중 1691ms).
	//     → 여기서 한 번 판정해 data-cup-* 로 남기고, CSS 는 그 속성만 본다.
	//
	// ⚠️ 반드시 옵저버 콜백에서 "즉시" 불려야 한다. 디바운스 뒤로 미루면
	//    라이트박스가 뜬 직후 잠깐 모달 유리가 껴서 깜빡인다.
	tagSurfaces() {
		const mark = (el, attr, on) => {
			if (on) { if (!el.hasAttribute(attr)) el.setAttribute(attr, "1"); }
			else if (el.hasAttribute(attr)) el.removeAttribute(attr);
		};
		for (const el of document.querySelectorAll(
			'[class*="layerContainer_"], [role="dialog"], [class*="container__"], [class*="root_"], [class*="modal_"]',
		)) mark(el, "data-cup-lb", !!el.querySelector('[class*="lightbox"], [class*="imageZoom"]'));

		for (const el of document.querySelectorAll('[class*="outer_"]'))
			mark(el, "data-cup-banner", !!el.querySelector('[class*="banner"]'));

		for (const el of document.querySelectorAll('[class*="footer_"]'))
			mark(el, "data-cup-tafooter", !!el.querySelector('[class*="channelTextArea_"]'));
	}

	unwrapLayerTransforms() {
		for (const el of document.querySelectorAll('[class*="layer_"], [class*="Layer_"]')) {
			const inline = el.style?.transform;
			if (!inline || inline === "none") continue;

			/* ⚠️ 성능: getComputedStyle 은 호출마다 강제 스타일 재계산을 유발한다.
			   예전엔 요소당 4번 불렀다 → 한 번만 받아 재사용한다. */
			const cs = getComputedStyle(el);

			const m = /^matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/.exec(cs.transform);
			if (!m) continue; // 순수 이동이 아니면 그대로 둔다

			if (cs.position !== "absolute" && cs.position !== "fixed") continue; // left/top 이 안 먹는 배치면 포기

			const x = parseFloat(m[1]);
			const y = parseFloat(m[2]);
			const baseLeft = parseFloat(el.dataset.cupBaseLeft ?? String(parseFloat(cs.left) || 0));
			const baseTop = parseFloat(el.dataset.cupBaseTop ?? String(parseFloat(cs.top) || 0));
			if (!el.dataset.cupBaseLeft) {
				el.dataset.cupBaseLeft = String(baseLeft);
				el.dataset.cupBaseTop = String(baseTop);
			}

			el.style.setProperty("left", `${baseLeft + x}px`, "important");
			el.style.setProperty("top", `${baseTop + y}px`, "important");
			el.style.setProperty("transform", "none", "important");
			el.setAttribute("data-cup-unwrapped", "1");
		}
	}

	observeLayers() {
		// ⚠️ 메뉴 레이어는 layerContainer_ 안에 없다 (실측: menu → layer__529b0 →
		//    이름 없는 div → notAppAsidePanel → appMount). layerContainer 만
		//    관찰했더니 콜백이 아예 안 불려서 변환이 실행되지 않았다.
		//    → app-mount 전체를 본다. 콜백은 아래 cheap 가드로 대부분 즉시 빠진다.
		/* ⚠️ 루트는 app-mount 가 아니라 body 여야 한다. 실측: 유저 팝오버
		   (outer_c0bea0 … user-profile-popout)가 열려도 콜백이 안 불렸고
		   data-cup-banner 가 안 붙었다 — 수동으로 tagSurfaces() 를 부르면
		   바로 붙는 걸로 보아 옵저버가 그 마운트를 못 본 것이다. */
		const root = document.body;
		/* ⚠️⚠️ 성능(렉의 주범이었다): 예전 코드는 레코드를 보지 않고 무조건 16ms 뒤에
		   전역 querySelector 를 돌렸다. 디스코드는 스크롤·애니메이션·가상 리스트마다
		   인라인 style 을 바꾸므로, 결과적으로 "16ms 마다 문서 전체 속성 부분일치 탐색
		   + getComputedStyle(강제 스타일 재계산)" 이 상시로 돌았다.
		   → ① 레코드에 실제 레이어가 섞였을 때만 예약  ② 디바운스 16→80ms
		      ③ 창이 백그라운드면 아무 것도 하지 않는다(오래 켜둘 때의 누수 방지). */
		/* 태깅이 필요할 수 있는 요소들. 추가된 노드가 이것들 중 하나이거나
		   이것들을 품고 있을 때만 tagSurfaces() 를 돌린다 (평소 메시지 렌더에는
		   해당 없음 → 비용 0 에 가깝다). */
		const TAG_CANDIDATES = '[class*="layerContainer_"],[role="dialog"],[class*="container__"],[class*="root_"],[class*="modal_"],[class*="outer_"],[class*="footer_"],[class*="lightbox"],[class*="imageZoom"],[class*="banner"],[class*="channelTextArea_"]';
		const touchesLayer = (r) => {
			const cls = (el) => (el && el.nodeType === 1 && typeof el.className === "string" ? el.className : "");
			if (r.type === "attributes") return cls(r.target).includes("layer");
			for (const n of r.addedNodes) {
				if (n.nodeType !== 1) continue;
				if (cls(n).includes("layer")) return true;
				if (n.style && n.style.transform && n.style.transform !== "none") return true;
			}
			return false;
		};
		this.layerObserver = new MutationObserver((records) => {
			if (document.hidden) return;
			let hit = false, needsTag = false;
			for (const r of records) {
				if (!hit && touchesLayer(r)) hit = true;
				if (!needsTag && r.type === "childList") {
					for (const n of r.addedNodes) {
						if (n.nodeType !== 1) continue;
						if (n.matches?.(TAG_CANDIDATES) || n.querySelector?.(TAG_CANDIDATES)) { needsTag = true; break; }
					}
				}
				if (hit && needsTag) break;
			}
			// ⚠️ 태깅 조건을 "레이어" 로 좁혔더니 팝오버가 열려도 안 붙었다 (실측:
			//    data-cup-banner=null, 배경이 고쳐지기 전 값 rgba(31,33,40,0.66) 로 남음).
			//    팝오버는 outer_ 로 마운트되지 클래스에 "layer" 가 없다.
			//    → 태깅은 별도 조건으로 본다: 관심 대상이 추가됐을 때만.
			if (!hit && !needsTag) return;
			if (needsTag) this.tagSurfaces();   // 즉시여야 깜빡임이 없다
			if (!hit || this.layerTimer) return;
			this.layerTimer = setTimeout(() => {
				this.layerTimer = null;
				const pending = document.querySelector('[class*="layer_"][style*="transform"], [class*="Layer_"][style*="transform"]');
				if (pending) this.unwrapLayerTransforms();
			}, 80);
		});
		this.layerObserver.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
	}

	// ── "현재 활동 중" 접기 버튼 ─────────────────────────────
	// 설정 체크박스만으로는 못 찾겠다는 피드백이 있어 헤더에 실제 버튼을 넣는다.
	ensureActivityToggle() {
		const panel = document.querySelector('[class*="refresh-active-now"]');
		if (!panel) return;
		const head = panel.querySelector("h2");
		if (!head) return;

		let btn = head.querySelector(".cup-activity-toggle");
		if (!btn) {
			btn = document.createElement("button");
			btn.type = "button";
			btn.className = "cup-activity-toggle";
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.settings.hideActivity = !this.settings.hideActivity;
				this.save();
				this.applyClasses();
				this.syncActivityToggle();
			});
			head.appendChild(btn);
		}
		this.syncActivityToggle();
	}

	syncActivityToggle() {
		const hidden = !!this.settings.hideActivity;
		for (const btn of document.querySelectorAll(".cup-activity-toggle")) {
			btn.textContent = hidden ? "«" : "»";
			btn.title = hidden ? "현재 활동 중 펼치기" : "현재 활동 중 접기";
			btn.setAttribute("aria-label", btn.title);
		}
	}

	// ── CSS ────────────────────────────────────────────────
	iconRule(selector, color) {
		const set = ICONS[color] ?? ICONS[this.settings.defaultColor] ?? ICONS[COLORS[0]];
		if (!set) return "";
		// c = 닫힌 폴더, o = 열린 폴더 (펼친 상태)
		return (
			`${selector} [class*="folderButton_"]::after{background-image:url(${set.c});}` +
			`${selector}[class*="isExpanded"] [class*="folderButton_"]::after{background-image:url(${set.o});}`
		);
	}

	injectCSS() {
		const s = this.settings;
		let css = `
/* 유저 패널의 테마 설정 버튼 — 디스코드 톱니와 같은 크기/여백을 맞춘다 */
.cup-theme-btn{
	display:flex;align-items:center;justify-content:center;
	width:32px;height:32px;flex:0 0 auto;
	background:none;border:none;padding:0;margin:0;
	color:var(--interactive-normal,#b5bac1);cursor:pointer;
	border-radius:var(--r-sm,10px);
	transition:background-color .15s ease,color .15s ease;
}
.cup-theme-btn:hover{ background:var(--fill-hover,rgba(255,255,255,.07)); color:var(--interactive-hover,#dbdee1); }

/* 설정 모달 — 테마의 유리를 그대로 쓴다 */
.cup-modal-backdrop{
	position:fixed;inset:0;z-index:4000;
	display:flex;align-items:center;justify-content:center;
	background:rgba(0,0,0,.55);
	-webkit-backdrop-filter:blur(7px) brightness(.92);backdrop-filter:blur(7px) brightness(.92);
}
.cup-modal{
	width:min(560px,calc(100vw - 48px));max-height:min(720px,calc(100vh - 96px));
	display:flex;flex-direction:column;overflow:hidden;
	border-radius:var(--r-xl,24px);
	background-color:var(--panel-modal,rgba(27,29,34,.7));
	background-image:var(--glass-tint,none);
	-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);
	border:1px solid var(--edge-side,rgba(255,255,255,.09));
	border-top-color:var(--edge-top,rgba(255,255,255,.19));
	border-bottom-color:var(--edge-bottom,rgba(255,255,255,.05));
	box-shadow:var(--glass-depth,0 16px 44px rgba(0,0,0,.5)),var(--glass-specular,none);
	color:var(--text-default,#dbdee1);
}
.cup-modal-head{
	display:flex;align-items:center;justify-content:space-between;
	padding:16px 20px;flex:0 0 auto;
	font-weight:700;font-size:16px;
	border-bottom:1px solid var(--hair,rgba(255,255,255,.07));
}
.cup-modal-close{
	width:28px;height:28px;display:flex;align-items:center;justify-content:center;
	background:var(--fill-hover,rgba(255,255,255,.07));border:none;color:inherit;
	border-radius:999px;cursor:pointer;font-size:13px;line-height:1;
}
.cup-modal-close:hover{ background:var(--fill-selected,rgba(255,255,255,.11)); }
/* ⚠️ 아래 여백을 반드시 둔다 — 잘린 내용이 둥근 모서리에 물리면 답답해 보인다
   (전체 프로필 모달에서 같은 문제를 겪었다) */
.cup-modal-body{ overflow-y:auto;overflow-x:hidden;padding:4px 20px 20px;flex:1 1 auto; }

/* ══ 커스텀 컨트롤 ══════════════════════════════════════════
   네이티브 컨트롤은 OS 가 그려서 테마와 전혀 안 맞는다
   (실측: range 배경이 흰색 rgb(255,255,255), checkbox/color 는 appearance:auto).
   ⚠️ <select> 의 펼친 목록은 OS 팝업이라 CSS 로 손댈 수 없다 →
     select 를 쓰지 않고 버튼 + 유리 팝업으로 직접 만든다. */

/* 체크박스 */
.cup-check{
	appearance:none;-webkit-appearance:none;
	width:20px;height:20px;flex:0 0 auto;margin:0;
	border-radius:6px;cursor:pointer;position:relative;
	background:rgba(127,127,127,.18);
	border:1px solid rgba(127,127,127,.34);
	transition:background-color .15s ease,border-color .15s ease;
}
.cup-check:hover{ border-color:rgba(127,127,127,.5); }
.cup-check:checked{
	background:var(--t-blue,#3182f6);
	border-color:var(--t-blue,#3182f6);
}
.cup-check:checked::after{
	content:"";position:absolute;left:6px;top:2.5px;
	width:5px;height:10px;
	border:2px solid #fff;border-top:0;border-left:0;
	transform:rotate(40deg);
}
.cup-check:focus-visible{ outline:2px solid var(--t-blue-ring,rgba(49,130,246,.28));outline-offset:2px; }

/* 슬라이더 — 채워진 부분은 JS 가 --cup-fill 로 알려준다 */
.cup-range{
	appearance:none;-webkit-appearance:none;
	height:22px;background:transparent;cursor:pointer;margin:0;
}
.cup-range::-webkit-slider-runnable-track{
	height:6px;border-radius:999px;
	background:linear-gradient(to right,
		var(--t-blue,#3182f6) 0 var(--cup-fill,50%),
		rgba(127,127,127,.26) var(--cup-fill,50%) 100%);
}
.cup-range::-webkit-slider-thumb{
	appearance:none;-webkit-appearance:none;
	width:18px;height:18px;margin-top:-6px;
	border-radius:999px;background:#fff;
	border:1px solid rgba(0,0,0,.18);
	box-shadow:0 1px 4px rgba(0,0,0,.35);
	transition:transform .12s ease;
}
.cup-range:hover::-webkit-slider-thumb{ transform:scale(1.12); }
.cup-range:active::-webkit-slider-thumb{ transform:scale(1.04); }
.cup-range:focus-visible{ outline:none; }
.cup-range:focus-visible::-webkit-slider-thumb{ box-shadow:0 0 0 4px var(--t-blue-ring,rgba(49,130,246,.28)); }

/* 드롭다운 (직접 만든 것) */
.cup-drop{ position:relative;max-width:60%; }
.cup-drop-btn{
	display:flex;align-items:center;gap:8px;width:100%;
	background:rgba(127,127,127,.16);color:var(--text-default,inherit);
	border:1px solid rgba(127,127,127,.28);
	border-radius:var(--r-sm,10px);
	padding:7px 10px;font-size:13px;font-family:inherit;cursor:pointer;
	transition:background-color .15s ease,border-color .15s ease;
}
.cup-drop-btn:hover{ background:rgba(127,127,127,.24); }
.cup-drop-btn > span{ flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.cup-drop-btn::after{
	content:"";width:6px;height:6px;flex:0 0 auto;
	border:1.6px solid currentColor;border-top:0;border-left:0;
	transform:rotate(45deg) translateY(-1px);opacity:.6;
}
.cup-drop-list{
	position:absolute;right:0;top:calc(100% + 6px);z-index:10;
	min-width:100%;max-height:260px;overflow-y:auto;
	padding:6px;border-radius:var(--r-md,14px);
	background-color:var(--panel-pop,rgba(30,32,38,.6));
	background-image:var(--glass-tint,none);
	-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);
	border:1px solid var(--edge-side,rgba(255,255,255,.09));
	border-top-color:var(--edge-top,rgba(255,255,255,.19));
	box-shadow:var(--glass-depth,0 12px 34px rgba(0,0,0,.46));
}
.cup-drop-list[hidden]{ display:none; }
.cup-drop-opt{
	display:flex;align-items:center;gap:8px;width:100%;
	background:none;border:none;color:inherit;font-family:inherit;
	padding:8px 10px;font-size:13px;text-align:left;cursor:pointer;
	border-radius:var(--r-sm,10px);
}
.cup-drop-opt:hover{ background:var(--fill-hover,rgba(255,255,255,.07)); }
.cup-drop-opt[data-cup-sel="1"]{ background:var(--t-blue-tint,rgba(49,130,246,.14)); }
.cup-drop-opt[data-cup-sel="1"]::after{
	content:"";margin-left:auto;width:5px;height:9px;
	border:2px solid var(--t-blue,#3182f6);border-top:0;border-left:0;
	transform:rotate(40deg);
}

/* 색상 입력 — 네이티브 피커 창은 OS 것이지만 보이는 견본은 우리가 그린다 */
.cup-color{
	appearance:none;-webkit-appearance:none;
	width:46px;height:28px;padding:0;cursor:pointer;
	background:none;border:1px solid rgba(127,127,127,.34);
	border-radius:var(--r-sm,10px);overflow:hidden;
}
.cup-color::-webkit-color-swatch-wrapper{ padding:0; }
.cup-color::-webkit-color-swatch{ border:none;border-radius:calc(var(--r-sm,10px) - 2px); }

/* 텍스트 입력 (폴더 라벨) */
.cup-text{
	width:100%;box-sizing:border-box;font-family:inherit;
	background:rgba(127,127,127,.16);color:var(--text-default,inherit);
	border:1px solid rgba(127,127,127,.28);
	border-radius:var(--r-sm,10px);
	padding:7px 8px;font-size:13px;text-align:center;
}
.cup-text:focus{ outline:none;border-color:var(--t-blue,#3182f6); }

/* ══ DM 폴더 / 고정 ══════════════════════════════════════ */
.cup-dm-bar{
	display:flex;flex-wrap:wrap;gap:6px;flex:0 0 auto;
	padding:6px 10px 8px;align-items:center;
}
.cup-dm-chip{
	font-family:inherit;font-size:12px;font-weight:600;line-height:1;
	padding:6px 10px;border-radius:999px;cursor:pointer;
	background:var(--fill-hover,rgba(255,255,255,.07));
	color:var(--interactive-normal,#b5bac1);
	border:1px solid transparent;
	transition:background-color .14s ease,color .14s ease;
}
.cup-dm-chip:hover{ background:var(--fill-selected,rgba(255,255,255,.11));color:var(--interactive-hover,#dbdee1); }
.cup-dm-chip[data-cup-on="1"]{
	background:var(--t-blue-tint,rgba(49,130,246,.14));
	border-color:var(--t-blue-ring,rgba(49,130,246,.28));
	color:var(--t-blue,#3182f6);
}
.cup-dm-hint{ font-size:11px;opacity:.5;padding-left:2px; }
.cup-dm-plus{ font-weight:700; }

/* DM 행에 호버하면 뜨는 고정(별) 버튼 — 기능을 "발견" 하게 하는 장치.

   ⚠️⚠️ 위치·z-index 둘 다 중요하다 (실측으로 두 번 틀렸다):
     · right:6px 에 두면 **디스코드의 ✕(대화 닫기) 버튼과 겹쳐서**
       클릭이 그쪽으로 먹힌다 (hit test 최상단이 ✕ 의 SVG path 였다).
       리스너는 정상이라 btn.click() 은 되는데 마우스로는 안 눌리는,
       찾기 힘든 증상이 된다. → ✕ 왼쪽으로 비켜 앉힌다.
     · 행 안의 앵커가 z-index:1 을 갖고 있어서 내 버튼이 z-index auto 면
       구간에 따라 앵커에 가린다. → z-index 2.
   ⚠️ 이 문자열은 템플릿 리터럴 안이다 — 주석에도 백틱을 쓰면 문자열이 끊긴다. */
.cup-pin-btn{
	position:absolute;right:32px;top:50%;transform:translateY(-50%);
	z-index:2;
	width:22px;height:22px;display:flex;align-items:center;justify-content:center;
	background:none;border:none;padding:0;cursor:pointer;
	color:var(--interactive-normal,#b5bac1);
	font-size:13px;line-height:1;border-radius:999px;
	opacity:0;transition:opacity .12s ease,color .12s ease,background-color .12s ease;
}
[data-cup-dm]:hover .cup-pin-btn{ opacity:.75; }
.cup-pin-btn:hover{ opacity:1!important;background:var(--fill-selected,rgba(255,255,255,.11)); }
/* 고정된 대화는 호버하지 않아도 별이 보인다 */
.cup-pin-btn[data-cup-on="1"]{ opacity:1;color:var(--t-blue,#3182f6); }

/* ＋ 팝업 */
.cup-dmpop{
	position:fixed;z-index:4100;width:264px;
	padding:12px;border-radius:var(--r-md,14px);
	background-color:var(--panel-pop,rgba(30,32,38,.6));
	background-image:var(--glass-tint,none);
	-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);
	border:1px solid var(--edge-side,rgba(255,255,255,.09));
	border-top-color:var(--edge-top,rgba(255,255,255,.19));
	box-shadow:var(--glass-depth,0 12px 34px rgba(0,0,0,.46));
	color:var(--text-default,#dbdee1);font-size:13px;
}
.cup-dmpop-title{ font-weight:700;font-size:14px;padding-bottom:8px; }
.cup-dmpop-sub{ opacity:.6;font-size:12px;line-height:1.5;padding:4px 0 2px; }

.cup-dm-list{ flex:0 0 auto;padding:0 8px 8px;overflow-y:auto;max-height:60vh; }
.cup-dm-list[hidden]{ display:none; }
.cup-dm-row{
	display:flex;align-items:center;gap:10px;width:100%;
	background:none;border:none;font-family:inherit;color:var(--interactive-normal,#b5bac1);
	padding:6px 8px;border-radius:var(--r-sm,10px);cursor:pointer;text-align:left;
	transition:background-color .12s ease,color .12s ease;
}
.cup-dm-row:hover{ background:var(--fill-hover,rgba(255,255,255,.07));color:var(--interactive-hover,#dbdee1); }
.cup-dm-row[data-cup-on="1"]{ background:var(--fill-selected,rgba(255,255,255,.11));color:var(--text-default,#fff); }
.cup-dm-av{
	width:32px;height:32px;flex:0 0 auto;border-radius:999px;
	background:rgba(127,127,127,.25) center/cover no-repeat;
}
.cup-dm-name{ flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px; }
.cup-dm-dot{ width:8px;height:8px;border-radius:999px;background:var(--text-default,#fff);flex:0 0 auto; }
.cup-dm-badge{
	min-width:18px;height:18px;padding:0 5px;flex:0 0 auto;
	display:flex;align-items:center;justify-content:center;
	border-radius:999px;background:#f23f43;color:#fff;
	font-size:12px;font-weight:700;line-height:1;
}
/* 폴더를 고르면 디스코드의 원래 목록은 감춘다 (내가 그린 목록만 보이게).
   ⚠️ 목록 자체를 지우지 않고 숨기기만 한다 — 가상 스크롤 상태를 건드리면
     되돌릴 때 스크롤 위치·렌더가 깨진다. */
html.cup-dm-filter [class*="privateChannels_"] [class*="scroller"]{ display:none!important; }

/* 설정 모달의 DM 관리 표 */
.cup-dmrow{ display:grid;grid-template-columns:1fr 84px 116px;gap:10px;align-items:center;padding:5px 0; }
.cup-dmrow > span:first-child{ overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.cup-dm-search{
	width:100%;box-sizing:border-box;font-family:inherit;margin:4px 0 8px;
	background:rgba(127,127,127,.16);color:var(--text-default,inherit);
	border:1px solid rgba(127,127,127,.28);border-radius:var(--r-sm,10px);
	padding:8px 10px;font-size:13px;
}
.cup-dm-search:focus{ outline:none;border-color:var(--t-blue,#3182f6); }
.cup-btn{
	font-family:inherit;font-size:13px;font-weight:600;
	padding:7px 12px;border-radius:var(--r-sm,10px);cursor:pointer;
	background:var(--t-blue,#3182f6);color:#fff;border:none;
}
.cup-btn:hover{ background:var(--t-blue-hover,#1b64da); }
.cup-btn-ghost{
	background:rgba(127,127,127,.16);color:var(--text-default,inherit);
	border:1px solid rgba(127,127,127,.28);
}
.cup-btn-ghost:hover{ background:rgba(127,127,127,.26); }

/* 강조색 견본 */
.cup-swatches{ display:flex;flex-wrap:wrap;gap:8px;padding:8px 0; }
.cup-swatch{
	width:28px;height:28px;border-radius:999px;cursor:pointer;
	border:2px solid transparent;padding:0;
	box-shadow:inset 0 1px 0 rgba(255,255,255,.25);
	transition:transform .12s ease;
}
.cup-swatch:hover{ transform:scale(1.12); }
.cup-swatch[data-cup-active="1"]{ border-color:#fff; }
`;

		if (s.folderIcons) {
			css += `
/* 폴더 기본 미리보기(안에 든 서버 아이콘들)를 가리고 진짜 폴더 아이콘을 덮는다.

   실측한 접힌 폴더 구조:
     folderGroup > listItem > folderHeader > folderButton(48x48) > wrapper_cc5dd2 > svg
   folderIconWrapper 는 "펼친" 상태에만 존재하므로 그것만 타겟하면
   미리보기는 숨겨지고 아이콘은 안 그려져 빈칸이 된다. → folderButton 을 쓴다.

   ::after 는 folderButton 자신의 의사요소라 자식 숨김에 영향받지 않지만,
   조상 visibility 상속에 걸리지 않도록 visible 을 명시한다. */
[${ATTR}] [class*="folderButton_"]{position:relative;}
[${ATTR}] [class*="folderButton_"] > *{visibility:hidden!important;}
[${ATTR}] [class*="folderIconWrapper"] > *,
[${ATTR}] [class*="folderPreviewWrapper"],
[${ATTR}] [class*="folderPreview"]{visibility:hidden!important;}

/* ⚠️⚠️ 위 "직계 자식 전부 숨김" 이 **멘션/안읽음 배지까지 지웠다.**
   실측 구조: folderButton > wrapper_cc5dd2 > (svg + lowerBadge_cc5dd2)
   배지가 숨긴 wrapper 안에 있어서 폴더에 멘션이 와도 빨간 "1" 이 안 떴다.
   (합성 배지를 folderButton 안에 넣어보니 visibility:hidden, 부모인
    folderHeader 에 넣으면 visible — 이 규칙이 원인인 게 확정됐다.)

   visibility 는 상속되지만 **자손이 visible 로 되살릴 수 있다** → 배지만 복원.
   z-index 3 이 필요하다: 내 라벨(::before)이 2, 아이콘(::after)은 auto 라
   그냥 되살리면 아이콘·라벨에 묻힌다. */
[${ATTR}] [class*="folderButton_"] [class*="lowerBadge"],
[${ATTR}] [class*="folderButton_"] [class*="numberBadge"],
[${ATTR}] [class*="folderButton_"] [class*="iconBadge"],
[${ATTR}] [class*="folderButton_"] [class*="badge_"]{
	visibility:visible!important;
	z-index:3!important;
}
[${ATTR}] [class*="folderButton_"]::after{
	content:"";position:absolute;inset:4px;
	visibility:visible!important;
	background-size:contain;background-repeat:no-repeat;background-position:center;
	pointer-events:none;
	filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));
	transition:transform .22s cubic-bezier(.32,.72,0,1),opacity .22s ease,filter .22s ease;
}

/* 펼친 상태 = 열린 폴더 그림 자체가 바뀐다 (iconRule 이 배경을 교체).
   모양이 이미 다르니 크기/투명도는 살짝만 건드리고, 첫 글자는 숨긴다
   (열린 폴더는 앞판이 기울어 글자 자리가 없다). */
[${ATTR}][class*="isExpanded"] [class*="folderButton_"]::after{
	transform:scale(1.04);
}
[${ATTR}][class*="isExpanded"] [class*="folderButton_"][data-cup-letter]::before{
	opacity:0;
	transform:scale(.8);
}
`;

			if (s.showLetter) {
				css += `
/* 폴더 라벨 (data-cup-letter / data-cup-len 은 플러그인이 붙임) */
[${ATTR}] [class*="folderButton_"][data-cup-letter]::before{
	content:attr(data-cup-letter);
	position:absolute;inset:4px;
	visibility:visible!important;
	display:flex;align-items:center;justify-content:center;
	z-index:2;pointer-events:none;
	/* 폴더 앞판(아래쪽 3/4)에 글자가 오도록 살짝 내린다 */
	padding-top:7px;
	font-weight:800;line-height:1;
	color:rgba(255,255,255,.95);
	text-shadow:0 1px 3px rgba(0,0,0,.45);
	transition:opacity .22s ease,transform .22s cubic-bezier(.32,.72,0,1);
}
/* CSS 는 글자 수를 셀 수 없으니 플러그인이 넣어준 data-cup-len 으로 크기를 맞춘다 */
[${ATTR}] [class*="folderButton_"][data-cup-len="1"]::before{font-size:15px;}
[${ATTR}] [class*="folderButton_"][data-cup-len="2"]::before{font-size:12px;letter-spacing:-.6px;}
[${ATTR}] [class*="folderButton_"][data-cup-len="3"]::before{font-size:9.5px;letter-spacing:-.6px;}
`;
			}
			// 기본 색 (아직 태깅 안 된 폴더용 폴백)
			css += this.iconRule(`[${ATTR}]`, s.defaultColor);
			// 폴더별 색 = 수동 > 자동 > 기본
			const ids = new Set([...this.folders.keys(), ...Object.keys(s.perFolder ?? {}), ...Object.keys(s.autoColorMap ?? {})]);
			for (const id of ids) {
				const color = this.colorFor(id);
				if (!color || !ICONS[color] || color === s.defaultColor) continue;
				// 속성 셀렉터의 값은 따옴표 안이라 CSS.escape 가 필요 없다
				// (오히려 숫자 ID 를 \32 ... 형태로 바꿔놔서 헷갈린다)
				css += this.iconRule(`[${ATTR}="${id}"]`, color);
			}
		}

		css += `
/* ── DM 블러 (프라이버시) ── */
html.cup-blur-dms [class*="privateChannels_"] [class*="name_"],
html.cup-blur-dms [class*="privateChannels_"] [class*="subtext"],
html.cup-blur-dms [class*="privateChannels_"] [class*="avatar"] img,
html.cup-blur-dms [class*="privateChannels_"] [class*="avatarStack"]{
	filter:blur(6px);
	transition:filter .12s ease;
}
html.cup-blur-dms.cup-blur-hover [class*="privateChannels_"] [class*="channel_"]:hover [class*="name_"],
html.cup-blur-dms.cup-blur-hover [class*="privateChannels_"] [class*="channel_"]:hover [class*="subtext"],
html.cup-blur-dms.cup-blur-hover [class*="privateChannels_"] [class*="channel_"]:hover [class*="avatar"] img,
html.cup-blur-dms.cup-blur-hover [class*="privateChannels_"] [class*="channel_"]:hover [class*="avatarStack"]{
	filter:none;
}

/* ── "현재 활동 중" 접기 버튼 ── */
[class*="refresh-active-now"] h2{
	display:flex!important;
	align-items:center;
}
.cup-activity-toggle{
	margin-left:auto;
	flex:0 0 auto;
	background:transparent;border:none;color:inherit;
	opacity:.5;cursor:pointer;
	font-size:15px;font-weight:700;line-height:1;
	padding:4px 7px;border-radius:8px;
	transition:opacity .12s ease,background-color .12s ease;
}
.cup-activity-toggle:hover{opacity:1;background:rgba(255,255,255,.09);}

/* ── 접힌 상태: 좁은 띠로 줄여 가로 공간을 되돌려준다 ──

   실측 구조 (친구 화면):
     tabBody
     ├ peopleColumn   1589px  ← 친구 목록 본체. 절대 건드리면 안 된다
     └ nowPlayingColumn 420px (min-width:360px, flex:0 1 30%)  ← 폭을 잡는 요소
        └ aside.refresh-active-now
           └ scroller > div > h2 "현재 활동 중" + 카드들
   폭을 되돌리려면 refresh-active-now 가 아니라 nowPlayingColumn 을 줄여야 한다.

   h2 의 제목은 텍스트 노드라 CSS 로 숨길 수 없어서 font-size:0 으로 지우고
   버튼만 크기를 되살린다. */
html.cup-hide-activity [class*="nowPlayingColumn"]{
	flex:0 0 46px!important;
	width:46px!important;
	min-width:46px!important;
	overflow:hidden!important;
}
html.cup-hide-activity [class*="refresh-active-now"]{
	width:46px!important;
	min-width:46px!important;
	overflow:hidden!important;
	border-radius:0!important; /* 46px 짜리 좁은 띠에 큰 곡률이 붙으면 이상하다 */
}
html.cup-hide-activity [class*="refresh-active-now"] h2{
	font-size:0!important;
	padding-left:0!important;padding-right:0!important;
	justify-content:center;
}
html.cup-hide-activity .cup-activity-toggle{
	font-size:15px!important;
	margin-left:0;
}
/* 헤더 뒤에 오는 카드들만 숨긴다 (peopleColumn 은 절대 건드리지 않는다) */
html.cup-hide-activity [class*="refresh-active-now"] h2 ~ *{
	display:none!important;
}
`;
		BdApi.DOM.addStyle(STYLE_ID, css);
	}

	// ── 설정 변경 처리 (document 레벨 위임) ──────────────────
	// 왜 위임인가: BD 가 getSettingsPanel() 이 돌려준 DOM 을 직렬화해서 렌더하면
	// addEventListener 로 붙인 핸들러가 전부 사라져 "바꿔도 반영 안 되는" 상태가
	// 된다. document 에 한 번 붙여두면 패널이 어떻게 렌더되든 항상 동작한다.
	handleSettingEvent(e) {
		const el = e.target;
		const key = el?.dataset?.cupSetting;
		if (!key) return;
		const value = el.type === "checkbox" ? el.checked : el.value;
		this.setSetting(key, value, el.dataset.cupFolderId);
	}


	/* 커스텀 컨트롤은 네이티브 change/input 이벤트가 없으므로 여기로 모은다.
	   ⚠️ handleSettingEvent 와 로직이 갈라지면 반드시 어긋난다 →
	     handleSettingEvent 는 이 함수를 부르는 얇은 껍데기로만 둔다. */
	setSetting(key, value, folderId) {
		const s = this.settings;
		let needCss = false;
		let needLabels = false;

		switch (key) {
			case "folderIcons":
			case "showLetter":
			case "autoColor":
				s[key] = !!value;
				needCss = true;
				if (key === "showLetter") needLabels = true;
				break;
			case "blurDMs":
			case "blurDMsRevealOnHover":
			case "hideActivity":
				s[key] = !!value;
				this.applyClasses();
				this.syncActivityToggle();
				break;
			case "autoLabelChars":
				s.autoLabelChars = Number(value) || 1;
				needLabels = true;
				break;
			case "defaultColor":
				s.defaultColor = value;
				needCss = true;
				break;
			case "perFolder":
				if (!folderId) return;
				s.perFolder[folderId] = value;
				needCss = true;
				break;
			case "perFolderLabel": {
				if (!folderId) return;
				const v = String(value ?? "").trim();
				if (v) s.perFolderLabel[folderId] = v;
				else delete s.perFolderLabel[folderId];
				needLabels = true;
				break;
			}
			case "appearance":
			case "font":
			case "radius":
				s[key] = value;
				this.applyCustom();
				break;
			case "accent":
				s.accent = value;
				this.applyCustom();
				this.syncSwatches();
				break;
			case "fontScale":
			case "glass":
				s[key] = Number(value) || 0;
				this.applyCustom();
				break;
			case "panelBlur":
				s.panelBlur = !!value;
				this.applyCustom();
				break;
			default:
				return;
		}

		this.save();
		if (needLabels) this.applyLabels();
		if (needCss) this.injectCSS();

		if (key === "autoLabelChars" || key === "showLetter") {
			for (const inp of document.querySelectorAll('[data-cup-setting="perFolderLabel"]')) {
				const fid = inp.dataset.cupFolderId;
				if (fid) inp.placeholder = this.autoLabelFor(fid) || "-";
			}
		}
	}

	// ── 커스텀 컨트롤 빌더 ────────────────────────────────
	cupCheck(label, key) {
		const row = document.createElement("label");
		row.style.cssText = "display:flex;align-items:center;gap:11px;padding:9px 0;cursor:pointer;line-height:1.45;";
		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.className = "cup-check";
		cb.checked = !!this.settings[key];
		cb.dataset.cupSetting = key;
		const span = document.createElement("span");
		span.textContent = label;
		row.append(cb, span);
		return row;
	}

	cupSlider(label, key, min, max, step) {
		const cur = Number(this.settings[key] ?? min);
		const row = document.createElement("div");
		row.style.cssText = "display:flex;align-items:center;gap:12px;padding:9px 0;";
		const t = document.createElement("span");
		t.textContent = label;
		t.style.cssText = "min-width:88px;flex:0 0 auto;";
		const r = document.createElement("input");
		r.type = "range";
		r.className = "cup-range";
		r.min = String(min);
		r.max = String(max);
		r.step = String(step);
		r.value = String(cur);
		r.dataset.cupSetting = key;
		r.style.flex = "1";
		const num = document.createElement("span");
		num.dataset.cupNum = "1";
		num.textContent = `${cur}%`;
		num.style.cssText = "min-width:46px;text-align:right;opacity:.7;font-variant-numeric:tabular-nums;flex:0 0 auto;";
		const paint = () => {
			const pct = ((Number(r.value) - min) / (max - min)) * 100;
			r.style.setProperty("--cup-fill", `${pct}%`);
			num.textContent = `${r.value}%`;
		};
		paint();
		r.addEventListener("input", paint);
		row.append(t, r, num);
		return row;
	}

	/* 직접 만든 드롭다운. options = [[value, label], …] */
	cupDrop(label, key, options, current, folderId) {
		const row = document.createElement("div");
		row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;";
		const t = document.createElement("span");
		t.textContent = label;
		t.style.cssText = "flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

		const drop = document.createElement("div");
		drop.className = "cup-drop";
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "cup-drop-btn";
		const btnText = document.createElement("span");
		const nameOf = (v) => (options.find(([val]) => val === String(v)) ?? ["", String(v)])[1];
		btnText.textContent = nameOf(current);
		btn.appendChild(btnText);

		const list = document.createElement("div");
		list.className = "cup-drop-list";
		list.hidden = true;

		const closeAll = () => {
			for (const l of document.querySelectorAll(".cup-drop-list")) l.hidden = true;
		};

		for (const [val, name] of options) {
			const o = document.createElement("button");
			o.type = "button";
			o.className = "cup-drop-opt";
			o.textContent = name;
			o.dataset.cupSel = String(val) === String(current) ? "1" : "0";
			o.addEventListener("click", (e) => {
				e.stopPropagation();
				btnText.textContent = name;
				for (const sib of list.children) sib.dataset.cupSel = "0";
				o.dataset.cupSel = "1";
				list.hidden = true;
				this.setSetting(key, val, folderId);
			});
			list.appendChild(o);
		}

		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			const wasHidden = list.hidden;
			closeAll();
			list.hidden = !wasHidden;
		});
		// 바깥을 누르면 닫는다 (모달이 닫힐 때 같이 사라지므로 정리 불필요)
		drop.addEventListener("click", (e) => e.stopPropagation());

		drop.append(btn, list);
		row.append(t, drop);
		return row;
	}

	/* 폴더를 추가/삭제하면 패널 구조 자체가 바뀌므로 모달 본문을 다시 그린다.
	   (BD 설정 화면에서 열었을 때는 모달이 없으니 조용히 넘어간다) */
	refreshPanel() {
		const body = document.querySelector(".cup-modal-body");
		if (!body) return;
		const top = body.scrollTop;
		body.textContent = "";
		body.appendChild(this.getSettingsPanel());
		body.scrollTop = top;
	}

	// 견본의 선택 표시 갱신 (커스텀 hex 를 넣었을 때도 반영)
	syncSwatches() {
		const cur = String(this.settings.accent);
		for (const sw of document.querySelectorAll("[data-cup-accent]")) {
			sw.dataset.cupActive = sw.dataset.cupAccent === cur ? "1" : "0";
		}
	}

	// ── 설정 패널 ──────────────────────────────────────────
	getSettingsPanel() {
		const wrap = document.createElement("div");
		wrap.style.cssText = "padding:8px 4px;color:var(--text-default,#dbdee1);font-size:14px;";

		const h = (t) => {
			const el = document.createElement("div");
			el.textContent = t;
			el.style.cssText = "font-weight:700;margin:16px 0 8px;font-size:12px;letter-spacing:.4px;text-transform:uppercase;opacity:.6;";
			return el;
		};

		// 컨트롤은 전부 커스텀(cupCheck/cupSlider/cupDrop)을 쓴다.
		// 네이티브 select 는 펼친 목록이 OS 팝업이라 테마와 절대 안 맞는다.
		const checkbox = (label, key) => this.cupCheck(label, key);
		const selectRow = (label, key, options, current) => this.cupDrop(label, key, options, current);
		const sliderRow = (label, key, min, max, step) => this.cupSlider(label, key, min, max, step);
		// 폴더 표(grid)에는 라벨 없이 드롭다운 알맹이만 넣는다
		const colorDrop = (current, key, folderId) => {
			const row = this.cupDrop("", key, COLORS.map((c) => [c, c]), current, folderId);
			const drop = row.querySelector(".cup-drop");
			drop.style.maxWidth = "100%";
			return drop;
		};

		// ── 테마 ──
		wrap.appendChild(h("테마"));
		wrap.appendChild(
			selectRow(
				"모드",
				"appearance",
				[
					["auto", "디스코드 설정 따라가기"],
					["dark", "항상 다크"],
					["light", "항상 라이트"],
				],
				this.settings.appearance,
			),
		);

		// 강조색 견본
		const accLabel = document.createElement("div");
		accLabel.textContent = "강조색";
		accLabel.style.cssText = "padding:8px 0 0;";
		wrap.appendChild(accLabel);
		const sw = document.createElement("div");
		sw.className = "cup-swatches";
		for (const [k, v] of Object.entries(ACCENTS)) {
			const b = document.createElement("button");
			b.type = "button";
			b.className = "cup-swatch";
			b.title = v.name;
			b.style.background = v.hex;
			b.dataset.cupAccent = k;
			b.dataset.cupActive = this.settings.accent === k ? "1" : "0";
			// 견본은 select 가 아니라 버튼이므로 여기서만 직접 처리한다
			b.addEventListener("click", () => {
				this.settings.accent = k;
				this.save();
				this.applyCustom();
				this.syncSwatches();
			});
			sw.appendChild(b);
		}
		wrap.appendChild(sw);

		// 직접 지정 (색상 피커)
		const hexRow = document.createElement("div");
		hexRow.style.cssText = "display:flex;align-items:center;gap:10px;padding:4px 0 8px;";
		const hexLabel = document.createElement("span");
		hexLabel.textContent = "직접 지정";
		hexLabel.style.cssText = "min-width:96px;";
		const hexIn = document.createElement("input");
		hexIn.type = "color";
		hexIn.value = this.accentHex();
		hexIn.className = "cup-color";
		hexIn.addEventListener("input", () => this.setSetting("accent", hexIn.value));
		hexRow.append(hexLabel, hexIn);
		wrap.appendChild(hexRow);

		wrap.appendChild(
			selectRow("둥글기", "radius", Object.entries(RADII).map(([k, v]) => [k, v.name]), this.settings.radius),
		);
		wrap.appendChild(sliderRow("유리 세기", "glass", 0, 150, 10, this.settings.glass ?? 100));
		wrap.appendChild(checkbox("큰 패널도 블러 (끄면 훨씬 가벼워짐)", "panelBlur"));

		// ── 폰트 ──
		wrap.appendChild(h("폰트"));
		wrap.appendChild(
			selectRow("글꼴", "font", Object.entries(FONTS).map(([k, v]) => [k, v.name]), this.settings.font),
		);
		wrap.appendChild(sliderRow("글자 크기", "fontScale", 85, 125, 5, this.settings.fontScale ?? 100));
		const fontTip = document.createElement("div");
		fontTip.textContent =
			"Noto Sans KR·Pretendard·SUIT·Spoqa 는 웹에서 자동으로 받아옵니다(실측으로 CDN 허용 확인). 인터넷이 없거나 느리면 시스템 기본을 쓰세요.";
		fontTip.style.cssText = "opacity:.55;font-size:12px;padding:4px 0 0;line-height:1.5;";
		wrap.appendChild(fontTip);

		// 폴더 아이콘
		wrap.appendChild(h("폴더 아이콘"));
		wrap.appendChild(
			checkbox("폴더를 진짜 폴더 아이콘으로 덮기 (안에 든 서버가 안 보이게)", "folderIcons"),
		);
		wrap.appendChild(checkbox("폴더에 라벨 표시 (기본은 이름에서 자동, 아래에서 직접 지정 가능)", "showLetter"));

		wrap.appendChild(checkbox("폴더마다 색을 자동으로 다르게 (아래에서 개별 변경 가능)", "autoColor"));

		wrap.appendChild(
			selectRow(
				"이름에서 자동으로 가져올 글자 수",
				"autoLabelChars",
				[1, 2, 3].map((n) => [String(n), `${n}글자`]),
				String(this.settings.autoLabelChars),
			),
		);
		wrap.appendChild(selectRow("기본 색", "defaultColor", COLORS.map((c) => [c, c]), this.settings.defaultColor));

		// 폴더별 — 라벨 + 색
		if (this.folders.size) {
			wrap.appendChild(h(`폴더별 설정 (${this.folders.size}개 감지)`));

			const head = document.createElement("div");
			head.style.cssText = "display:grid;grid-template-columns:1fr 76px 110px;gap:10px;padding:0 0 6px;opacity:.5;font-size:11px;";
			for (const t of ["폴더", "라벨", "색"]) {
				const c = document.createElement("span");
				c.textContent = t;
				head.appendChild(c);
			}
			wrap.appendChild(head);

			for (const [id, name] of this.folders) {
				const row = document.createElement("div");
				row.style.cssText = "display:grid;grid-template-columns:1fr 76px 110px;gap:10px;align-items:center;padding:5px 0;";

				const nm = document.createElement("span");
				nm.textContent = name;
				nm.title = name;
				nm.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

				// 라벨 직접 입력 (비우면 폴더 이름 첫 글자로 자동)
				const inp = document.createElement("input");
				inp.type = "text";
				inp.maxLength = 3;
				inp.value = this.settings.perFolderLabel[id] ?? "";
				inp.placeholder = this.autoLabelFor(id) || "-";
				inp.dataset.cupSetting = "perFolderLabel";
				inp.dataset.cupFolderId = id;
				inp.className = "cup-text";

				row.append(nm, inp, colorDrop(this.colorFor(id), "perFolder", id));
				wrap.appendChild(row);
			}

			const tip = document.createElement("div");
			tip.textContent = "라벨을 비우면 위에서 정한 글자 수만큼 폴더 이름에서 자동으로 가져옵니다. 직접 입력은 최대 3글자, 글자 수에 따라 크기가 자동 조절됩니다.";
			tip.style.cssText = "opacity:.55;font-size:12px;padding:8px 0 0;line-height:1.5;";
			wrap.appendChild(tip);
		} else {
			const note = document.createElement("div");
			note.textContent = "폴더가 감지되지 않았습니다. 서버 목록을 한 번 스크롤하거나 Ctrl+R 후 다시 열어보세요.";
			note.style.cssText = "opacity:.6;font-size:12px;padding:6px 0;";
			wrap.appendChild(note);
		}

		// ── DM 폴더 / 고정 ──
		wrap.appendChild(h("DM 폴더 · 고정"));
		{
			const s = this.settings;
			s.dmFolders ??= [];
			s.dmPins ??= [];
			const reg = s.dmRegistry ?? {};
			const total = Object.keys(reg).length;

			const note = document.createElement("div");
			note.style.cssText = "opacity:.6;font-size:12px;padding:0 0 8px;line-height:1.55;";
			note.textContent =
				total === 0
					? "아직 모은 대화가 없어요. DM 목록을 한 번 위아래로 스크롤하면 이름·프로필을 모아둡니다."
					: `모아둔 대화 ${total}개. DM 목록 맨 위에 폴더 칩이 생기고, 칩을 누르면 그 폴더만 보여줍니다.`;
			wrap.appendChild(note);

			// 폴더 만들기
			const addRow = document.createElement("div");
			addRow.style.cssText = "display:flex;gap:8px;padding:0 0 10px;";
			const nameIn = document.createElement("input");
			nameIn.type = "text";
			nameIn.className = "cup-text";
			nameIn.placeholder = "새 폴더 이름";
			nameIn.style.textAlign = "left";
			const addBtn = document.createElement("button");
			addBtn.type = "button";
			addBtn.className = "cup-btn";
			addBtn.textContent = "폴더 추가";
			addBtn.addEventListener("click", () => {
				const nm = nameIn.value.trim();
				if (!nm) return;
				// id 는 시간 기반이면 안 된다(재현 불가) → 이름+순번으로 안정적으로 만든다
				let base = "f" + nm.replace(/\s+/g, "").slice(0, 10);
				let uniq = base;
				let n = 2;
				while (s.dmFolders.some((f) => f.id === uniq)) uniq = base + n++;
				s.dmFolders.push({ id: uniq, name: nm, ids: [] });
				this.save();
				nameIn.value = "";
				this.renderDMBar();
				this.refreshPanel();
			});
			addRow.append(nameIn, addBtn);
			wrap.appendChild(addRow);

			// 폴더 목록 (이름 변경 / 삭제)
			for (const f of s.dmFolders) {
				const row = document.createElement("div");
				row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;";
				const nin = document.createElement("input");
				nin.type = "text";
				nin.className = "cup-text";
				nin.value = f.name;
				nin.style.textAlign = "left";
				nin.addEventListener("change", () => {
					const v = nin.value.trim();
					if (v) {
						f.name = v;
						this.save();
						this.renderDMBar();
					}
				});
				const cnt = document.createElement("span");
				cnt.textContent = `${f.ids.length}개`;
				cnt.style.cssText = "opacity:.6;font-size:12px;min-width:38px;text-align:right;";
				const del = document.createElement("button");
				del.type = "button";
				del.className = "cup-btn cup-btn-ghost";
				del.textContent = "삭제";
				del.addEventListener("click", () => {
					s.dmFolders = s.dmFolders.filter((x) => x.id !== f.id);
					if (s.dmActive === f.id) s.dmActive = null;
					this.save();
					this.renderDMBar();
					this.refreshPanel();
				});
				row.append(nin, cnt, del);
				wrap.appendChild(row);
			}

			// DM 배정 표 (검색 + 고정 + 폴더)
			if (total) {
				const search = document.createElement("input");
				search.type = "text";
				search.className = "cup-dm-search";
				search.placeholder = `대화 검색 (${total}개)`;
				wrap.appendChild(search);

				const head = document.createElement("div");
				head.className = "cup-dmrow";
				head.style.cssText += "opacity:.5;font-size:11px;padding-bottom:4px;";
				for (const t of ["대화", "고정", "폴더"]) {
					const c = document.createElement("span");
					c.textContent = t;
					head.appendChild(c);
				}
				wrap.appendChild(head);

				const body = document.createElement("div");
				body.style.cssText = "max-height:280px;overflow-y:auto;";
				wrap.appendChild(body);

				const folderOpts = [["", "없음"], ...s.dmFolders.map((f) => [f.id, f.name])];
				const draw = (q) => {
					body.textContent = "";
					const entries = Object.entries(reg)
						.filter(([, v]) => !q || v.name.toLowerCase().includes(q.toLowerCase()))
						.sort((a, b) => a[1].name.localeCompare(b[1].name))
						.slice(0, 60);
					if (!entries.length) {
						const e = document.createElement("div");
						e.className = "cup-dm-hint";
						e.style.padding = "8px 0";
						e.textContent = "검색 결과가 없어요";
						body.appendChild(e);
						return;
					}
					for (const [dmId, info] of entries) {
						const r = document.createElement("div");
						r.className = "cup-dmrow";
						const nm = document.createElement("span");
						nm.textContent = info.name;
						nm.title = info.name;

						const pinWrap = document.createElement("label");
						pinWrap.style.cssText = "display:flex;justify-content:center;cursor:pointer;";
						const pin = document.createElement("input");
						pin.type = "checkbox";
						pin.className = "cup-check";
						pin.checked = s.dmPins.includes(dmId);
						pin.addEventListener("change", () => {
							if (pin.checked) {
								if (!s.dmPins.includes(dmId)) s.dmPins.push(dmId);
							} else {
								s.dmPins = s.dmPins.filter((x) => x !== dmId);
								if (s.dmActive === "pins" && !s.dmPins.length) s.dmActive = null;
							}
							this.save();
							this.renderDMBar();
						});
						pinWrap.appendChild(pin);

						const cur = (s.dmFolders.find((f) => f.ids.includes(dmId)) ?? { id: "" }).id;
						const drop = this.cupDrop("", "__dmFolder", folderOpts, cur, dmId).querySelector(".cup-drop");
						drop.style.maxWidth = "100%";
						// __dmFolder 는 setSetting 이 모르는 키다 → 옵션 클릭을 여기서 직접 잡는다
						for (const opt of drop.querySelectorAll(".cup-drop-opt")) {
							opt.addEventListener("click", () => {
								const picked = folderOpts.find(([, name]) => name === opt.textContent)?.[0] ?? "";
								for (const f of s.dmFolders) f.ids = f.ids.filter((x) => x !== dmId);
								if (picked) {
									const f = s.dmFolders.find((x) => x.id === picked);
									if (f && !f.ids.includes(dmId)) f.ids.push(dmId);
								}
								this.save();
								this.renderDMBar();
							});
						}

						r.append(nm, pinWrap, drop);
						body.appendChild(r);
					}
					if (Object.keys(reg).length > entries.length && !q) {
						const more = document.createElement("div");
						more.className = "cup-dm-hint";
						more.style.padding = "8px 0";
						more.textContent = `앞 60개만 표시했어요. 검색으로 찾아주세요.`;
						body.appendChild(more);
					}
				};
				draw("");
				search.addEventListener("input", () => draw(search.value));
			}
		}

		// 프라이버시
		wrap.appendChild(h("프라이버시"));
		wrap.appendChild(checkbox("DM 목록 블러 처리", "blurDMs"));
		wrap.appendChild(checkbox("마우스 올리면 잠깐 보이기", "blurDMsRevealOnHover"));

		// 레이아웃
		wrap.appendChild(h("레이아웃"));
		wrap.appendChild(checkbox('"현재 활동 중" 패널 접기', "hideActivity"));

		return wrap;
	}
};
