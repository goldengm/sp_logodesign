<?php

// app/Models/TemplateModel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Template extends Model
{
    protected $table = 'templates';

    protected $fillable = [
        'name',
        'img',
        'data'
    ];

    protected $hidden = ['created_at','updated_at'];
    protected $appends = ['layer_size'];

    protected function layerSize(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes){
               $data = json_decode($attributes['data']); 
               $boxSize = $data->layers->ROOT->props->boxSize;
               $width = $boxSize->width;
               $height = $boxSize->height;
               return $width. "px X ". $height. "px";
            },
        );
    }

}
