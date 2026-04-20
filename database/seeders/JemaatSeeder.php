<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jemaat;

class JemaatSeeder extends Seeder
{
    public function run(): void
    {
        Jemaat::factory()->count(10)->create();
    }
}
