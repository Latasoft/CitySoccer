# Script para ejecutar migración en Render
# Uso: Actualiza el token y ejecuta este script después de hacer deploy

$token = "MiTokenSecreto123XYZ"  # ⚠️ CAMBIAR por tu MIGRATION_TOKEN de Render
$url = "https://citysoccer.onrender.com/api/migrate-content"

Write-Host "🚀 Iniciando migración de contenido en Render..." -ForegroundColor Yellow
Write-Host ""

$body = @{
    token = $token
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Migración completada:" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Resumen:" -ForegroundColor Cyan
    Write-Host "   Total: $($response.summary.total)"
    Write-Host "   Exitosos: $($response.summary.exitosos)" -ForegroundColor Green
    Write-Host "   Errores: $($response.summary.errores)" -ForegroundColor $(if ($response.summary.errores -gt 0) { "Red" } else { "Green" })
    Write-Host ""
    
    if ($response.results) {
        Write-Host "📝 Detalles:" -ForegroundColor Cyan
        foreach ($result in $response.results) {
            if ($result.success) {
                Write-Host "   ✅ $($result.pageKey) -> $($result.url)" -ForegroundColor Green
            } else {
                Write-Host "   ❌ $($result.pageKey) -> $($result.error)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    Write-Host $response.message -ForegroundColor $(if ($response.success) { "Green" } else { "Yellow" })
    
} catch {
    Write-Host "❌ Error ejecutando migración:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "Detalles: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "💡 Recuerda: Después de migrar, elimina el endpoint /api/migrate-content" -ForegroundColor Yellow
