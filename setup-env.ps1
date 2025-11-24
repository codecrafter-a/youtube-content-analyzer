# PowerShell script to create .env.local file
# Run this script: .\setup-env.ps1

Write-Host "Setting up .env.local file..." -ForegroundColor Green

$envFile = ".env.local"

# Check if file already exists
if (Test-Path $envFile) {
    Write-Host "Warning: .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
}

# Get API keys from user
Write-Host "`nEnter your API keys (press Enter to skip optional keys):" -ForegroundColor Cyan

$youtubeKey = Read-Host "YOUTUBE_API_KEY"
$openaiKey = Read-Host "OPENAI_API_KEY"
$newsKey = Read-Host "NEWS_API_KEY (optional, press Enter to skip)"

# Create the file content
$content = @"
# YouTube Data API v3 Key
YOUTUBE_API_KEY=$youtubeKey

# OpenAI API Key
OPENAI_API_KEY=$openaiKey

# NewsAPI Key (Optional)
NEWS_API_KEY=$newsKey
"@

# Write to file
$content | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host "`n✓ .env.local file created successfully!" -ForegroundColor Green
Write-Host "`nIMPORTANT: Restart your dev server for changes to take effect:" -ForegroundColor Yellow
Write-Host "  1. Stop the server (Ctrl+C)" -ForegroundColor Yellow
Write-Host "  2. Run: npm run dev" -ForegroundColor Yellow

