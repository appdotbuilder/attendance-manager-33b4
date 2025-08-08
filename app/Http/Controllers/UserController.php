<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\AuthorizationService;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * The authorization service instance.
     *
     * @var AuthorizationService
     */
    protected $authService;

    /**
     * Create a new controller instance.
     *
     * @param AuthorizationService $authService
     */
    public function __construct(AuthorizationService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        abort_unless($this->authService->canManageUsers(auth()->user()), 403);

        $users = User::select('id', 'name', 'email', 'role', 'employee_id', 'department', 'created_at')
            ->latest()
            ->paginate(15);

        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless($this->authService->canManageUsers(auth()->user()), 403);

        return Inertia::render('users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return redirect()->route('users.show', $user)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        abort_unless($this->authService->canViewUser(auth()->user(), $user), 403);

        return Inertia::render('users/show', [
            'user' => $user->load('attendances:id,user_id,clock_in_time,clock_out_time')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        abort_unless($this->authService->canUpdateUser(auth()->user(), $user), 403);

        return Inertia::render('users/edit', [
            'user' => $user->only('id', 'name', 'email', 'role', 'employee_id', 'department')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        abort_unless($this->authService->canDeleteUser(auth()->user(), $user), 403);

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}