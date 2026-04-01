<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Declaration;
use Illuminate\Http\Request;
<<<<<<< HEAD

=======
>>>>>>> 629a993ac342ef754eefbfeae04014c1615c9df3

class DeclarationController extends Controller
{
    public function getByPlan($plan_id)
    {
        $declarations = Declaration::where('plan_id', $plan_id)->get();


        if ($declarations->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
            return response()->json(['message' => 'No data found'], 404);
        }
        return response()->json($declarations);
    }
<<<<<<< HEAD
    }
=======
}
>>>>>>> 629a993ac342ef754eefbfeae04014c1615c9df3
