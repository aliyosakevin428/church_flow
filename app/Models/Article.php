<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;


class Article extends Model implements HasMedia
{
    use HasFactory;

    use InteractsWithMedia;


    //protected $table = 'articles';

    /*
    protected $fillable = [
        'komunitas_id',
        'title',
        'content',
        'created_by',
        'created_at'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }
    public function komunitas()
    {
        return $this->belongsTo(Community::class);
    }

    // Relasi dengan User (pembuat artikel/pekerja gereja)
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
