<?php

namespace App\Models;
use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Subscription extends Model
{
    // protected $casts = [
    //     'content' => 'array'
    // ];

	public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

	public function plan(): HasOne
    {
        return $this->hasOne(Plan::class, 'stripe_plan', "stripe_price");
    }

    static function getUserSubscribedPlan($user_id) {
		$sub = DB::table('subscriptions')
			->join('plans', 'subscriptions.stripe_price', '=', 'plans.stripe_plan')
			->select('plans.name', 'subscriptions.stripe_id', 'subscriptions.stripe_price', 'subscriptions.stripe_status', 'subscriptions.ends_at', 'subscriptions.created_at')
			->where('subscriptions.stripe_status','active')
            ->where('subscriptions.user_id', $user_id)
            ->orderBy('subscriptions.created_at', 'desc')
			->get();
		
		if(count($sub) > 0){
			return $sub[0];
		} else {
			return null;
		}
	}
}
