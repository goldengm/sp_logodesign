<?php

// app/Http/Controllers/ImageController.php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Models\Image; // Ensure a corresponding Eloquent model for images is created.
use Illuminate\Routing\Controller as BaseController;

class ImageController extends BaseController
{
    public function getAll(Request $request)
    {
        $images = Image::limit(120)->get();
        return response()->json($images);
    }
}

