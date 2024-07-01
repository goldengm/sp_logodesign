<?php

// app/Models/TemplateModel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Design extends Model
{
    protected $fillable = [
        'name',
        'data',
        'thumbnail'
    ];
    protected $hidden = ['created_at','updated_at'];
    protected $appends = ['layer_size'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function layerSize(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes){
               $data = json_decode($attributes['data']); 
               $boxSize = $data[0]->layers->ROOT->props->boxSize;
               $width = $boxSize->width;
               $height = $boxSize->height;
               return $width. "px X ". $height. "px";
            },
        );
    }
    
}
