# Script para ejecutar migracion de imagenes en Render
# Uso: Actualiza el token y ejecuta este script despues de hacer deploy

$token = "fcca09dca4e98ae50296006f7e6ce91feb255b9cc2dca2e01db0d4f3cfb12b56"
$url = "https://citysoccer.onrender.com/api/migrate-images"

Write-Host "Iniciando migracion de imagenes en Render..." -ForegroundColor Yellow
Write-Host "ADVERTENCIA: Este proceso puede tardar varios minutos dependiendo del numero de imagenes" -ForegroundColor Yellow
Write-Host ""

$body = @{
    token = $token
} | ConvertTo-Json

try {
    Write-Host "Enviando solicitud (esto puede tardar...)..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 600
    
    Write-Host ""
    Write-Host "Migracion completada:" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resumen:" -ForegroundColor Cyan
    Write-Host "   Total procesados: $($response.summary.total)"
    Write-Host "   Exitosos: $($response.summary.exitosos)" -ForegroundColor Green
    Write-Host "   Errores: $($response.summary.errores)" -ForegroundColor Red
    Write-Host "   Omitidos (no imagenes): $($response.summary.omitidos)" -ForegroundColor Yellow
    Write-Host "   Tamano total: $($response.summary.totalSizeMB) MB" -ForegroundColor Cyan
    Write-Host ""
    
    if ($response.results -and $response.results.Count -gt 0) {
        Write-Host "Primeros resultados (mostrando max 50):" -ForegroundColor Cyan
        $count = 0
        foreach ($result in $response.results) {
            $count++
            if ($count -gt 20) {
                Write-Host "   ... y $($response.results.Count - 20) mas" -ForegroundColor Gray
                break
            }
            if ($result.success) {
                Write-Host "   OK $($result.file) ($([math]::Round($result.size/1024, 2)) KB)" -ForegroundColor Green
            } else {
                Write-Host "   ERROR $($result.file) -> $($result.error)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    Write-Host $response.message -ForegroundColor Green
    
}
catch {
    Write-Host ""
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
Write-Host "Recuerda: Despues de migrar, elimina el endpoint /api/migrate-images" -ForegroundColor Yellow
