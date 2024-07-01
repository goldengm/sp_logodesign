<?php

namespace App\Http\Controllers\api\v1\admin;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\Template;

class TemplateController extends BaseController
{
    public function getTemplates(Request $request) {
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

    public function saveTemplate(Request $request){
        if($request->file('file') != null){
            $thumbnail_path = $request->file('file')->store('public/thumbnail');
            $thumbnail_path = str_replace('public',"/storage", $thumbnail_path);
        }
        else{
            $thumbnail_path = "";
        }
        
        try{
            if($request->id == -1){
                $template = new Template([
                    'name'=>$request->templateName, 
                    'data' =>$request->data,
                    'img' =>$thumbnail_path, 
                    'description' => $request->description,
                    'category' => $request->category,
                    'keywords' => $request->keywords,
                ]);
                $template->save();
            }
            else{
                $template = Template::findorFail($request->id);
                $template->name = $request->templateName;
                $template->img = $thumbnail_path;
                $template->data = $request->data;
                $template->description = $request->description;
                $template->category = $request->category;
                $template->keywords = $request->keywords;
                $template->save();
            }    
            $responseMessage = "Saved Template!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Saving Template!";
        }
        
        return response()->json([
            'success' => true,
            'template_id' => $template->id,
            'message' => $responseMessage
        ], 200);
    }

    public function deleteTemplate(Request $request){

        try{
            $template = Template::findorFail($request->id);
            $template->delete();
            $responseMessage = "Deleted Template!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Changing Template!";
        }
        
        return response()->json([
            'success' => true,
            'template_id' => $template->id,
            'message' => $responseMessage
        ], 200);
    }
}

