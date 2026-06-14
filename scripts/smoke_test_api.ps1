# Smoke test: verify all API routes are accessible
# Run: powershell -File scripts/smoke_test_api.ps1

param([string]$BaseUrl = "http://localhost:3000")

$tests = @(
  @{ Name="health"; Method="GET"; Url="$BaseUrl/api/health" },
  @{ Name="reviews"; Method="GET"; Url="$BaseUrl/api/reviews?productId=1" },
  @{ Name="ai-chat"; Method="POST"; Url="$BaseUrl/api/ai-chat"; Body='{"message":"test","history":[],"locale":"en"}' },
  @{ Name="search"; Method="GET"; Url="$BaseUrl/api/search?q=test" },
  @{ Name="exchange-rates"; Method="GET"; Url="$BaseUrl/api/exchange-rates" }
)

$failed = 0
$pass = [char]0x2705
$fail = [char]0x274C

foreach ($t in $tests) {
  try {
    $params = @{ Uri=$t.Url; Method=$t.Method; UseBasicParsing=$true; TimeoutSec=10 }
    if ($t.Body) { $params.Body=$t.Body; $params.ContentType="application/json" }
    $r = Invoke-WebRequest @params
    $ok = ($r.StatusCode -eq 200)
    $mark = if ($ok) { $pass } else { $fail }
    Write-Host "$($t.Name): $($r.StatusCode) $mark"
    if (-not $ok) { $failed++ }
  } catch {
    Write-Host "$($t.Name): FAIL $fail ($($_.Exception.Message))"
    $failed++
  }
}

if ($failed -eq 0) {
  Write-Host "`nALL PASS $pass"
} else {
  Write-Host "`n$failed FAILURES $fail"
}
exit $failed
