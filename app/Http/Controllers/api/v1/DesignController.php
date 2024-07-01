<?php
namespace App\Http\Controllers\api\v1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Design;

class DesignController extends BaseController
{

    public function saveDesign(Request $request){
        if($request->file('file') != null){
            $thumbnail_path = $request->file('file')->store('public/thumbnail');
            $thumbnail_path = str_replace('public',"/storage", $thumbnail_path);
        }
        else{
            $thumbnail_path = "";
        }
        
        try{
            if($request->id == -1){
                $design = new Design([
                    'name'=>$request->designName, 
                    'data' =>$request->data,
                    'thumbnail' =>$thumbnail_path,
                    'description' => $request->description,
                    'category' => $request->category,
                    'keywords' => $request->keywords,
                ]);
                auth()->user()->designs()->save($design);    
            }
            else{
                $design = Design::findorFail($request->id);
                $design->name = $request->designName;
                $design->thumbnail = $thumbnail_path;
                $design->data = $request->data;
                $design->description = $request->description;
                $design->category = $request->category;
                $design->keywords = $request->keywords;
                $design->save();
            }    
            $responseMessage = "Saved Design!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Saving Design!";
        }
        
        return response()->json([
            'success' => true,
            'design_id' => $design->id,
            'message' => $responseMessage
        ], 200);
    }

    public function renameDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $design->name = $request->designName;
            $design->save();
            $responseMessage = "Changed Design Name!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Changing Design!";
        }
        
        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
    }

    public function deleteDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $design->delete();
            $responseMessage = "Deleted Design!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Changing Design!";
        }
        
        return response()->json([
            'success' => true,
            'design_id' => $design->id,
            'message' => $responseMessage
        ], 200);
    }

    public function duplicateDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $duplicatedPost = $design->replicate();
            $duplicatedPost->save();
            $responseMessage = "Duplicated Design Name!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Duplicating Design!";
        }
        
        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
    }

    

    public function listDesigns(Request $request){
        // $designs =  auth()->user()->designs()->get();
        // $responseMessage = "Loaded Designs!";
        // return response()->json([
        //     'success'=>true, 
        //     'message'=>$responseMessage,
        //     'designs'=>$designs
        // ],200);
        $pageNum = $request->get("current", 1);
        $pageSize = $request->get("pageSize", 50);
        $search = $request->get("search", "");
        $data = Design::where("user_id", auth()->user()->id);
        if($search != "") {
            $data = $data->where("name","like", "%$search%");
        }
        $total = $data->count();
        $data = $data->skip(($pageNum - 1) * $pageSize)->limit($pageSize)->get();

        $res = [];
        foreach($data as $item) {
            $res[] = [
                "id" => $item["id"],
                "thumbnail" => $item["thumbnail"],
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

    public function detailDesign($id){
        $data = Design::find($id);
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