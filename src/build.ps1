# CupertinoExtras 빌드 스크립트
#
# 하는 일:
#   1. macOS 스타일 폴더 아이콘 SVG 를 9색 x (닫힘/열림) = 18개 생성
#   2. 그걸 base64 data URI 맵으로 만들어 템플릿의 /*__ICONS__*/ {} 자리에 심는다
#   3. dist/CupertinoExtras.plugin.js 로 출력
#
# 왜 data URI 인가:
#   file:// 은 Chromium 이 https 페이지에서 원천 차단한다. 로컬 PNG/SVG 를 그냥
#   참조할 수 없어서, 빌드 시점에 아이콘을 통째로 파일 안에 박아 넣는다.
#   덕분에 배포물이 .plugin.js 한 장으로 끝난다.
#
# 사용법:
#   pwsh src/build.ps1              # dist 에만 빌드
#   pwsh src/build.ps1 -Install     # 빌드 후 BetterDiscord 플러그인 폴더에 설치

param(
	[switch]$Install
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$template = Join-Path $PSScriptRoot 'CupertinoExtras.template.js'
$distDir = Join-Path $root 'dist'
$svgDir = Join-Path $root 'build/icons'

foreach ($d in @($distDir, $svgDir)) {
	if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force $d | Out-Null }
}

# 색: 이름 = 뒤판(진한) 위/아래, 앞판(밝은) 위/아래
$palette = [ordered]@{
	blue   = @('#2f7fd6', '#1f66bd', '#5aa8f2', '#2f86e4')
	red    = @('#cf3f36', '#b8332b', '#f2665b', '#dd4a40')
	orange = @('#d97d1e', '#c06a16', '#f7a447', '#e88c2c')
	yellow = @('#d0a616', '#b89111', '#f5cd45', '#e5ba2c')
	green  = @('#2b9152', '#227f45', '#4cbe75', '#33a75e')
	teal   = @('#178a95', '#127680', '#31b3bf', '#219fac')
	purple = @('#7345c9', '#633ab3', '#9a6ce8', '#8153d8')
	pink   = @('#c93a83', '#b23174', '#ef67a6', '#dc5093')
	gray   = @('#71767e', '#62676f', '#949aa3', '#828892')
}

function New-FolderSvg {
	param([string]$BackTop, [string]$BackBot, [string]$FrontTop, [string]$FrontBot, [switch]$Open)

	# 뒤판: 왼쪽 위에 탭이 솟은 폴더 뒷면
	$back = 'M3 13.2A3.6 3.6 0 0 1 6.6 9.6h10.9a3.6 3.6 0 0 1 2.66 1.17l2.3 2.53H41.4A3.6 3.6 0 0 1 45 16.9v19.5a3.6 3.6 0 0 1-3.6 3.6H6.6A3.6 3.6 0 0 1 3 36.4V13.2Z'

	if ($Open) {
		# 앞판이 앞으로 기울어 위쪽이 더 넓은 사다리꼴 = 열린 폴더
		$front = 'M5.1 21.3a2.6 2.6 0 0 1 2.6-2.9h32.6a2.6 2.6 0 0 1 2.6 2.9l-2.1 15.6a3.4 3.4 0 0 1-3.4 3H10.6a3.4 3.4 0 0 1-3.4-3L5.1 21.3Z'
		$lip = 'M7.7 18.4h32.6a2.6 2.6 0 0 1 2.6 2.9l-.1.7H5.2l-.1-.7a2.6 2.6 0 0 1 2.6-2.9Z'
	} else {
		$front = 'M3 20.1a3.6 3.6 0 0 1 3.6-3.6h34.8a3.6 3.6 0 0 1 3.6 3.6v16.3a3.6 3.6 0 0 1-3.6 3.6H6.6A3.6 3.6 0 0 1 3 36.4V20.1Z'
		$lip = 'M6.6 16.5h34.8a3.6 3.6 0 0 1 3.6 3.6v.8H3v-.8a3.6 3.6 0 0 1 3.6-3.6Z'
	}

	@"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
<defs>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="$BackTop"/><stop offset="1" stop-color="$BackBot"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="$FrontTop"/><stop offset="1" stop-color="$FrontBot"/></linearGradient>
</defs>
<path d="$back" fill="url(#b)"/>
<path d="$front" fill="url(#f)"/>
<path d="$lip" fill="#ffffff" fill-opacity="0.22"/>
</svg>
"@
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$parts = New-Object System.Collections.Generic.List[string]

foreach ($name in $palette.Keys) {
	$c = $palette[$name]
	$closed = New-FolderSvg -BackTop $c[0] -BackBot $c[1] -FrontTop $c[2] -FrontBot $c[3]
	$open = New-FolderSvg -BackTop $c[0] -BackBot $c[1] -FrontTop $c[2] -FrontBot $c[3] -Open

	[System.IO.File]::WriteAllText((Join-Path $svgDir "folder-$name-closed.svg"), $closed, $utf8NoBom)
	[System.IO.File]::WriteAllText((Join-Path $svgDir "folder-$name-open.svg"), $open, $utf8NoBom)

	$b64c = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($closed))
	$b64o = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($open))
	$parts.Add('"' + $name + '":{"c":"data:image/svg+xml;base64,' + $b64c + '","o":"data:image/svg+xml;base64,' + $b64o + '"}')
}

$map = '{' + [string]::Join(',', $parts) + '}'
Write-Output ("아이콘 {0}색, 맵 {1} KB" -f $parts.Count, [math]::Round($map.Length / 1024, 1))

$tpl = [System.IO.File]::ReadAllText($template)
$out = $tpl.Replace('/*__ICONS__*/ {}', $map)
if ($out -eq $tpl) { throw "플레이스홀더 '/*__ICONS__*/ {}' 를 찾지 못했습니다 — 템플릿을 확인하세요." }

$distFile = Join-Path $distDir 'CupertinoExtras.plugin.js'
[System.IO.File]::WriteAllText($distFile, $out, $utf8NoBom)
Write-Output ("빌드 완료: dist/CupertinoExtras.plugin.js ({0} KB)" -f [math]::Round((Get-Item $distFile).Length / 1024, 1))

if ($Install) {
	$pluginDir = Join-Path $env:APPDATA 'BetterDiscord/plugins'
	if (-not (Test-Path $pluginDir)) { throw "BetterDiscord 플러그인 폴더를 찾을 수 없습니다: $pluginDir" }
	Copy-Item $distFile (Join-Path $pluginDir 'CupertinoExtras.plugin.js') -Force
	Write-Output "설치 완료: $pluginDir"
}
