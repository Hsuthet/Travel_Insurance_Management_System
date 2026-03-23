<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get users from the database (paginated)
        $users = User::paginate(10);

        // 2. Tell Inertia to show the 'UserManagement' React page
        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'filters' => [
                'status' => $request->status ?? '',
                'perPage' => $request->perPage ?? 10
            ],
        ]);
    }
}