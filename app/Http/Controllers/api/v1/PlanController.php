<?php

// app/Http/Controllers/PlanController.php

namespace App\Http\Controllers\api\v1;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use App\Models\Plan; // Ensure a corresponding Eloquent model for plans is created.
use Illuminate\Routing\Controller as BaseController;
use Stripe;

class PlanController extends BaseController
{
    public function getUserPlans()
    {
        $user = Auth::user();
		$subscriptionPlan = $user->subscription('default');
		$cancelled = false;
		if ($subscriptionPlan != null) {
			$cancelled = $subscriptionPlan->canceled();
		}
		

		$dbplans = Plan::getPlans();
		$plans = [];
		
		foreach ($dbplans as $plan) {

			$ends_at = $subscriptionPlan && $subscriptionPlan->stripe_price == $plan->stripe_plan ? $subscriptionPlan->ends_at : null;
			$cancelled = $subscriptionPlan && $subscriptionPlan->stripe_price == $plan->stripe_plan ? $subscriptionPlan->canceled() : false;
			$ended = false;
			if ($subscriptionPlan) {
				$ended = $cancelled ? $subscriptionPlan->ended() : $subscriptionPlan->pastDue();
			}

			$plans[] = array(
				'subscribed' => $user->subscribedToPrice($plan, 'default'),
				'title' => $plan->name,
				'stripe_plan'=>$plan->stripe_plan,
				'cost'=>$plan->cost,
				'ends_at' => $ends_at,
				'cancelled'=> $cancelled,
				'ended' => $ended
			);
		}
        return response()->json($plans);
    }

    public function getUserSubscription(Request $request)
	{
		$user = auth()->user();

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
			'user' => $user,
			'subscriptionPlan' => $subscriptionPlan
		]);
	}

    public function getCustomer(Request $request)
	{
		$cardHolderName = $request->cardHolderName;
		$user = Auth::user();
		if($cardHolderName) {
			$user->name = $cardHolderName;
			$user->save();
		}
		// $cancelled = false;
		// $subscriptionPlan = $user->subscription('default');
		// if ($subscriptionPlan != null) {
		// 	$cancelled = $subscriptionPlan->canceled();
		// }

		// if(! $user->subscribed('default')) {
		if(! $user->subscribed('default')) {
			// $options = [
			// 	'email' => $user->email
			// ];
			// $user->createOrGetStripeCustomer($options);
			$user->createOrGetStripeCustomer();
		}

		$intent = $user->createSetupIntent();
		return $intent->client_secret;
	}

    public function subscribe(Request $request)
	{
		Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
		$stripeToken = $request->tokenInput;
		$plan_name = $request->plan;
		$plan = Plan::where('slug', $plan_name)->first();
		if(!$plan){
			 return response()->json([
                'success' => false,
                'message' => "The plan does not exist."
            ], 200);
		}
		$plan = $plan->stripe_plan;
		$user = Auth::user();
        
		// $user->subscription('default')->canceled();
		// if($user->subscribedToPrice($plan, 'default')) {
		$cancelled = false;
		$subscriptionPlan = $user->subscription('default');
		if ($subscriptionPlan != null) {
			$cancelled = $subscriptionPlan->canceled();
		}

		// echo "<pre>";
		// echo $user->subscribed('default');
		// echo $cancelled;
		// echo $user->subscribedToPrice($plan, 'default');
		// echo "</pre>";

		// if($user->subscribedToPrice($plan, 'default')) {

		if($user->subscribedToPrice($plan, 'default') && !$cancelled) {
            return response()->json([
                'success' => false,
                'message' => "Subscription Failed."
            ], 200);
		}

        try {
            $user->addPaymentMethod($stripeToken);
            $user->newSubscription('default', $plan)->create($stripeToken, [
                            'email' => $user->email
            ]);
        } catch(e) {
            return response()->json([
                'success' => false,
                'message' => "Subscription Failed."
            ], 200); 
        }
		
		$user->cancelled = 0;
		$user->save();
		return response()->json([
            'success' => true,
            'message' => "Successfully subscribed."
        ], 200);
	}

    public function changePlan(Request $request, $plan)
	{
		$user = Auth::user();
		$type = $request->input('type');
		$plan = Plan::where('slug', $plan)->first();
		$plan = $plan->stripe_plan;
		$user->subscription('default')->swapAndInvoice($plan);
		$user->cancelled = 0;
		$user->cancelled_plan_name = null;
		$user->save();
		return response()->json([
            'success' => true,
            'message' => "Subscription Updated."
        ], 200);
	}

    public function removecustomer(Request $request)
	{
		$user = Auth::user();
		$result = $user->asStripeCustomer();
		$result->delete();
		$user->stripe_id = null;
		$user->save();
		echo json_encode($result);
	}

	public function cancel(Request $request)
	{
		$user = Auth::user();

		$subscriptionPlan = $user->subscription('default');

		$stripe_plan = $subscriptionPlan->stripe_price;
		$subscriptionPlan->cancel();
// 		$result = $user->asStripeCustomer();
// 		$result->delete();
		
		// $user->stripe_id = '';
		$user->cancelled_plan_name = $stripe_plan;
		$user->cancelled = 1;
		$user->save();
		return response()->json([
            'success' => true,
            'message' => "Subscription Canceled."
        ], 200);
	}

	public function restorePlan(Request $request)
	{
		$user = Auth::user();
		$subscriptionPlan = $user->subscription('default');
		$subscriptionPlan->resume();
		$user->cancelled = 0;
		$user->cancelled_plan_name = null;
		$user->save();
		return response()->json([
            'success' => true,
            'message' => "Subscription Restored."
        ], 200);
	}

}

