<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_fonts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFontsTable extends Migration
{
    public function up()
    {
        Schema::create('fonts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('urls'); // this will store the JSON data for styles and urls
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fonts');
    }
}

