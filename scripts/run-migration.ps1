# Script para ejecutar migracion en Render
# Uso: Actualiza el token y ejecuta este script despues de hacer deploy

$token = "fcca09dca4e98ae50296006f7e6ce91feb255b9cc2dca2e01db0d4f3cfb12b56"
$url = "https://citysoccer.onrender.com/api/migrate-content"

Write-Host "Iniciando migracion de contenido en Render..." -ForegroundColor Yellow
Write-Host ""

$body = @{
    token = $token
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "Migracion completada:" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resumen:" -ForegroundColor Cyan
    Write-Host "   Total: $($response.summary.total)"
    Write-Host "   Exitosos: $($response.summary.exitosos)" -ForegroundColor Green
    Write-Host "   Errores: $($response.summary.errores)" -ForegroundColor Red
    Write-Host ""
    
    if ($response.results) {
        Write-Host "Detalles:" -ForegroundColor Cyan
        foreach ($result in $response.results) {
            if ($result.success) {
                Write-Host "   OK $($result.pageKey) -> $($result.url)" -ForegroundColor Green
            } else {
                Write-Host "   ERROR $($result.pageKey) -> $($result.error)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    Write-Host $response.message -ForegroundColor Green
    
}
catch {
    Write-Host "Error ejecutando migracion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $responseBody = $reader.ReadToEnd()
            Write-Host "Detalles: $responseBody" -ForegroundColor Red
        }
        catch {
            Write-Host "No se pudo leer la respuesta de error" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Recuerda: Despues de migrar, elimina el endpoint /api/migrate-content" -ForegroundColor Yellow
