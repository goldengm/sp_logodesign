<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Template;

class TemplateController extends BaseController
{
    //
    public function getAll(Request $request)
    {
        $template = Template::limit(120)->get();
        return response()->json($template);
    }

    public function getTemplateList(Request $request){
        // $templates = Template::limit(120)->get();//->makeHidden('data');
        // $responseMessage = "Templates Loaded!";

        // return response()->json([
        //     'success' => true,
        //     'message' => $responseMessage,
        //     "templates" => $templates
        // ], 200);
        $pageNum = $request->get("current", 1);
        $pageSize = $request->get("pageSize", 50);
        $search = $request->get("search", "");
        $data = Template::whereNot("id", null);
        if($search != "") {
            $data = $data->where("name","like", "%$search%");
        }
        $total = $data->count();
        $data = $data->skip(($pageNum - 1) * $pageSize)->limit($pageSize)->get();

        $res = [];
        foreach($data as $item) {
            $res[] = [
                "id" => $item["id"],
                "img" => $item["img"],
                "layer_size" => $item["layer_size"],
                "name" => $item["name"],
                "description" => $item["description"],
                "keywords" => $item["keywords"],
                "category" => $item["category"],
            ];
        }

        return response()->json([
            "success" => true,
            "data" => $res,
            "total" => $total
            ],200);
    }

    public function getTemplateDetail($id){
        $data = Template::find($id);
        if($data == null)
            return response()->json([
                "success" => false,
                "message" => "Template does not exist."
                ],200);
        return  response()->json([
            "success" => true,
            "data" => $data,
            ],200);
    }
}


