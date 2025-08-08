<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScheduleRequest;
use App\Models\Schedule;
use App\Services\AuthorizationService;
use Inertia\Inertia;

class ScheduleController extends Controller
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
        abort_unless($this->authService->canManageSchedules(auth()->user()), 403);

        $schedules = Schedule::latest()->paginate(15);

        return Inertia::render('schedules/index', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless($this->authService->canManageSchedules(auth()->user()), 403);

        return Inertia::render('schedules/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        $schedule = Schedule::create($request->validated());

        return redirect()->route('schedules.show', $schedule)
            ->with('success', 'Schedule created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        abort_unless($this->authService->canManageSchedules(auth()->user()), 403);

        return Inertia::render('schedules/show', [
            'schedule' => $schedule
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        abort_unless($this->authService->canManageSchedules(auth()->user()), 403);

        return Inertia::render('schedules/edit', [
            'schedule' => $schedule
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreScheduleRequest $request, Schedule $schedule)
    {
        $schedule->update($request->validated());

        return redirect()->route('schedules.show', $schedule)
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        abort_unless($this->authService->canManageSchedules(auth()->user()), 403);

        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule deleted successfully.');
    }
}