      <?php

        use Illuminate\Database\Migrations\Migration;
        use Illuminate\Database\Schema\Blueprint;
        use Illuminate\Support\Facades\Schema;

        return new class extends Migration
        {
            /**
             * Run the migrations.
             */
            public function up(): void
            {
                Schema::create('user', function (Blueprint $table) {
                    $table->id();
                    $table->string('name', 50);
                    $table->string('last_name', 50)->nullable();
                    $table->string('username', 50)->unique()->nullable();
                    $table->string('password', 255);
                    $table->string('email', 100)->unique();
                    $table->string('identification', 12)->nullable();
                    $table->string('phone_number', 20)->nullable();
                    $table->string('remember_token', 100)->nullable();
                    $table->boolean('is_active')->default(true);
                    $table->timestamps();
                });
            }

            /**
             * Reverse the migrations.
             */
            public function down(): void
            {
                Schema::dropIfExists('user');
            }
        };
