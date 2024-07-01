<?php

// app/Models/TextModel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Text extends Model
{
    protected $table = 'texts';

    protected $fillable = [
        'img',
        'data'
    ];
}
