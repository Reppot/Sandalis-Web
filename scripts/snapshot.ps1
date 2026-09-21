# scripts/snapshot.ps1 — пересобирает SNAP_*.md из текущего кода
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$MAX   = 25                      # КБ: файлы больше — обрезаются до 40 строк
$F     = '```'
$rel   = { $_.FullName.Replace("$PWD\","") }
$commit = (git rev-parse --short HEAD 2>$null)
$icons  = (Get-ChildItem public\FoxholeWikiPhotos -File).Count
$tree   = (Get-ChildItem -Recurse -File |
  ? { $_.FullName -notmatch '\\(node_modules|\.next|\.git)\\' -and $_.Extension -notmatch '^\.(png|jpg|jpeg|webp|gif|jfif|mp4|h5|txt|md)$' } |
  % $rel) -join "`n"

$hdr = @"
# SIND-site — снимок проекта (GitHub main $commit, сгенерирован $(Get-Date -Format 'yyyy-MM-dd HH:mm'))
ВАЖНО: Next.js 16.2.6 (App Router, Turbopack) + React 19 + Drizzle ORM + PostgreSQL + Tailwind 4.
src/proxy.ts — это middleware Next 16. НЕ Vite, НЕ переписывать структуру. Запуск: npm run dev -> localhost:3000
Иконок в public/FoxholeWikiPhotos: $icons

## Дерево проекта
$F
$tree
$F
"@

function Dump($files, $out, $title) {
  "$hdr`n`n## $title`n" | Out-File $out -Encoding utf8
  foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    $kb = [math]::Round((Get-Item $f).Length/1KB)
    if ($kb -gt $MAX) {
      "`n## $f  ($kb КБ — файл данных, показаны первые 40 строк)`n$F" | Add-Content $out
      Get-Content $f -TotalCount 40 | Add-Content $out
      "... (обрезано)`n$F" | Add-Content $out
    } else {
      "`n## $f`n$F" | Add-Content $out
      Get-Content $f -Raw | Add-Content $out
      "$F" | Add-Content $out
    }
  }
  Write-Host "$out : $([math]::Round((Get-Item $out).Length/1KB)) КБ"
}

$p1 = @("package.json","tsconfig.json","next.config.ts","drizzle.config.ts","postcss.config.mjs",".env.example","data\README.md","src\proxy.ts","src\app\layout.tsx","src\app\page.tsx","src\app\globals.css") + @(Get-ChildItem src\db,src\lib -Recurse -File | % $rel)
$p2 = @(Get-ChildItem src\app\api,scripts -Recurse -File -Exclude snapshot.ps1 | % $rel) + @(Get-ChildItem src\app -Recurse -Filter page.tsx | % $rel)
$p3 = @(Get-ChildItem src\components\shell,src\components\providers,src\components\ui,src\components\cabinet,src\components\training -Recurse -File | % $rel)
$p4 = @(Get-ChildItem src\components\orders,src\components\codes,src\components\timers,src\components\tools -Recurse -File | % $rel)

Dump $p1 "SNAP_1_core.md"       "Часть 1/4: конфиги, БД, lib"
Dump $p2 "SNAP_2_app.md"        "Часть 2/4: API, страницы, скрипты"
Dump $p3 "SNAP_3_shell.md"      "Часть 3/4: shell, providers, ui, cabinet, training"
Dump $p4 "SNAP_4_workspaces.md" "Часть 4/4: orders, codes, timers, tools"