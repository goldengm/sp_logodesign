<?php

// app/Http/Controllers/FontController.php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Models\Font; // You'll need to create a corresponding Eloquent model for fonts.
use Illuminate\Routing\Controller as BaseController;

class FontController extends BaseController
{
    public function getAll(Request $request)
    {
        $fontList = $request->input('name');
        $q = $request->input('q');

        $where = [];
        if (is_array($fontList) || is_string($fontList)) {
            $where[] = ['name', 'in', is_array($fontList) ? $fontList : [$fontList]];
        }
        if (is_string($q)) {
            $where[] = ['name', 'like', $q . '%'];
        }

        $limit = intval($request->input('limit', 1));
        $offset = intval($request->input('offset', 0));

        $fonts = Font::where($where)->limit($limit)->offset($offset)->get();

        return response()->json($fonts);
    }
}
