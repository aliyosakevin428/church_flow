<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Community;

class CommunitySeeder extends Seeder
{

    public function run(): void
    {
        Community::factory()->count(10)->create();
    }
}

