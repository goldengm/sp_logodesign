<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_frames_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFramesTable extends Migration
{
    public function up()
    {
        Schema::create('frames', function (Blueprint $table) {
            $table->id();
            $table->string('clipPath');
            $table->string('img')->nullable();
            $table->string('description')->nullable();
            $table->integer('width');
            $table->integer('height');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('frames');
    }
}
