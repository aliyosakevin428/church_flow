<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Requests\BulkUpdateArticleRequest;
use App\Http\Requests\BulkDeleteArticleRequest;
use App\Models\Article;
use App\Models\Community;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Requests\UploadArticleMediaRequest;


class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index article");

        $data = Article::query()
            ->with(['media', 'user', 'komunitas'])
            ->when($request->search, function($q, $v){
                $q->where('title', 'like', "%{$v}%");
            })
            ->latest();

        return Inertia::render('article/index', [
            'articles' => $data->get(),
            'Komunitas' => Community::all(),
            'CreatedBy' => Article::select('created_by')->distinct()->with('user')->get()->pluck('user', 'created_by'),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create article"),
                'canShow' => $this->user->can("show article"),
                'canUpdate' => $this->user->can("update article"),
                'canDelete' => $this->user->can("delete article"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $this->pass("create article");

        $data = $request->validated();

        $data['slug'] = Str::slug($data['title']);
        $data['created_by'] = auth()->id();

        $article = Article::create($data);

        if ($request->hasFile('image')){
            $article->addMediaFromRequest('image')->toMediaCollection('articles');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        $this->pass("show article");

        $article->load(['media', 'user', 'komunitas']);

        return Inertia::render('article/show', [
            'article' => $article,
            'permissions' => [
                'canUpdate' => $this->user->can("update article"),
                'canDelete' => $this->user->can("delete article"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        $this->pass("update article");

        $data = $request->validated();

        if (isset($data['title'])){
            $data['slug'] = Str::slug($data['title']);
        }

        $article->update($data);

        if ($request->hasFile('image')){
            $article->clearMediaCollection('articles');
            $article->addMediaFromRequest('image')->toMediaCollection('articles');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $this->pass("delete article");

        $article->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateArticleRequest $request)
    {
        $this->pass("update article");

        $data = $request->validated();
        $ids = $data['article_ids'];
        unset($data['article_ids']);

        Article::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteArticleRequest $request)
    {
        $this->pass("delete article");

        $data = $request->validated();
        Article::whereIn('id', $data['article_ids'])->delete();
    }



    /**
     * Register media conversions.
     */
    public function uploadMedia(UploadArticleMediaRequest $request, Article $article)
    {
        $this->pass("update article");

        $data = $request->validated();
        $article->addMedia($data['file'])->toMediaCollection($data['collection_name']);
    }
}
