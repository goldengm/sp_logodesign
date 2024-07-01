<?php
namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Models\Frame; // Ensure you create a corresponding Eloquent model for frames.
use Illuminate\Routing\Controller as BaseController;

class FrameController extends BaseController
{
    public function getAll(Request $request)
    {
        $frames = Frame::all();
        return response()->json($frames);
    }
    
}
