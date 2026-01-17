# ============================================================================
# TEST FULL API GATEWAY FLOW - Complete End-to-End Test
# ============================================================================

Write-Host "=== API Gateway - Complete Test ===" -ForegroundColor Cyan

# Kill old processes
Write-Host "`n[1/5] Killing old Node processes..." -ForegroundColor Yellow
$processes = Get-Process node -ErrorAction SilentlyContinue
if ($processes) {
  $processes | Stop-Process -Force
  Write-Host "✓ Killed old Node processes" -ForegroundColor Green
  Start-Sleep -Seconds 2
} else {
  Write-Host "✓ No old Node processes found" -ForegroundColor Green
}

# Start services
Write-Host "`n[2/5] Starting services in background..." -ForegroundColor Yellow

Write-Host "  → Starting Attendance Service (port 3001)..."
$attJob = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" `
  -WorkingDirectory "D:\Programacion Distribuida\attendance-platform\apps\attendance-service" `
  -NoNewWindow -PassThru

Write-Host "  → Starting Auth Service (port 3003)..."
$authJob = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" `
  -WorkingDirectory "D:\Programacion Distribuida\attendance-platform\apps\auth-service" `
  -NoNewWindow -PassThru

Write-Host "  → Starting API Gateway (port 3002)..."
$gwJob = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" `
  -WorkingDirectory "D:\Programacion Distribuida\attendance-platform\apps\api-gateway" `
  -NoNewWindow -PassThru

Write-Host "✓ Services started (PIDs: $($attJob.Id), $($authJob.Id), $($gwJob.Id))" -ForegroundColor Green

# Wait for services to be ready
Write-Host "`n[3/5] Waiting for services to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test login
Write-Host "`n[4/5] Testing login..." -ForegroundColor Yellow
try {
  $loginResp = Invoke-WebRequest -Uri "http://localhost:3002/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"student@test.com","password":"123456"}' `
    -ErrorAction Stop

  $json = $loginResp.Content | ConvertFrom-Json
  $token = $json.access_token

  if ($token) {
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 30))..." -ForegroundColor Green
  } else {
    Write-Host "✗ Login failed: No token in response" -ForegroundColor Red
    exit 1
  }
} catch {
  Write-Host "✗ Login failed: $_" -ForegroundColor Red
  exit 1
}

# Test attendance endpoint
Write-Host "`n[5/5] Testing GET /attendance endpoint..." -ForegroundColor Yellow
try {
  $response = Invoke-WebRequest -Uri "http://localhost:3002/attendance" `
    -Headers @{"Authorization" = "Bearer $token"} `
    -ErrorAction Stop

  $data = $response.Content | ConvertFrom-Json
  Write-Host "✓ GET /attendance successful!" -ForegroundColor Green
  Write-Host "  Response: $($data | ConvertTo-Json)" -ForegroundColor Green

  Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green
} catch {
  Write-Host "✗ GET /attendance failed: $_" -ForegroundColor Red
  exit 1
}

# Cleanup
Write-Host "`nCleaning up processes..." -ForegroundColor Yellow
Get-Process -Id $attJob.Id, $authJob.Id, $gwJob.Id -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✓ Done" -ForegroundColor Green
