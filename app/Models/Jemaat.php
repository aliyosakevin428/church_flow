<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;


class Jemaat extends Model
{
    use HasFactory;
    use SoftDeletes;



    //protected $table = 'jemaats';

    /*
    protected $fillable = [
        'user_id',
        'komunitas_id',
        'name',
        'tanggal_lahir',
        'no_hp',
        'email'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function komunitas()
    {
        return $this->belongsTo(Community::class, 'komunitas_id');
    }
}
