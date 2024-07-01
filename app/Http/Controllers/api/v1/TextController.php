<?php

// app/Http/Controllers/TextController.php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Models\Text; // Ensure you create a corresponding Eloquent model for texts.
use Illuminate\Routing\Controller as BaseController;

class TextController extends BaseController
{
    public function getAll(Request $request)
    {
        $texts = Text::all();
        return response()->json($texts);
    }
}
