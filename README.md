# Inventory and sales web app

## Documentation
All project diagrams are stored in the `documentation/` directory.

This folder contains:

`.puml` files — source diagrams written in PlantUML.
`.png` files — generated images from the .puml sources for quick viewing.

### 📘about PlantUML

`PlantUML` is an open-source tool that allows you to create UML and other types of diagrams from plain text descriptions.
It supports multiple diagram types such as:

- Class Diagrams
- Sequence Diagrams
- Use Case Diagrams
- Activity Diagrams
- Component Diagrams

You can find the complete official documentation here: https://plantuml.com/documentation

PlantUML can be run from the command line, integrated into VS Code or used online here: https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000

### 🔧 how to update diagrams

Edit the corresponding `.puml` file in the `documentation/` folder.

Generate the updated `.png` file by running PlantUML (you could use vscode extension).
Commit both the updated `.puml` and `.png` files.

## Setup
1) install xampp
2) `npm install`
3) `composer install`
4) `npm run build`
5) `composer run dev`


## Database
The migration feature was used to define the database tables. You can find these in the database directory.
There is also an .excalidraw file included — you can open it on Excalidraw https://excalidraw.com/
by uploading the .excalidraw extension.

You can create a new database and apply migration with following command:

`php artisan migrate`

This command take the database name from  `DB_DATABASE=my_database` set in `.env` file. If the database `my_database` does not exist in phpMyAdmin, the command will create it along with all tables.

To populate the tables with initial data, you can run the seeders using:

`php artisan db:seed`

This command executes the `DatabaseSeeder` class located in the `database/seeders` directory.
The `run()` method in this class calls all the individual seeder classes defined there.

If there is a problem, rollback is available for laravel migration.

`php artisan migrate:rollback`

If there is a problem with seeders, is not possible rollback data, instead refresh or reset the entire database.
If you’re just testing or developing, the easiest way is to drop all tables and re-run migrations and seeders:

`php artisan migrate:fresh --seed`

This:

1. Drops all tables.
2. Runs all migrations from scratch.
3. Reseeds the database using DatabaseSeeder.


## setup sail (docker environment)
https://laravel.com/docs/12.x/sail

## setup xdebug (local xampp environment)
1) https://xdebug.org/wizard add php_xdebug.dll
2) php.ini add:

```
[xdebug]
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_port=9003
xdebug.client_host=127.0.0.1
```
3) install https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug

4) run `php artisan serve` and run debug left panel "Xdebug Local"


## Clear commands
php artisan cache:clear
php artisan config:clear
php artisan event:clear
php artisan optimize:clear
php artisan queue:clear
php artisan route:cache
php artisan route:clear
php artisan view:clear

## Run db migrations, seeds, clear commands, and run development at once.
`composer clear:dev`
`composer db:seed:clear:dev`