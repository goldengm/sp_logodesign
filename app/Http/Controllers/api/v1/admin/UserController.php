<?php

namespace App\Http\Controllers\api\v1\admin;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use Auth;
use DB;
use Illuminate\Contracts\Database\Eloquent\Builder;


class UserController extends BaseController
{
    public function getUsers(Request $request) {
        $pageNum = $request->get("current", 1);
        $pageSize = $request->get("pageSize", 10);
        $search = $request->get("search", "");
        $field = $request->get("field", "");
        $direction = $request->get("direction", "");
            
        // $data = User::whereNot("role", "admin")->with(['lasttoken'])->withCount('designs')->with(['sub.plan']);
        $data = DB::table('users')
        ->select('users.*', 
            DB::raw('(select count(*) from designs where users.id = designs.user_id) as designs_count'),
            DB::raw('(select created_at from personal_access_tokens where users.id = personal_access_tokens.tokenable_id limit 1) as last_login'),
            DB::raw('(select name from plans where plans.stripe_plan = (select stripe_price from subscriptions where subscriptions.user_id = users.id limit 1)) as plan_name')
        );

        if($search != "") {
            $data = $data->where("name","like", "%$search%")->orWhere("email","like", "%$search%");
        }
        if($field != "") {
            $data = $data->orderBy($field, $direction === "true"? "asc": "desc");
        }
        $total = $data->count();
        $data = $data->skip(($pageNum - 1) * $pageSize)->limit($pageSize)->get();
        return response()->json([
            "success" => true,
            "data" => $data,
            "total" => $total
            ],200);
    }

    public function getUser($id) {
        $user = User::where("id", $id)->with("designs")->with("sub")->with("lasttoken")->first();
        $user['active'] = false;
        $user['cancelled'] = false;
        $user['ended'] = false;
        $user['ends_at'] = null;
        $user['plan'] = null;
        $plan = null;
        $subscriptionPlan = $user->subscription('default');
        if ($subscriptionPlan != null) {
            $user['active'] = $subscriptionPlan->active();
            $user['cancelled'] = $subscriptionPlan->canceled();
            $user['ended'] = $subscriptionPlan->ended();
            $user['ends_at'] = $subscriptionPlan->ends_at;
            $user['plan'] = Plan::where('stripe_plan', $subscriptionPlan->stripe_price)->first();
        }
        unset($user['subscriptions']);
        return $user;
    }

    public function spoofing(Request $request) {

        $validator = Validator::make($request->all(),[
            'email' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray()
            ], 200);
        }

        auth()->guard('web')->logout();

        $user = User::where('email', $request->email)->first();

        auth()->guard('web')->login($user);

        if($user){
            $accessToken = $user->createToken('authToken')->plainTextToken;
            $responseMessage = "Login Successful";
            
            $user['active'] = false;
            $user['cancelled'] = false;
            $user['ended'] = false;
            $user['ends_at'] = null;
            $user['plan'] = null;

            $user['spoofing'] = true;

            $plan = null;
            $subscriptionPlan = $user->subscription('default');
            if ($subscriptionPlan != null) {
                $user['active'] = $subscriptionPlan->active();
                $user['cancelled'] = $subscriptionPlan->canceled();
                $user['ended'] = $subscriptionPlan->ended();
                $user['ends_at'] = $subscriptionPlan->ends_at;
                $user['plan'] = Plan::where('stripe_plan', $subscriptionPlan->stripe_price)->first();
            }
            unset($user['subscriptions']);

            return response()->json([
                    "success" => true,
                    "message" => $responseMessage,
                    "user" => $user,
                    "token" => $accessToken
                    ],200);
        }
        else{
            $responseMessage = "Sorry, this user does not exist";
            return response()->json([
                "success" => false,
                "message" => $responseMessage,
                "error" => $responseMessage
            ], 422);
        }
    }

    public function cancelSpoofing(Request $request) {

        auth()->guard('web')->logout();

        $user = User::where('role', "admin")->first();

        auth()->guard('web')->login($user);

        if($user){
            $accessToken = $user->createToken('authToken')->plainTextToken;
            $responseMessage = "Login Successful";
            
            $user['active'] = false;
            $user['cancelled'] = false;
            $user['ended'] = false;
            $user['ends_at'] = null;
            $user['plan'] = null;

            $plan = null;
            $subscriptionPlan = $user->subscription('default');
            if ($subscriptionPlan != null) {
                $user['active'] = $subscriptionPlan->active();
                $user['cancelled'] = $subscriptionPlan->canceled();
                $user['ended'] = $subscriptionPlan->ended();
                $user['ends_at'] = $subscriptionPlan->ends_at;
                $user['plan'] = Plan::where('stripe_plan', $subscriptionPlan->stripe_price)->first();
            }
            unset($user['subscriptions']);

            return response()->json([
                    "success" => true,
                    "message" => $responseMessage,
                    "user" => $user,
                    "token" => $accessToken
                    ],200);
        }
        else{
            $responseMessage = "Sorry, this user does not exist";
            return response()->json([
                "success" => false,
                "message" => $responseMessage,
                "error" => $responseMessage
            ], 422);
        }
    }

    public function cancelSubscription(Request $request) {

        $subId = $request->subscriptionId;
        $endAt = $request->endAt;

		$subscription = Subscription::find($subId);

        $subscription->ends_at = $endAt;
        $subscription->save();

        $user = User::find($subscription->user_id);

		$user->cancelled_plan_name = $subscription->stripe_price;
		$user->cancelled = 1;
		$user->save();
		return response()->json([
            'success' => true,
            'message' => "Subscription Canceled."
        ], 200);
    }
}


