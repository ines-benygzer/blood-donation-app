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
        Schema::create('hospital_requests', function (Blueprint $table) {
            $table->id();
            $table->string('hospital_name');
            $table->string('blood_type');
            $table->integer('quantity');
            $table->boolean('is_urgent')->default(true);
            $table->enum('status', ['pending', 'fulfilled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospital_requests');
    }
};
