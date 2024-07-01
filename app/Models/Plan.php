<?php

namespace App\Models;
use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plan extends Model
{

	public function sub(): BelongsTo
    {
        return $this->belongsTo(Subscription::class, 'stripe_plan', "stripe_price");
    }

	static function setStripeToken($id, $type, $token){
		DB::table('users')->where('id', $id)->update(['planid' => $type,'stripe_id'=>$token]);
	}
	static function getPlan($id) {
		$plan = DB::table('plans')->select('stripe_plan')->where('id', $id)->get();

		return $plan[0]->stripe_plan;
	}
	static function getPlans() {
		$plans = DB::table('plans')->select('*')->orderBy('cost', 'asc')->get();
		return $plans;
	}

	static function getUsersPlan() {
		$sub = DB::table('subscriptions')
			->join('plans', 'subscriptions.stripe_price', '=', 'plans.stripe_plan')
			->select('subscriptions.user_id','plans.name')
			->where('subscriptions.stripe_status','active')
			->get();
		$res = array();
		if(count($sub)>0){
			foreach($sub as $each){
				$res[$each->user_id] = $each->name;
			}
			return $res;
		} else {
			return false;
		}
	}
}
