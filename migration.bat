REM comment with REM
powershell -Command "(Get-Content .env) -replace '^DB_DATABASE=.*', 'DB_DATABASE=apple_land_031' | Set-Content .env"
php artisan migrate
php artisan db:seed

