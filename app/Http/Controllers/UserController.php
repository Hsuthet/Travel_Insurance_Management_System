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
    $users = User::query()
        // 1. Filter by Role (matches your React 'role' state)
        ->when($request->role && $request->role !== 'role', function ($query) use ($request) {
            $query->where('role', $request->role);
        })
        // 2. Filter by Date Range
        ->when($request->startDate, function ($query, $startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        })
        ->when($request->endDate, function ($query, $endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        })
        // 3. Finalize Query
        ->latest()
        ->paginate($request->perPage ?? 10)
        ->withQueryString(); // Keeps filters active when clicking page numbers

    return Inertia::render('Admin/UserManagement', [
        'users' => $users,
        'filters' => $request->only(['role', 'startDate', 'endDate', 'perPage']),
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
        'role'     => 'required|string|in:admin,superadmin', 
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
    return redirect()->route('admin.users.index')->with('message', 'User created successfully!');
}

   public function edit(User $user)
{
    return Inertia::render('Admin/UserForm', [
        'user' => $user
    ]);
}
public function update(Request $request, User $user)
{
    // 1. Validation (Capture the validated data in a variable)
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'role' => 'required|string|in:admin,superadmin',
        'email' => [
            'required', 
            'email', 
            Rule::unique('users')->ignore($user->id)
        ],
        'password' => 'nullable|confirmed|min:8',
    ]);

    // 2. Remove password from the array if it's empty
    if ($request->filled('password')) {
        $validated['password'] = Hash::make($request->password);
    } else {
        // If password is null/empty, remove it so we don't overwrite with null
        unset($validated['password']);
    }

    // 3. Perform Update using the validated array
    $user->update($validated);

    // 4. Redirect
    return redirect()->route('admin.users.index')
        ->with('message', 'User account updated successfully!');
}
public function destroy(User $user)
{
    // Prevent self-deletion
    if ($user->id === Auth::id()) {
        return back()->with('error', 'You cannot delete yourself.');
    }

    $user->delete();

    return redirect()->route('admin.users.index')->with('message', 'User deleted successfully');
}
}