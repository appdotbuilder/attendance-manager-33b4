<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\User;
use App\Services\AuthorizationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
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
    public function index(Request $request)
    {
        abort_unless($this->authService->canViewAttendance(auth()->user()), 403);
        $query = Attendance::with('user:id,name,employee_id,department')
            ->latest('clock_in_time');

        // Filter by user if provided
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('clock_in_time', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('clock_in_time', '<=', $request->date_to);
        }

        $attendances = $query->paginate(20);

        // Get users for filter dropdown (admin/staff only)
        $users = collect();
        if (auth()->user()->isAdmin() || auth()->user()->isStaff()) {
            $users = User::select('id', 'name', 'employee_id')
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'users' => $users,
            'filters' => $request->only(['user_id', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        try {
            $qrData = decrypt($request->qr_data);
            $user = User::findOrFail($qrData['user_id']);
        } catch (\Exception $e) {
            return back()->withErrors(['qr_data' => 'Invalid QR code.']);
        }

        $today = Carbon::today();
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('clock_in_time', $today)
            ->first();

        if ($request->action === 'clock_in') {
            if ($existingAttendance && !$existingAttendance->clock_out_time) {
                return back()->withErrors(['action' => 'You are already clocked in.']);
            }

            Attendance::create([
                'user_id' => $user->id,
                'clock_in_time' => now(),
                'notes' => $request->notes,
            ]);

            $message = 'Successfully clocked in at ' . now()->format('H:i');
        } else {
            if (!$existingAttendance || $existingAttendance->clock_out_time) {
                return back()->withErrors(['action' => 'You must clock in first.']);
            }

            $existingAttendance->update([
                'clock_out_time' => now(),
                'notes' => $request->notes ?: $existingAttendance->notes,
            ]);

            $message = 'Successfully clocked out at ' . now()->format('H:i');
        }

        return back()->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        abort_unless($this->authService->canViewAttendance(auth()->user(), $attendance), 403);

        return Inertia::render('attendances/show', [
            'attendance' => $attendance->load('user:id,name,employee_id,department')
        ]);
    }
}