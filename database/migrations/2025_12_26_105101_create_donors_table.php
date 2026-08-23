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
        Schema::create('donors', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->integer('age');
    $table->string('blood_type'); // A+, O-, etc.
    $table->string('phone')->nullable();
    $table->date('last_donation_date')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
