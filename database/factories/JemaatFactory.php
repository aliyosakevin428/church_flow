<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\Jemaat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JemaatFactory extends Factory
{
    protected $model = Jemaat::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->value('id'),
            'komunitas_id' => Community::inRandomOrder()->value('id'),
            'name' => $this->faker->name(),
            'tanggal_lahir' => $this->faker->date(),
            'no_hp' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
        ];
    }
}
