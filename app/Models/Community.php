<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;


class Community extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'communities';

    /*
    protected $fillable = [
        'name',
        'description'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function jemaats()
    {
        return $this->hasMany(Jemaat::class, 'komunitas_id');
    }

    public function articles()
    {
        return $this->hasMany(Article::class, 'komunitas_id');
    }

}
