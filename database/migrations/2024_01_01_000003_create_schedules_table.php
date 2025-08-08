<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Name of the schedule');
            $table->time('start_time')->comment('Start time for the schedule');
            $table->time('end_time')->comment('End time for the schedule');
            $table->json('working_days')->comment('Array of working days (0=Sunday, 1=Monday, etc.)');
            $table->boolean('is_active')->default(true)->comment('Whether this schedule is active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('is_active');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};