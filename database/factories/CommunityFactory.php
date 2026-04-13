<?php

namespace Database\Factories;

use App\Models\Community;

use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityFactory extends Factory
{
    protected $model = Community::class;

    public function definition(): array
    {
        $names = [
        'Komunitas Pemuda',
        'Komunitas Ibu-Ibu',
        'Komunitas Bapak-Bapak',
        'Komunitas Pelayanan Musik',
        'Komunitas Pelayanan Anak',
        'Komunitas Pelayanan Sosial',
        'Komunitas Pelayanan Doa',
    ];
        return [
            'name' => $this->faker->randomElement($names),
            'description' => $this->faker->paragraph(),
        ];
    }
}
