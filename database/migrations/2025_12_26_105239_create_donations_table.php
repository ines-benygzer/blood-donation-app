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
        Schema::create('donations', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('donor_id');
    $table->unsignedBigInteger('session_id');
    $table->integer('quantity'); // ml donated
    $table->date('date');
    $table->timestamps();

    $table->foreign('donor_id')->references('id')->on('donors')->onDelete('cascade');
    $table->foreign('session_id')->references('id')->on('sessions')->onDelete('cascade');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
