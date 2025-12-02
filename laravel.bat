@echo off
echo Clearing Laravel caches...

cd /d "%~dp0"

php artisan route:clear
php artisan config:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear
php artisan route:cache
REM composer dump-autoload
php artisan wayfinder:generate --with-form

npm run build
composer run dev

echo.
echo All Artisan commands executed successfully!

