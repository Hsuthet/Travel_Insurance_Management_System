<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;


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

    public function create()
    {
        return Inertia::render('Admin/UserForm');
    }
    
    public function store(Request $request)
{
    // 1. Validation - Matches your React form options exactly
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'role'     => 'required|string|in:admin,superadmin', // Only these two
        'password' => 'required|confirmed|min:8',
    ]);

    // 2. Create the User
    User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'role'     => $request->role,
        'password' => Hash::make($request->password),
    ]);

    // 3. Redirect back to the list with a success message
    return redirect()->route('users.index')->with('message', 'User created successfully!');
}

   public function edit(User $user)
{
    return Inertia::render('Admin/UserForm', [
        'user' => $user
    ]);
}
public function update(Request $request, User $user)
{
    // 1. Validation
    $request->validate([
        'name'  => 'required|string|max:255',
        'role'  => 'required|string|in:admin,superadmin',
        // 'unique:users,email,'.$user->id  allows the current user to keep their email
        'email' => [
            'required', 
            'email', 
            Rule::unique('users')->ignore($user->id)
        ],
        // Password is 'nullable' so they can leave it blank to keep the old one
        'password' => 'nullable|confirmed|min:8',
    ]);

    // 2. Prepare Data
    $updateData = [
        'name'  => $request->name,
        'email' => $request->email,
        'role'  => $request->role,
    ];

    // 3. Only Hash and Update password if it was provided
    if ($request->filled('password')) {
        $updateData['password'] = Hash::make($request->password);
    }

    // 4. Perform Update
    $user->update($updateData);

    // 5. Redirect back to User Management with a success message
    return redirect()->route('users.index')->with('message', 'User updated successfully!');
}

public function destroy(User $user)
{
    // Prevent self-deletion
    if ($user->id === Auth::id()) {
        return back()->with('error', 'You cannot delete yourself.');
    }

    $user->delete();

    return redirect()->route('users.index')->with('message', 'User deleted successfully');
}
}