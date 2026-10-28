# WonderWorld launcher: serves WonderWorld2.html to this computer only, so videos can play inside the game.
$dir = $env:WW_DIR
$port = 8777
$base = "http://localhost:$port/"
$page = $base + "WonderWorld2.html"
$file = Join-Path $dir "WonderWorld2.html"
function Open-Game {
  try { Start-Process "msedge" $page -ErrorAction Stop }
  catch { try { Start-Process $page -ErrorAction Stop } catch { Write-Host "  Open this address in your browser: $page" } }
}
if (-not (Test-Path -LiteralPath $file)) { Write-Host "  WonderWorld2.html is not in this folder: $dir"; Start-Sleep -Seconds 8; exit }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($base)
try { $listener.Start() } catch { Open-Game; exit }
Write-Host ""
Write-Host "  WonderWorld is running."
Write-Host "  Keep this window open while playing. Close it when you have finished."
Write-Host ""
Open-Game
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = $ctx.Request.Url.AbsolutePath.TrimStart('/')
    if ($rel -eq "" -or $rel -eq "WonderWorld2.html") {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentType = "text/html; charset=utf-8"
      $ctx.Response.Headers.Add("Cache-Control", "no-cache")
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $ctx.Response.StatusCode = 404 }
    $ctx.Response.Close()
  } catch { }
}
