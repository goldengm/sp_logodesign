<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Font extends Model
{
    protected $table = 'fonts';

    protected $fillable = [
        'name',
        'urls'
    ];

    protected $hidden = ['created_at','updated_at'];

    // If you want to work with the urls attribute as an array
    protected $casts = [
        'fonts' => 'array',
    ];
    /*protected $appends = ['font_urls'];

    protected function fontUrls(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes){
               $data = json_decode($attributes['urls']); 
               dd($data);
               return $data;
            },
        );
    }*/
}