<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Community;
use App\Models\Komunita;
use App\Models\CreatedBy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'komunitas_id' => Community::exists() ? Community::inRandomOrder()->first()->id : Community::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => fake()->paragraph(2, true),
            'created_by' => User::exists() ? User::inRandomOrder()->first()->id : User::factory(),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
