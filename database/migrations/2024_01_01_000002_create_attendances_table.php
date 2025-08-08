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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('clock_in_time')->comment('Time when user clocked in');
            $table->timestamp('clock_out_time')->nullable()->comment('Time when user clocked out');
            $table->text('notes')->nullable()->comment('Optional notes for the attendance record');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('clock_in_time');
            $table->index(['user_id', 'clock_in_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};